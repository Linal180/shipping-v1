import { Request, Response } from 'express';

import User from '../../models/user';
import { printLogs } from "../../lib";
import { createCarrierShipment, getCarrierRates } from "./service";
import { CustomRequest, GetRatesV2Body } from "../../interfaces";

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

export const createShipment = async (req: CustomRequest, res: Response) => {
  const { user } = req || {}

  try {
    const currentUser = await User.findById(user.userId)

    if (!currentUser) {
      res.status(403).json({ message: "This action is forbidden for you" });
      return
    }

    const data = await createCarrierShipment(req);

    res.status(201).json({ message: "Shipment created and save successfully!", data })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};