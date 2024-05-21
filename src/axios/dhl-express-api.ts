// services/dhlService.ts
import axios from 'axios';

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

export const getRates = async (requestData: DHLRequestData) => {
  const options = {
    method: 'POST',
    url: 'https://api-mock.dhl.com/mydhlapi/rates',
    headers: {
      'content-type': 'application/json',
      'Message-Reference': 'd0e7832e-5c98-11ea-bc55-0242ac13',
      'Message-Reference-Date': 'Wed, 21 Oct 2015 07:28:00 GMT',
      'Plugin-Name': 'SOME_STRING_VALUE',
      'Plugin-Version': 'SOME_STRING_VALUE',
      'Shipping-System-Platform-Name': 'SOME_STRING_VALUE',
      'Shipping-System-Platform-Version': 'SOME_STRING_VALUE',
      'Webstore-Platform-Name': 'SOME_STRING_VALUE',
      'Webstore-Platform-Version': 'SOME_STRING_VALUE',
      Authorization: 'Basic REPLACE_BASIC_AUTH',
    },
    data: requestData,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching DHL rates: ${error.message}`);
  }
};
