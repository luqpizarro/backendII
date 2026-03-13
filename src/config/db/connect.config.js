import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const baseMongooseOpts = {
    serverSelectionTimeoutMS: 100000
}

export const connectMongoDB = async () => {
    try {
        const url = process.env.MONGO_URL
        await mongoose.connect(url, baseMongooseOpts);
        console.log('Conectado a mongoDB de forma exitosa')
    } catch (err) {
        console.log(err);
        console.exit(1);
    };
};

export const connectMongoAtlasDB = async () => {
    try {
        const url = process.env.MONGO_ATLAS_URL
        await mongoose.connect(url, baseMongooseOpts);
        console.log('Conectado a mongo Atlas de forma exitosa')
    } catch (err) {
        console.log(err);
        console.exit(1);
    };
};

export const connectAuto = async () => {
    const target = (process.env.MONGO_TARGET || "LOCAL").toUpperCase();
    if (target === 'ATLAS') return connectMongoAtlasDB();
    return connectMongoDB();
}