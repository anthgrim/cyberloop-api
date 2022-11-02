import { Schema, models, model } from "mongoose";

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
    paymentToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const company = models.Company || model("Company", companySchema);

export default company;
