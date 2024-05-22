import { GetRatesV2Body } from "../../interfaces";
import {getRates as getDHLRates } from '../../carriers/DHL'
import { getDHLRateGenericResponse, printLogs } from "../../lib";

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