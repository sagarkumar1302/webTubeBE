import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    console.log(DB_NAME);

    const connectt = await mongoose.connect(`${process.env.MONGODB_URL}`, {
      dbName: DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo with Host" + connectt.connection.host);
  } catch (error) {
    console.log("Error connecting", error);
    process.exit(1);
  }
};
export default connectDB;
