import axios from "axios";

import {
  createDHLGenericShipmentPayload, getCurrentDate, getDHLHeaders, getErrorResponse, printLogs
} from "../../lib";
import {
  GetRatesV2Body, TCreateShipmentDHLResponse, TCreateShipmentV2Body, TGetDHLRatesResponse
} from "../../interfaces";

const dhl = axios.create({
  baseURL: process.env.DHL_API_ENDPOINT || 'https://express.api.dhl.com/mydhlapi',
  headers: getDHLHeaders()
});

export const getRates = async (params: Omit<GetRatesV2Body, 'carrier'>) => {
  const {
    fromCity, fromCountry, height, length, toCity, toCountry, weight, width
  } = params || {};

  const apiParams = {
    accountNumber: process.env.DHL_ACCOUNT_NUMBER,
    originCountryCode: fromCountry,
    originCityName: fromCity,
    destinationCountryCode: toCountry,
    destinationCityName: toCity,
    weight,
    length,
    width,
    height,
    plannedShippingDate: '2024-05-21', // Right now we have a product for this date
    isCustomsDeclarable: false,
    unitOfMeasurement: 'metric'
  }

  try {
    const { data } = await dhl.get<TGetDHLRatesResponse>('/rates', {
      params: apiParams
    })

    const { products } = data || {}

    return {
      status: 200,
      message: 'Rates calculated successfully',
      data: products[0]
    }

  } catch (error) {
    printLogs(`DHL ${getRates.name}`, error)

    const { detail, message, status } = getErrorResponse(error)

    return {
      status,
      message: `${detail} | ${message}`,
      data: null as any
    };

  }
}

export const createDHLShipment = async (body: TCreateShipmentV2Body) => {
  const shipmentPayload = createDHLGenericShipmentPayload(body)

  try {
    const { data } = await dhl.post<TCreateShipmentDHLResponse>('/shipments', shipmentPayload)

    return {
      status: 200,
      message: 'Shipment created successfully',
      data
    }
  } catch (error) {
    printLogs(`DHL ${createDHLShipment.name}`, error)

    const { detail, message, status } = getErrorResponse(error)

    return {
      status,
      message: `${detail} | ${message}`,
      data: null as any
    };
  }
}

export const getDHLShipmentTracking = async (trackingNumber: string) => {
  try {
    const { data } = await dhl.get(`/shipments/${trackingNumber}/tracking`, {
      params: {
        trackingView: 'all-checkpoints',
        levelOfDetail: 'all',
        requestControlledAccessDataCodes: false,
        requestGMTOffsetPerEvent: false
      }
    });

    return {
      status: 200,
      message: 'Tracking retrived successfully',
      data
    };
  } catch (error) {
    printLogs(`DHL Service ${getDHLShipmentTracking.name}`, error)
    const { detail, message, status } = getErrorResponse(error)

    return {
      status,
      message: `${detail} | ${message}`,
      data: null as any
    };
  }
}