import { Request } from "express"

export type TableName = 'users' | 'labels'
export interface GetRatesResponseType {
  meta: Meta
  data: Rate
}

export interface Meta {
  code: number
  message: string
  details: any[]
}

export interface Data {
  next_token: any
  limit: number
  created_at_min: string
  created_at_max: string
  rates: Rate[]
}

export interface Rate {
  created_at: string
  id: string
  updated_at: string
  service_options: any
  status: string
  rates: Rate2[]
}

export interface ShipperAccount {
  id: string
  slug?: string
  description?: string
}

export interface Rate2 {
  shipper_account: ShipperAccount
  service_type: string
  service_name: string
  pickup_deadline: any
  booking_cut_off: any
  delivery_date: string
  transit_time: number
  error_message: any
  info_message: any
  charge_weight: ChargeWeight
  total_charge: TotalCharge
  detailed_charges: DetailedCharge[]
}

export interface ChargeWeight {
  value: number
  unit: string
}

export interface TotalCharge {
  amount: number
  currency: string
}

export interface DetailedCharge {
  type: string
  charge: Charge
}

export interface Charge {
  amount: number
  currency: string
}

export interface CustomFields {
  ship_code: string
}

export type ShipAddress = {
  street1: string
  country: string
  contact_name: string
  company_name?: string
  city?: string
  state?: string
  postal_code?: string
  phone?: string
  email?: string
}

export type ReturnTo = ShipAddress & {
  street2?: string
  type?: string
}

export type Parcel = {
  box_type: string
  dimension: Dimension
  items: Item[]
  description: string
  weight: Weight
}

export type Dimension = {
  width: number
  height: number
  depth: number
  unit: string
}

export type Item = {
  weight: Weight
  description: string
  quantity: number
  price?: Price
  item_id?: string
  origin_country?: string
  sku?: string
  hs_code?: string
}

export type Price = {
  currency: string
  amount: number
}

export type Weight = {
  unit: string
  value: number
}

export type GetAftershipRatesType = {
  from: ShipAddress;
  to: ShipAddress;
  parcels: Parcel[];
  returnTo?: ReturnTo;
}

export type LabelPayloadType = GetAftershipRatesType & {
  shipper_account: string;
  return_shipment: boolean
  is_document: boolean
  service_code: string
  paper_size: string
}

export type Shipment = {
  ship_from: ShipAddress
  ship_to: ShipAddress
  parcels: Parcel[]
  return_to?: ReturnTo
  delivery_instructions: string
}

export type LabelShipment = Omit<Shipment, 'delivery_instructions'>

export type GetAftershipRatesPayloadType = {
  shipment: Shipment,
  shipper_accounts?: ShipperAccount[]
}

export interface CreateLabelPayload {
  return_shipment: boolean
  is_document: boolean
  service_type: string
  paper_size: string
  shipper_account: ShipperAccount
  references: string[]
  shipment: LabelShipment
  order_number?: string,
  order_id?: string,
  custom_fields: CustomFields
}


export interface CreateLabelResponse {
  data: NewLabel
}

export interface NewLabel {
  id: string
  status: string
  ship_date: string
  created_at: string
  updated_at: string
  tracking_numbers: string[]
  carrier_references?: any[]
  files: Files
  rate: Rate2
  references: string[]
  order_id: any
  order_number: any
  service_type: string
  shipper_account: ShipperAccount
  service_options: any[]
  custom_fields: CustomFields
}

export interface Files {
  label?: Label
  qr_code?: any
  invoice?: any
  customs_declaration?: any
  manifest?: any
  packing_slip?: any
}

export interface Label {
  paper_size?: string
  url?: string
  file_type?: string
}

export interface DetailedCharge {
  type: string
  charge: Charge
}

export type CreateUser = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type CustomSession = {
  userId: string
  iat: number
  exp: number
}

export type CustomRequest = Request & {
  user: CustomSession
}

