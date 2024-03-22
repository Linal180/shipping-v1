import axios from 'axios';
import { generateRandomNumbers, getAllShipperAccount } from '../lib';
import {
  CreateLabelPayload, CreateLabelResponse, GetAftershipRatesPayloadType, GetAftershipRatesType,
  GetRatesResponseType, LabelPayloadType, NewLabel, Rate2
} from '../interfaces';

const headers = () => ({
    'Content-Type': 'application/json',
    'as-api-key': process.env.AFTER_SHIP_API_KEY || 'asat_1dc1c67134c04bc7a174e91a17d8404e'
})

const axiosClient = axios.create({
  baseURL:  process.env.AFTER_SHIP_ENDPOINT ||  'https://api.aftership.com/postmen/v3',
  headers: headers(),
});

const axiosTracking = axios.create({
  baseURL:  process.env.AFTER_SHIP_TRACKING_ENDPOINT ||  'https://api.aftership.com/tracking/2024-01',
  headers: headers()
});

export const getAftershipRates = async (inputs: GetAftershipRatesType): Promise<Rate2[]> => {
  const { from, parcels, to, returnTo } = inputs

  const getRatesBody: GetAftershipRatesPayloadType = {
    shipper_accounts: getAllShipperAccount(),
    shipment: {
      ship_from: from,
      ship_to: to,
      parcels,
      ...(returnTo?.contact_name ? { return_to: returnTo } : null ),
      delivery_instructions: "handle with care"
    }
  }

  try {
    const { data }  = await axiosClient.post<GetRatesResponseType>('/rates', JSON.stringify(getRatesBody) )
    const { data: rateData } = data || {}

    return rateData.rates;
  } catch (error) {
    console.log("*********** Error in getAftershipRates ***********")
    console.log(error)
    return []
  }
}

export const createLabel = async (inputs: LabelPayloadType): Promise<NewLabel | null> => {
  const {
    from, is_document, paper_size, parcels, return_shipment, service_type, to, shipperAccount
  } = inputs

  const body: CreateLabelPayload = {
    return_shipment,
    is_document,
    service_type,
    paper_size,
    shipper_account: { id: shipperAccount },
    references: [
      "refernce1"
    ],
    shipment: {
      ship_from: from,
      ship_to: to,
      parcels: parcels
    },
    order_number: generateRandomNumbers(),
    order_id: generateRandomNumbers(),
    custom_fields: {
      ship_code: "01"
    }
  }

  try {
    const { data }  = await axiosClient.post<CreateLabelResponse>('/labels', JSON.stringify(body) )
    const { data: createLabelData } = data

    return createLabelData ? createLabelData : null;
  } catch (error) {
    console.log("*********** Error in getAftershipRates ***********")
    console.log(error)
    return null
  }
}
