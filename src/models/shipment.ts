import mongoose from "mongoose";
const shipment = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  trackingNumber: {
    type: String,
    required: true
  },
  
  trackingUrl: {
    type: String
  },

  packages: [{
    referenceNumber: {
      type: Number
    },
    trackingNumber: {
      type: String
    },
    trackingUrl: {
      type: String
    }
  }],

  documents: [{
    imageFormat: {
      type: String
    },
    content: {
      type: String
    },
    typeCode: {
      type: String
    }
  }],

  shipmentDetails: [{
    pickupDetails: {
      localCutoffDateAndTime: { type: String },
      gmtCutoffTime: { type: String },
      cutoffTimeOffset: { type: String },
      pickupEarliest: { type: String },
      pickupLatest: { type: String },
      totalTransitDays: { type: Number },
      pickupAdditionalDays: { type: Number },
      deliveryAdditionalDays: { type: Number },
      pickupDayOfWeek: { type: Number },
      deliveryDayOfWeek: { type: Number }
    }
  }],
  estimatedDeliveryDate: {
    estimatedDeliveryDate: { type: String },
    estimatedDeliveryType: { type: String }
  }
})

export default mongoose.model("Shipment", shipment);