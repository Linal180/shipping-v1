// src/controllers/dhlController.ts
import { Request, Response } from 'express';
import { getDhlRates, createDhlLabel } from '../axios/dhl-express';

import { getRates } from '../axios/dhl-express-api';

interface DHLRateRequestParams {
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

interface DHLRateRequestHeaders {
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

export const getDhlRatesController = async (req: Request, res: Response) => {
  const params = req.body as DHLRateRequestParams;
  const headers = req.headers as unknown as DHLRateRequestHeaders;

  try {
    const rates = await getDhlRates(params, headers);
    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get DHL rates");
  }
};

export const createDhlLabelController = async (req: Request, res: Response) => {
  const params = req.body as DHLRateRequestParams;
  const headers = req.headers as unknown as DHLRateRequestHeaders;

  try {
    const label = await createDhlLabel(params, headers);
    res.json(label);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create DHL label");
  }
};

// controllers/dhlController.ts

export const getDhlRatess = async (req: Request, res: Response) => {
  try {
    const requestData = req.body;
    const data = await getRates(requestData);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

