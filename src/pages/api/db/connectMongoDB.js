import mongoose from "mongoose";

const connectMongoDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongoUri);
    } catch(error) {
        process.exit(1);
    }
};

export default connectMongoDB;
