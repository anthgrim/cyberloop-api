import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    addressLineOne: {
      type: String,
      required: true,
    },
    addressLineTwo: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    billingEmail: {
      type: String,
      required: true,
    },
    subscriptionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const company = model("Company", companySchema);

export default company;
