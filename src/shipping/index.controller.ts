import { Request, Response } from 'express';
import { CustomRequest, GetAftershipRatesType, LabelPayloadType } from '../interfaces';
import { getRates as getServiceRates,  createLabelForShipment, getUserLabels, getPDFFile, getSingleLabel, getLabelTracking} from './shipping.service';

export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const file = await getPDFFile(id);
    file.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get file");
  }
}

export const getRates = async (req: Request, res: Response) => {
  try {
    const shipmentDetails = req.body as GetAftershipRatesType;

    if (!shipmentDetails.from || !shipmentDetails.to || !shipmentDetails.parcels) {
      return res.status(400).send("Shipment details are incomplete.");
    }

    const rates = await getServiceRates(shipmentDetails);

    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get rates");
  }
}

export const createLabel = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    const labelDetails = req.body as LabelPayloadType;

    if (!labelDetails.from || !labelDetails.to || !labelDetails.parcels || !labelDetails.service_code) {
      return res.status(400).send("Shipment details are incomplete.");
    }

    const rates = await createLabelForShipment(labelDetails, user.userId);

    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get rates");
  }
}

export const getLabel = async (req: Request, res: Response) => {
  try {
    const labels = await getSingleLabel(req)

    res.json(labels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get rates");
  }
}

export const getLabels = async (req: CustomRequest, res: Response) => {
  try {
    const labels = await getUserLabels(req)

    res.json(labels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get rates");
  }
}

export const getTracking = async (req: Request, res: Response) => {
  try {
    const { status, message, tracking } = await getLabelTracking(req)

    res.status(status).json({ message, tracking })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get rates", tracking: null});
  }
}
