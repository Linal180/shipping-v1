import bcrypt from "bcrypt";
import { config } from 'dotenv'
import Counter from "../models/counter";
import { BaseLabel, TGetDHLRatesResponse, TGetRateReponse, TableName } from "../interfaces";
import { COMMISSION_PERCENTAGE } from "../constants";

config() // To load envs ASAP

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

export const generateRandomNumbers = () => {
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

export const getChronoPostShipperAccount = () => {
  return {
    id: "59c9757332f44f4d9132f5b08aae598f"
  }
}

export const getUspsShipperAccount = () => {
  return {
    id: "9f115bc2-7422-47ce-a8e9-aa3b3cd91b80"
  }
}

export const getAllShipperAccount = () => {
  return [
    getChronoPostShipperAccount(),
    getUspsShipperAccount()
  ]
}

export const getDHLHeaders = () => {
  const username = process.env.DHL_USERNAME
  const password = process.env.DHL_PASSWORD
  const hash = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

  return {
    'Content-Type': 'application/json',
    'Authorization': hash
  }
};

export const printLogs = (methodName: string, error: any) => {
  console.log(`*************** Error in ${methodName} **************`)
  console.log("Error: ", error)
  console.log("******************************************************")
}

export const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const getDHLRateGenericResponse = (rates: TGetDHLRatesResponse['products'][0]): TGetRateReponse => {
  const { productName, totalPrice, weight, totalPriceBreakdown, detailedPriceBreakdown } = rates || {}
  const { priceCurrencies, totalSum } = totalPrice.reduce((accumulator, currentItem) => {
    accumulator.totalSum += currentItem.price;

    if (currentItem.priceCurrency) {
      accumulator.priceCurrencies += accumulator.priceCurrencies ? `, ${currentItem.priceCurrency}` : currentItem.priceCurrency;
    }

    return accumulator;
  }, { totalSum: 0, priceCurrencies: '' });


  let taxSum = 0;
  let basePriceSum = 0;
  
  totalPriceBreakdown.forEach(item => {
    if(item.priceBreakdown && item.priceBreakdown.length){
      item.priceBreakdown.forEach(subItem => {
        basePriceSum += subItem.price
      })
    }
  })

  detailedPriceBreakdown.forEach(item => {
    if (item.breakdown) {

      item?.breakdown?.forEach(subItem => {
        if (subItem.priceBreakdown) {
          subItem.priceBreakdown.forEach(priceItem => {
            taxSum += priceItem.price;
          });
        }
      });
    }
  });

  return {
    serviceName: productName,
    totalPrice: {
      currency: priceCurrencies || '',
      price: totalSum || 0
    },
    weight: {
      unit: weight.unitOfMeasurement,
      value: weight.provided
    },
    tax: {
      amount: parseFloat((totalSum - basePriceSum).toFixed(2))
    },
  }
}
