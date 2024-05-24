import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express';

import User from '../../models/user';
import Shipment from '../../models/shipment';

import { TEMP_DIR, printLogs } from "../../lib";
import { CustomRequest, GetRatesV2Body } from "../../interfaces";
import {
  createCarrierShipment, getCarrierRates, getAllShipments, getUserShipments,
  getShipmentDocumentByTracking
} from "./service";

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

export const allShipments = async (req: CustomRequest, res: Response) => {
  try {
    const { page, shipments } = await getAllShipments(req)

    res.status(200).json({ page, shipments })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const userShipments = async (req: CustomRequest, res: Response) => {
  try {
    const { page, shipments } = await getUserShipments(req)

    res.status(200).json({ page, shipments })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const shippingDoc = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const shipment = await Shipment.findOne({ _id: id });

    if (!shipment) {
      res.status(404).json({ message: "Shipment Not Found" });
      return
    }

    const documents = shipment.documents

    if (!documents.length) {
      return res.status(404).json({ message: "Shipment hae no documents" });
    }

    const decodedContent = Buffer.from(documents[0].content, 'base64');
    const filePath = path.join(TEMP_DIR, `${documents[0]._id}.pdf`);

    fs.writeFileSync(filePath, decodedContent);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const shipmentDocumentByTracking = async (req: Request, res: Response) => {
  const { tracking } = req.params;
  if (!tracking) {
    return res.status(400).json({ message: "Bad Request | Tracking ID missing" });
  }

  try {
    const { message, status, documents } = await getShipmentDocumentByTracking(req)

    res.status(status).json({ message, documents })
  } catch (error) {
    res.status(500).json({ message: error.message, documents: [] });
  }
};