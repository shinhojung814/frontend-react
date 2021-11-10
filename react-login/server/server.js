import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
dotenv.config();

const server = express();

server.use(express.json());

server.use("/api/user", userRoutes);

mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }, (err) => {
        if (err) {
            console.log("ERROR: CONNECTION FAILED", err);
        }
        else {
            console.log("CONNECTED SUCCESSFULLY")
            server.listen(3000, () => console.log("SERVER RUNNING"));
        }
    });