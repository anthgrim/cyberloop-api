import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
