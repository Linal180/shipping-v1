import axios from 'axios';
import { generateRandomNumbers } from '../lib';
import {
  CreateLabelPayload, CreateLabelResponse, CreateTrackingDataResponse, CreateTrackingPayload,
  CreateTrackingResponse, GetAftershipRatesPayloadType, GetAftershipRatesType,
  GetRatesResponseType, LabelPayloadType, NewLabel, Rate2
} from '../interfaces';

const headers = () => ({
    'Content-Type': 'application/json',
    'as-api-key': process.env.AFTER_SHIP_API_KEY || 'asat_9ed49ad08a38424ba8cca09266355738'
})

const axiosClient = axios.create({
  baseURL:  process.env.AFTER_SHIP_ENDPOINT ||  'https://sandbox-api.aftership.com/postmen/v3',
  headers: headers(),
});

const axiosTracking = axios.create({
  baseURL:  process.env.AFTER_SHIP_TRACKING_ENDPOINT ||  'https://api.aftership.com/tracking/2024-01',
  headers: headers()
});

export const getAftershipRates = async (inputs: GetAftershipRatesType): Promise<Rate2[]> => {
  const { from, parcels, to, returnTo } = inputs

  const getRatesBody: GetAftershipRatesPayloadType = {
    shipper_accounts: [
      {
        id: "6f43fe77-b056-45c3-bce4-9fec4040da0c"
      }
    ],
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
    from, is_document, paper_size, parcels, return_shipment, service_type, to
  } = inputs

  const body: CreateLabelPayload = {
    return_shipment,
    is_document,
    service_type,
    paper_size,
    shipper_account: {
      id: "3ba41ff5-59a7-4ff0-8333-64a4375c7f21"
    },
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
    return createLabelData;
  } catch (error) {
    console.log("*********** Error in getAftershipRates ***********")
    console.log(error)
    return null
  }
}

export const createTracking = async (inputs: NewLabel): Promise<CreateTrackingDataResponse | null> => {
  const {
    custom_fields: {  ship_code }, created_at, files, id, order_id, order_number,
    rate, references, service_options, service_type, ship_date, shipper_account, status,
    tracking_numbers, updated_at, carrier_references
  } = inputs || {};
  const { delivery_date,  service_name,  } = rate || {};
  const { slug } = shipper_account || {};

  const body: CreateTrackingPayload = {
    tracking: {
      slug: slug || '',
      tracking_number: tracking_numbers[0],
      title: "Title Name",
      smses: [
        "+18555072509",
      ],
      emails: [
        "email@yourdomain.com",
        "another_email@yourdomain.com"
      ],
      order_id: order_id,
      order_number: order_number,
      order_id_path: `http://www.aftership.com/order_id=${order_id}`,
      custom_fields: {
        product_name: "iPhone Case",
        product_price: "USD19.99"
      },
      language: "en",
      order_promised_delivery_date: delivery_date,
      delivery_type: "pickup_at_store",
      pickup_location: "Flagship Store",
      pickup_note: "Reach out to our staffs when you arrive our stores for shipment pickup",
      origin_country_iso3: "CHN",
      origin_state: "Beijing",
      origin_city: "Beijing",
      origin_postal_code: "065001",
      origin_raw_location: "Lihong Gardon 4A 2301, Chaoyang District, Beijing, BJ, 065001, CHN, China",
      destination_country_iso3: "USA",
      destination_state: "New York",
      destination_city: "New York City",
      destination_postal_code: "10001",
      destination_raw_location: "13th Street, New York, NY, 10011, USA, United States"
    }
  }

  try {
    const { data }  = await axiosTracking.post<CreateTrackingResponse>('/tracking', JSON.stringify(body) )
    const { data: trackingData } = data
    return trackingData;
  } catch (error) {
    console.log("*********** Error in CreateTracking ***********")
    console.log(error)
    return null
  }
}
