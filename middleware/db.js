import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log(`Connected to ${mongoose.connection.host}`);
    }
    const connect = await mongoose.connect(
      process.env.NEXT_PUBLIC_MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    );
    console.log(`Connected to ${connect.connection.host}`);
  } catch (err) {
    console.log(err.message);
  }
};
