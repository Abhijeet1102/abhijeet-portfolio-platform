import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
      console.warn("⚠️ Database connection skipped. Application may not function fully.");
      return;
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    // Do not exit the process, allow graceful degradation
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
