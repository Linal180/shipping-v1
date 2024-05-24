import axios from 'axios'
import { Request } from 'express'

import User from '../models/user';
import Label from '../models/label';
import Shipment from '../models/shipment';

import { COMMISSION_PERCENTAGE } from '../constants';
import { customizeLabel, getNextSequenceId } from '../lib';
import { createLabel, getAftershipRates } from "../aftershipService";
import {
  CustomRequest, GetAftershipRatesType, GetTrackingServiceResponse, LabelPayloadType
} from "../interfaces";

export const getPDFFile = async (id: string) => {
  try {
    const url = await getLabelFile(id);

    if (url) {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
        headers: { 'Content-Type': 'application/pdf' }
      });

      return response.data
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch PDF:', error);
    return null
  }
};


export const getRates = async (shipment: GetAftershipRatesType) => {
  try {
    const rates = await getAftershipRates(shipment)

    const parsedRates = rates.map(rate => {
      return {
        serviceName: rate.service_name,
        serviceCode: rate.service_type,
        charges: {
          weight: rate.charge_weight,
          perUnit: {
            priceWithoutVAT: rate.total_charge.amount * COMMISSION_PERCENTAGE,
            VAT: '0.0',
            total: rate.total_charge.amount * COMMISSION_PERCENTAGE,
            currency: rate.total_charge.currency
          }
        }
      }
    });

    return parsedRates;
  } catch (error) {
    console.log((error as any).message);
    return []
  }
};

export const getSingleLabel = async (req: Request) => {
  try {
    const { params: { id } } = req || {};

    if (id) {
      const label = await Label.findOne({ _id: id })

      if (label) return customizeLabel(label);
    }

    return null;
  } catch (error) {
    console.log((error as any).message);
    return null
  }
};

export const getLabelTracking = async (req: Request): Promise<GetTrackingServiceResponse> => {
  try {
    const { params: { tracking } } = req || {};

    if (tracking) {
      const label = await Label.findOne({ trackingNumbers: tracking })

      if (label) {
        return {
          status: 200, message: "Tracking successfully found",
          tracking: {
            shipment_created: new Date().toISOString(),
            picked_up: new Date().toISOString(),
            departed_from_facility: new Date().toISOString(),
            arrived_at_facility: new Date().toISOString(),
            at_departure_hub: true,
            in_transit: false,
            at_arrival_hub: false,
            delivery_in_progress: true,
            delivery_exception: "",
            delivered: false,
            unknown: "****"
          }
        }
      }

      return {
        status: 404, message: "Tracking number not found", tracking: null
      }
    }

    return {
      status: 400, message: "Missing tracking number", tracking: null
    }

  } catch (error) {
    console.log((error as any).message);
    return null
  }
};

export const getUserLabels = async (req: CustomRequest) => {
  try {
    const { user: { userId }, query } = req || {};
    const { page, limit } = query || {}

    if (userId) {
      const currentUser = await User.findOne({ _id: userId })

      if (currentUser) {
        const pageNumber = parseInt(page as string ?? '1') || 1;
        const limitNumber = parseInt(limit as string ?? '10') || 10;

        const labels = await Label.find({ userId })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber)
          .lean()
          .exec();

        const updateLabels = labels.map(label => customizeLabel(label));

        return updateLabels;
      }
    }

    return null;
  } catch (error) {
    console.log((error as any).message);
    return []
  }
};

export const createLabelForShipment = async (payload: LabelPayloadType, userId: string): Promise<Omit<typeof Label, 'file'> | null> => {
  try {
    const label = await createLabel(payload)

    if (label) {
      const { id, files, rate, ship_date, status, tracking_numbers, shipper_account, order_id, order_number } = label
      const { service_name, service_type, total_charge } = rate || {}
      const { label: { file_type, paper_size, url } = {} } = files
      const { amount, currency } = total_charge || {}

      const localLabelDoc = await Label.create({
        _id: await getNextSequenceId('labels'),
        userId,
        status,
        charge: {
          amount: ((amount ?? 1) * COMMISSION_PERCENTAGE).toFixed(2),
          currency: currency ?? 'usd'
        },
        externalId: id,
        file: { fileType: file_type, paperSize: paper_size, url },
        serviceName: service_name || '',
        serviceType: service_type || '',
        shipDate: ship_date,
        shipperAccount: shipper_account,
        trackingNumbers: tracking_numbers,
        orderNumber: order_number,
        orderId: order_id,
      })

      const localLabel = localLabelDoc.toObject();

      return customizeLabel(localLabel) as unknown as Omit<typeof Label, 'file'>
    }
  } catch (error) {
    console.log((error as any).message);
    return null
  }
};

const getLabelFile = async (id: string): Promise<string> => {
  if (id) {
    const label = await Label.findOne({ _id: id }).exec()

    if (label) {
      return label.file.url
    }
  }

  throw new Error('Could not find label')
}
