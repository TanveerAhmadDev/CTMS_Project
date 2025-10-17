import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB is Connected ");
  } catch (error) {
    console.log("DB is Not Connected");
    console.log(error);
  }
}

export default dbConnect;
