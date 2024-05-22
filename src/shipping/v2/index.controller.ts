import { Request, Response } from 'express';
import { printLogs } from "../../lib";
import { GetRatesV2Body } from "../../interfaces";
import { getCarrierRates } from "./service";

export const getRates = async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const response = await getCarrierRates(body as unknown as GetRatesV2Body);

    res.status(200).json({ message: 'Rate calculated successfully', data: response });
  } catch (error) {
    printLogs(getRates.name, error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
};
