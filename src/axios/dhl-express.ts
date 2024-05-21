// src/services/dhlService.ts
import axios from 'axios';

export interface DHLRateRequestParams {
  accountNumber: string;
  originCountryCode: string;
  originCityName: string;
  destinationCountryCode: string;
  destinationCityName: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  plannedShippingDate: string;
  isCustomsDeclarable: boolean;
  unitOfMeasurement: string;
}

export interface DHLRateRequestHeaders {
  messageReference: string;
  messageReferenceDate: string;
  pluginName: string;
  pluginVersion: string;
  shippingSystemPlatformName: string;
  shippingSystemPlatformVersion: string;
  webstorePlatformName: string;
  webstorePlatformVersion: string;
  authorization: string;
}

const dhlHeaders = (headers: DHLRateRequestHeaders) => ({
  'Content-Type': 'application/json',
  'Message-Reference': headers.messageReference,
  'Message-Reference-Date': headers.messageReferenceDate,
  'Plugin-Name': headers.pluginName,
  'Plugin-Version': headers.pluginVersion,
  'Shipping-System-Platform-Name': headers.shippingSystemPlatformName,
  'Shipping-System-Platform-Version': headers.shippingSystemPlatformVersion,
  'Webstore-Platform-Name': headers.webstorePlatformName,
  'Webstore-Platform-Version': headers.webstorePlatformVersion,
  Authorization: headers.authorization
});

const axiosDhlClient = axios.create({
  baseURL: process.env.DHL_API_ENDPOINT || 'https://api-mock.dhl.com/mydhlapi/rates',
});

export const getDhlRates = async (params: DHLRateRequestParams, headers: DHLRateRequestHeaders) => {
  const options = {
    method: 'GET',
    url: '/rates',
    params: {
      accountNumber: params.accountNumber,
      originCountryCode: params.originCountryCode,
      originCityName: params.originCityName,
      destinationCountryCode: params.destinationCountryCode,
      destinationCityName: params.destinationCityName,
      weight: params.weight,
      length: params.length,
      width: params.width,
      height: params.height,
      plannedShippingDate: params.plannedShippingDate,
      isCustomsDeclarable: params.isCustomsDeclarable,
      unitOfMeasurement: params.unitOfMeasurement
    },
    headers: dhlHeaders(headers)
  };

  try {
    const { data } = await axiosDhlClient.request(options);
    return data;
  } catch (error) {
    throw new Error(`Error fetching DHL rates: ${error.message}`);
  }
};

export const createDhlLabel = async (params: DHLRateRequestParams, headers: DHLRateRequestHeaders) => {
  const options = {
    method: 'POST',
    url: '/labels',
    data: params,
    headers: dhlHeaders(headers)
  };

  try {
    const { data } = await axiosDhlClient.request(options);
    return data;
  } catch (error) {
    throw new Error(`Error creating DHL label: ${error.message}`);
  }
};
