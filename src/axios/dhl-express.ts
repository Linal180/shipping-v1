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

interface CustomerDetails {
  shipperDetails: any;
  receiverDetails: any;
}

interface ValueAddedService {
  serviceCode: string;
  localServiceCode: string;
  value: number;
  currency: string;
  method: string;
}

interface Package {
  typeCode: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

interface DHLRequestData {
  customerDetails: CustomerDetails;
  accounts: { typeCode: string; number: string }[];
  productCode: string;
  localProductCode: string;
  valueAddedServices: ValueAddedService[];
  productsAndServices: {
    productCode: string;
    localProductCode: string;
    valueAddedServices: ValueAddedService[];
  }[];
  payerCountryCode: string;
  plannedShippingDateAndTime: string;
  unitOfMeasurement: string;
  isCustomsDeclarable: boolean;
  monetaryAmount: { typeCode: string; value: number; currency: string }[];
  requestAllValueAddedServices: boolean;
  estimatedDeliveryDate: { isRequested: boolean; typeCode: string };
  getAdditionalInformation: { typeCode: string; isRequested: boolean }[];
  returnStandardProductsOnly: boolean;
  nextBusinessDay: boolean;
  productTypeCode: string;
  packages: Package[];
}

const encodeBasicAuth = (username: string, password: string): string => {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
};

const dhlHeaders = () => ({
  'Content-Type': 'application/json',
  'Message-Reference': "",
  'Message-Reference-Date': "",
  'Plugin-Name': "",
  'Plugin-Version': "",
  'Shipping-System-Platform-Name': "",
  'Shipping-System-Platform-Version': "",
  'Webstore-Platform-Name': "",
  'Webstore-Platform-Version': "",
  'Authorization': encodeBasicAuth('ahchannelsFR', 'B#9zM@2tX#6lQ$6l')
});

const axiosDhlClient = axios.create({
  baseURL: process.env.DHL_API_ENDPOINT || 'https://api-mock.dhl.com/mydhlapi',
  headers: dhlHeaders()
});

export const getDhlRates = async (params: DHLRateRequestParams) => {
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
    }
  };

  try {
    const { data } = await axiosDhlClient.request(options);
    return data;
  } catch (error) {
    throw new Error(`Error fetching DHL rates: ${error.message}`);
  }
};

export const createDhlLabel = async (params: DHLRateRequestParams) => {
  const options = {
    method: 'POST',
    url: '/labels',
    data: params,
  };

  try {
    const { data } = await axiosDhlClient.request(options);
    return data;
  } catch (error) {
    throw new Error(`Error creating DHL label: ${error.message}`);
  }
};


export const getRates = async (requestData: DHLRequestData) => {
  const options = {
    method: 'POST',
    url: '/rates',
    data: requestData,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching DHL rates: ${error.message}`);
  }
};
