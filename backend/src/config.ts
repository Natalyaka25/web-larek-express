import dotenv from 'dotenv';

dotenv.config();

const parsedPort = Number(process.env.PORT);

export const PORT = Number.isNaN(parsedPort) ? 3000 : parsedPort;
export const DB_ADDRESS = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