export type CreateTrackingResponse = {
  meta: CreateTrackingMetaResponse
  data: CreateTrackingDataResponse
}

export type CreateTrackingMetaResponse = {
  code: number
}

export type CreateTrackingDataResponse = {
  tracking: TrackingResponse
}


export interface TrackingCustomFields {
  store_name: string
}

export interface AftershipEstimatedDeliveryDate {
  estimated_delivery_date: string
  confidence_code: number
  estimated_delivery_date_min: string
  estimated_delivery_date_max: string
}

export interface CustomEstimatedDeliveryDate {
  type: string
  datetime: string
  datetime_min: any
  datetime_max: any
}

export interface FirstEstimatedDelivery {
  type: string
  source: string
  datetime: string
  datetime_min: any
  datetime_max: any
}

export interface LatestEstimatedDelivery {
  type: string
  source: string
  datetime: string
  datetime_min: any
  datetime_max: any
}

export interface CarbonEmissions {
  value: number
  unit: string
}

export interface NextCourier {
  slug: string
  tracking_number: string
  source: string
}

export type CreateTrackingPayload = {
  tracking: CreateTracking
}

export type CreateTracking = {
  slug: string
  tracking_number: string
  title: string
  smses: string[]
  emails: string[]
  order_id: string
  order_number: string
  order_id_path: string
  custom_fields: CreateTrackingCustomFieldsPayload
  language: string
  order_promised_delivery_date: string
  delivery_type: string
  pickup_location: string
  pickup_note: string
  origin_country_iso3: string
  origin_state: string
  origin_city: string
  origin_postal_code: string
  origin_raw_location: string
  destination_country_iso3: string
  destination_state: string
  destination_city: string
  destination_postal_code: string
  destination_raw_location: string
}

export type TrackingResponse = CreateTracking & {
  id: string
  created_at: string
  updated_at: string
  last_updated_at: string
  active: boolean
  customer_name: string
  transit_time: number
  courier_destination_country_iso3: string
  expected_delivery: string
  note: string
  order_date: string
  shipment_package_count: number
  shipment_pickup_date: string
  shipment_delivery_date: string
  shipment_type: string
  shipment_weight: number
  shipment_weight_unit: string
  signed_by: string
  source: string
  tag: string
  subtag: string
  subtag_message: string
  tracked_count: number
  last_mile_tracking_supported: boolean
  unique_token: string
  checkpoints: any[]
  subscribed_smses: string[]
  subscribed_emails: string[]
  return_to_sender: boolean
  courier_tracking_link: string
  first_attempted_at: string
  courier_redirect_link: string
  tracking_account_number: any
  tracking_key: any
  tracking_ship_date: string
  on_time_status: string
  on_time_difference: number
  order_tags: string[]
  aftership_estimated_delivery_date: AftershipEstimatedDeliveryDate
  custom_estimated_delivery_date: CustomEstimatedDeliveryDate
  first_estimated_delivery: FirstEstimatedDelivery
  latest_estimated_delivery: LatestEstimatedDelivery
  shipment_tags: string[]
  courier_connection_id: string
  location_id: string
  shipping_method: string
  carbon_emissions: CarbonEmissions
  next_couriers: NextCourier[]
  tracking_origin_country: string
  tracking_destination_country: string
  tracking_postal_code: string
  tracking_state: string
}

export type CreateTrackingCustomFieldsPayload = {
  product_name: string
  product_price: string
}

export type BaseLabel = {
  _id: { toString(): string };
  serviceName: string;
  charge: {
    amount?: string;
    currency?: string;
  };
  createdAt: Date;
  status: string;
  trackingNumbers: string[];
  orderNumber?: string;
}

export type LabelTracking = {
  shipment_created: string;
  picked_up: string;
  departed_from_facility: string;
  arrived_at_facility: string;
  at_departure_hub: boolean;
  in_transit: boolean;
  at_arrival_hub: boolean;
  delivery_in_progress: boolean;
  delivery_exception: string;
  delivered: boolean;
  unknown: string;
}

