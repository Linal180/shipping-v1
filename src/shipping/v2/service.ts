import { CustomRequest, GetRatesV2Body, TCreateShipmentV2Body } from "../../interfaces";
import {createDHLShipment, getRates as getDHLRates } from '../../carriers/DHL'
import { getDHLRateGenericResponse, printLogs } from "../../lib";
import Shipment from "../../models/shipment";

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
  const {  body, user } = req || {}
  const { carrier } = body || {};

  try {
    if (carrier === 'DHL') {
      const { shipmentTrackingNumber, ...rest } = await createDHLShipment(body as TCreateShipmentV2Body)

      const ship = await Shipment.create({
        userId: user.userId, 
        trackingNumber: shipmentTrackingNumber,
        ...rest
      })

      return ship;
    }

    
  } catch (error) {
    printLogs(`V2 Service ${getCarrierRates.name}`, error)
    return null
  }

};