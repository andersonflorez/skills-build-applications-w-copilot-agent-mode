import mongoose from 'mongoose';

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/octofit_db';
export { mongoose };
