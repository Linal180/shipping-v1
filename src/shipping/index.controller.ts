import { Request, Response } from 'express';
import { CustomRequest, CustomSession, GetAftershipRatesType, LabelPayloadType } from '../interfaces';
import { getRates as getServiceRates,  createLabelForShipment, getUserLabels} from './shipping.service';

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

    if (!labelDetails.from || !labelDetails.to || !labelDetails.parcels || !labelDetails.service_type) {
      return res.status(400).send("Shipment details are incomplete.");
    }

    const rates = await createLabelForShipment(labelDetails, user.userId);

    res.json(rates);
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