export type GetTrackingServiceResponse = {
  status: number,
  message: string;
  tracking: LabelTracking | null
}

// --------------------------------------------------------------------

export type CarrierType = {
  carrier: 'DHL' | 'UPS'
}

export type GetRatesV2Body = CarrierType & {
  fromCountry: string
  fromCity: string
  toCountry: string
  toCity: string
  weight: string
  length: string
  height: string
  width: string
  shippingDate: string
}

export type TGetDHLRatesResponse = {
  products: Array<{
    productName: string
    productCode: string
    localProductCode: string
    localProductCountryCode: string
    networkTypeCode: string
    isCustomerAgreement: boolean
    weight: {
      volumetric: number
      provided: number
      unitOfMeasurement: string
    }
    totalPrice: Array<{
      currencyType: string
      priceCurrency?: string
      price: number
    }>
    totalPriceBreakdown: Array<{
      currencyType: string
      priceCurrency: string
      priceBreakdown: Array<{
        typeCode: string
        price: number
      }>
    }>
    detailedPriceBreakdown: Array<{
      currencyType: string
      priceCurrency: string
      breakdown: Array<{
        name: string
        price?: number
        priceBreakdown?: Array<{
          priceType: string
          typeCode: string
          price: number
          rate: number
          basePrice: number
        }>
        serviceCode?: string
        localServiceCode?: string
        serviceTypeCode?: string
        isCustomerAgreement?: boolean
        isMarketedService?: boolean
      }>
    }>
    pickupCapabilities: {
      nextBusinessDay: boolean
      localCutoffDateAndTime: string
      GMTCutoffTime: string
      pickupEarliest: string
      pickupLatest: string
      originServiceAreaCode: string
      originFacilityAreaCode: string
      pickupAdditionalDays: number
      pickupDayOfWeek: number
    }
    deliveryCapabilities: {
      deliveryTypeCode: string
      estimatedDeliveryDateAndTime: string
      destinationServiceAreaCode: string
      destinationFacilityAreaCode: string
      deliveryAdditionalDays: number
      deliveryDayOfWeek: number
      totalTransitDays: number
    }
    pricingDate: string
  }>
}

export type TGetRateResponse = {
  serviceName: string;
  weight: {
    value: number;
    unit: string;
  }
  totalPrice: {
    currency: string;
    price: number;
  }
  tax: {
    amount: number
  }
}

export type ShippingAddress = {
  postalCode: string
  cityName: string
  countryCode: string
  addressLine1: string
}

export type ShipmentContact = {
  email: string;
  phone: string;
  fullName: string
  address: ShipAddress
  companyName: string
}

export type ShipmentDimensions = {
  width: string;
  length: string;
  height: string;
}

export type ShipmentPackage = {
  weight: string;
  description: string;
  dimensions: ShipmentDimensions
}

export type ShipmentLineItem = {
  number: string
  description: string
  price: string
  quantity: {
    value: string
    unitOfMeasurement: string
  }
  manufacturerCountry: string
  weight: {
    netValue: string
    grossValue: string
  }
}

export type ShipmentContent = {
  packages: ShipmentPackage[];
  lineItems: ShipmentLineItem[]
  isCustomsDeclarable: string
  declaredValue: string
  declaredValueCurrency: string
  description: string
  unitOfMeasurement: string

}

export type TCreateShipmentV2Body = CarrierType & {
  shipmentDate: string;
  sender: ShipmentContact;
  receiver: ShipmentContact;
  content: ShipmentContent
  shipmentNotification: Array<{
    type: string;
    email: string;
    message: string;
  }>
}

export type TCreateShipmentDHLResponse = {
  shipmentTrackingNumber: string
  trackingUrl: string
  packages: Array<{
    referenceNumber: number
    trackingNumber: string
    trackingUrl: string
  }>
  documents: Array<{
    imageFormat: string
    content: string
    typeCode: string
  }>
}


