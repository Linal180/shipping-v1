import axios from 'axios'
import User from '../models/user';
import Label from '../models/label';
import { generateLabelFileUrl } from '../lib';
import { COMMISSION_PERCENTAGE } from '../constants';
import { createLabel, getAftershipRates } from "../aftershipService";
import { CustomRequest, GetAftershipRatesType, LabelPayloadType } from "../interfaces";

export const getPDFFile = async (id: string) => {
  try {
    const url = await getLabelFile(id);

    if(url){
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
        ServiceName: rate.service_name,
        charges: {
          weight: rate.charge_weight,
          perUnit: {
            priceVAT: rate.total_charge.amount * COMMISSION_PERCENTAGE,
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

export const getUserLabels = async (req: CustomRequest) => {
  try {
    const { user: { userId }, query } = req || {};
    const { page, limit } = query || {}

    if(userId){
      const currentUser = await User.findOne({ _id: userId })

      if(currentUser){
        const pageNumber = parseInt(page as string ?? '1') || 1;
        const limitNumber = parseInt(limit as string ?? '10') || 10;

        const labels = await Label.find({ userId })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber)
          .lean()
          .exec();

          const updateLabels = labels.map(label => ({
            ...label,
            file: generateLabelFileUrl(label._id.toString())
          }));

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
      const { service_name, service_type, total_charge } = rate
      const { label: { file_type, paper_size, url } = {} } = files
      const { amount, currency } = total_charge

      const localLabelDoc = await Label.create({
        userId,
        status,
        charge: {
          amount: (amount * COMMISSION_PERCENTAGE).toFixed(2),
          currency
        },
        externalId: id,
        file: { fileType: file_type, paperSize: paper_size, url },
        serviceName: service_name,
        serviceType: service_type,
        shipDate: ship_date,
        shipperAccount: shipper_account,
        trackingNumbers: tracking_numbers,
        orderNumber: order_number,
        orderId: order_id,
      })

      const localLabel = localLabelDoc.toObject();

      return {
        ...localLabel,
        file: generateLabelFileUrl(localLabel._id.toString())
      } as any;
    }
  } catch (error) {
    console.log((error as any).message);
    return null
  }
};

const getLabelFile = async (id: string): Promise<string> => {
  if(id){
    const label = await Label.findOne({ _id: id }).exec()

    if(label) {
      return label.file.url
    }
  }

  throw new Error('Could not find label')
}
