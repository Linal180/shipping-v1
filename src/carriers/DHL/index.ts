import axios from "axios";
import { getCurrentDate, getDHLHeaders, printLogs } from "../../lib";
import { GetRatesV2Body, TGetDHLRatesResponse } from "../../interfaces";

const dhl = axios.create({
  baseURL: process.env.DHL_API_ENDPOINT || 'https://express.api.dhl.com/mydhlapi',
  headers: getDHLHeaders()
});

export const getRates = async (params: Omit<GetRatesV2Body, 'carrier'>) => {
  const {
    fromCity, fromCountry, height, length, toCity, toCountry, weight, width
  } = params || {};

  try {
    const { data } = await dhl.get<TGetDHLRatesResponse>('/rates', {
      params: {
        accountNumber: process.env.DHL_ACCOUNT_NUMBER,
        originCountryCode: fromCountry,
        originCityName: fromCity,
        destinationCountryCode: toCountry,
        destinationCityName: toCity,
        weight,
        length,
        width,
        height,
        plannedShippingDate: getCurrentDate(),
        isCustomsDeclarable: false,
        unitOfMeasurement: 'metric'
      }
    })

    const { products } = data || {}

    return products[0]
  } catch (error) {
    printLogs(`DHL ${getRates.name}`, error)
  }
}