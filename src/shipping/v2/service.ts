import { Request } from "express";
import User from "../../models/user";
import Shipment from "../../models/shipment";

import { getDHLRateGenericResponse, printLogs } from "../../lib";
import { createDHLShipment, getRates as getDHLRates, getDHLShipmentTracking } from '../../carriers/DHL'
import { CustomRequest, GetRatesV2Body, TCreateShipmentV2Body } from "../../interfaces";
import shipment from "../../models/shipment";

export const getCarrierRates = async (body: GetRatesV2Body) => {
  const { carrier, ...params } = body || {};

  try {
    if (carrier === 'DHL') {
      const rates = await getDHLRates(params as Omit<GetRatesV2Body, 'carrier'>)

      const genericResponse = getDHLRateGenericResponse(rates)
      return genericResponse;
    }

    return null
  } catch (error) {
    printLogs(`V2 Service ${getCarrierRates.name}`, error)
    return null
  }
};

export const createCarrierShipment = async (req: CustomRequest) => {
  const { body, user } = req || {}
  const { carrier } = body || {};

  try {
    if (carrier === 'DHL') {
      const { shipmentTrackingNumber, ...rest } = await createDHLShipment(body as TCreateShipmentV2Body)

      const ship = await Shipment.create({
        userId: user.userId,
        trackingNumber: shipmentTrackingNumber,
        ...rest
      })

      return await Shipment.findOne(ship._id)
        .select('-documents -trackingUrl -packages')
        .exec();
    }
  } catch (error) {
    printLogs(`V2 Service ${getCarrierRates.name}`, error)
    return null
  }
};

export const getAllShipments = async (req: CustomRequest) => {
  const { query } = req || {};
  const { page, limit } = query || {}

  const pageNumber = parseInt(page as string ?? '1') || 1;
  const limitNumber = parseInt(limit as string ?? '10') || 10;

  try {
    const shipments = await Shipment.find()
      .select('-documents')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean()
      .exec();

    return { shipments, page: pageNumber };
  } catch (error) {
    printLogs(getAllShipments.name, error)
    return null
  }
};

export const getShipment = async (id: string) => {
  try {
    const shipment = await Shipment.findById(id)
      .select('-documents -trackingUrl -packages')
      .lean()
      .exec();

    return shipment ? {
      shipment, status: 200
    } : {
      shipment: null, status: 404
    }
  } catch (error) {
    printLogs(getAllShipments.name, error)
    return { shipment: null, status: 500}
  }
};

export const getUserShipments = async (req: CustomRequest) => {
  const { user: { userId }, query } = req || {};
  const { page, limit } = query || {}

  const pageNumber = parseInt(page as string ?? '1') || 1;
  const limitNumber = parseInt(limit as string ?? '10') || 10;

  try {
    if (userId) {
      const currentUser = await User.findOne({ _id: userId })

      if (currentUser) {
        const shipments = await Shipment.find({ userId })
          .select('-documents -trackingUrl -packages')
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber)
          .lean()
          .exec();

        return { shipments, page: pageNumber };
      }
    }
  } catch (error) {
    printLogs(getAllShipments.name, error)
    return null
  }
};

export const getShipmentDocumentByTracking = async (req: Request) => {
  const { tracking } = req.params;

  try {
    const shipment = await Shipment.findOne({ trackingNumber: tracking });

    if (!shipment) {
      return {
        status: 404,
        message: "Shipment not found"
      }
    }

    const documents = shipment.documents.map((document, index) => {
      const fileUrl = `${req.protocol}://${req.get('host')}/pdf/${document._id}.pdf`;
      return {
        [`Document ${index + 1}`]: fileUrl,
      };
    });

    return { status: 200, message: "Documents retrieved successfully", documents }
  } catch (error) {
    printLogs(`Service ${getShipmentDocumentByTracking}`, error)
    return {
      status: 500,
      documents: [],
      message: "Internal Server Error"
    }
  }
}

export const getShipmentTracking = async (trackingNumber: string) => {
  try {
    const tracking = await getDHLShipmentTracking(trackingNumber)

    return {
      status: 200,
      message: 'Tracking retrieved successfully',
      tracking
    }
  } catch (error) {
    printLogs(`Service ${getShipmentTracking.name}`, error)
  }
};