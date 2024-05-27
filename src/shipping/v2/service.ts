import { Request } from "express";
import User from "../../models/user";
import Shipment from "../../models/shipment";

import { getDHLRateGenericResponse, printLogs } from "../../lib";
import {
  createDHLShipment, getRates as getDHLRates, getDHLShipmentTracking
} from '../../carriers/DHL'
import {
  CustomRequest, GetRatesV2Body, TCreateShipmentDHLResponse, TCreateShipmentV2Body
} from "../../interfaces";

export const getCarrierRates = async (body: GetRatesV2Body) => {
  const { carrier, ...params } = body || {};

  try {
    if (carrier === 'DHL') {
      const { data, message, status } = await getDHLRates(params as Omit<GetRatesV2Body, 'carrier'>)

      if (status === 200) {
        const genericResponse = getDHLRateGenericResponse(data);


        return {
          status, message, data: genericResponse
        };
      }

      return { status, message, data: {} }
    }

    return {
      status: 400, message: 'Bad request', data: null
    }
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
      const { data, message, status } = await createDHLShipment(body as TCreateShipmentV2Body)

      if (status === 200) {
        const { shipmentTrackingNumber, ...rest }: TCreateShipmentDHLResponse = data || {}

        const ship = await Shipment.create({
          userId: user.userId,
          trackingNumber: shipmentTrackingNumber,
          ...rest
        })

        const newShipment = await Shipment.findOne(ship._id)
          .select('-documents -trackingUrl -packages')
          .exec();

        return {
          status,
          message,
          data: newShipment
        }
      }

      return {
        message, status, data
      }
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
      .select('-documents -trackingUrl -packages')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean()
      .exec();

    return { message: '', status: 200, data: { shipments, page: pageNumber } };
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
    return { shipment: null, status: 500 }
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

        return { data: { shipments, page: pageNumber }, status: 200 };
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

    return { status: 200, message: "Documents retrieved successfully", data: documents }
  } catch (error) {
    printLogs(`Service ${getShipmentDocumentByTracking}`, error)

    return {
      status: 500,
      data: [],
      message: "Internal Server Error"
    }
  }
}

export const getShipmentTracking = async (trackingNumber: string) => {
  try {
    const { data, message, status } = await getDHLShipmentTracking(trackingNumber)

    return {
      status,
      message,
      data
    }
  } catch (error) {
    printLogs(`Service ${getShipmentTracking.name}`, error)
  }
};