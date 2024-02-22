import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema({
	amount: String,
	currency: String,
});

const shipperAccountSchema = new mongoose.Schema({
	id: String,
	slug: String,
	description: String,
});

const fileSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true,
	},
	paperSize: {
		type: String,
		required: true,
	},
	fileType: {
		type: String,
		required: true,
	}
});

const labelSchema = new mongoose.Schema(
	{
		externalId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		shipDate: {
			type: String,
			required: true,
		},
		trackingNumbers: {
			type: [String],
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		shipperAccount: {
			type: shipperAccountSchema,
			required: true,
		},
		serviceType: {
			type: String,
			required: true,
		},
		serviceName: {
			type: String,
			required: true,
		},
		charge: {
			type: chargeSchema,
			required: true,
		},
    orderId: String,
    orderNumber: String,
		file: fileSchema
	},
	{
		timestamps: true
	}
);

export default mongoose.model('label', labelSchema);
