import Label from '../models/label';
import { createLabel, getAftershipRates } from "../aftershipService";
import { CreateLabelPayload, CustomRequest, CustomSession, GetAftershipRatesType, LabelPayloadType } from "../interfaces";
import User from '../models/user';


export const getRates = async (shipment: GetAftershipRatesType) => {
  try {
    const rates = await getAftershipRates(shipment)

    const parsedRates = rates.map(rate => {
      return {
        ServiceName: rate.service_name,
        charges: {
          weight: rate.charge_weight,
          perUnit: {
            original: rate.total_charge.amount,
            data: rate.total_charge.amount * 1.1,
            currency: rate.total_charge.currency
          }
        }
      }
    });

    return parsedRates;
  } catch (error) {
    console.log((error as any).message);
    return []
  }
};

export const getUserLabels = async (req: CustomRequest) => {
  try {
    const { user: { userId }, query } = req || {};
    const { page, limit } = query || {}

    if(userId){
      const currentUser = await User.findOne({ _id: userId })

      if(currentUser){
        const pageNumber = parseInt(page as string ?? '1') || 1;
        const limitNumber = parseInt(limit as string ?? '10') || 10; // Default limit is set to 10

        const labels = await Label.find({ userId }, '-file')
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber)
          .exec();

        return labels;
      }
    }

    return null;
  } catch (error) {
    console.log((error as any).message);
    return []
  }
};

export const createLabelForShipment = async (payload: LabelPayloadType, userId: string): Promise<Omit<typeof Label, 'file'> | null> => {
  try {
    const label = await createLabel(payload)

    if (label) {
      const { id, files, rate, ship_date, status, tracking_numbers, shipper_account, order_id, order_number } = label
      const { service_name, service_type, total_charge } = rate
      const { label: { file_type, paper_size, url } = {} } = files

      const localLabel = await Label.create({
        userId,
        status,
        charge: total_charge,
        externalId: id,
        file: { fileType: file_type, paperSize: paper_size, url },
        serviceName: service_name,
        serviceType: service_type,
        shipDate: ship_date,
        shipperAccount: shipper_account,
        trackingNumbers: tracking_numbers,
        orderNumber: order_number,
        orderId: order_id,
      })
      const { file, ...labelWithoutFile } = localLabel;

      return labelWithoutFile as any;
    }
  } catch (error) {
    console.log((error as any).message);
    return null
  }
};
