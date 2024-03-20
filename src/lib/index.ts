import bcrypt from "bcrypt";
import Counter from "../models/counter";
import { BaseLabel, TableName } from "../interfaces";
import { COMMISSION_PERCENTAGE } from "../constants";

export const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    console.log(error)
  }
};

export const comparePassword = async (password: string, hashPassword: string) => {
  return bcrypt.compare(password, hashPassword);
}

export const  generateRandomNumbers = () => {
  let result = '';
  const length = 6;
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
}

export const generateLabelFileUrl = (id: string) => {
  return `${process.env.BASE_URL || 'https://shipping-v1.vercel.app'}/shipping/get-file/${id}`
}

export const addCounterRecord = async (tableName: TableName): Promise<void> => {
  const existingRecord = await Counter.findById(tableName);

  if (!existingRecord) {
      await Counter.create({ _id: tableName, seq: 0 });
  }
};

export const getNextSequenceId = async (sequenceName: TableName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true
      }
  );

  return sequenceDocument.seq;
};

export const customizeLabel = <T extends BaseLabel>(label: T) => {
  return {
    _id: label._id.toString(),
    serviceName: label.serviceName,
    charge: {
        priceWithoutVAT: (parseFloat(label.charge.amount) * COMMISSION_PERCENTAGE).toFixed(2),
        VAT: '0.0',
        total: (parseFloat(label.charge.amount) * COMMISSION_PERCENTAGE).toFixed(2),
    },
    createdAt: label.createdAt,
    status: label.status,
    trackingNumbers: label.trackingNumbers,
    orderNumber: label.orderNumber,
    file: generateLabelFileUrl(label._id.toString()) // Ensure generateLabelFileUrl is defined somewhere
  };
};

export const getShipperAccount = () => {
    return {
      id: process.env.AFTER_SHIP_SHIPPER_ACCOUNT || "9f115bc2-7422-47ce-a8e9-aa3b3cd91b80"
    }
}