import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

export default async () => {
  const connection = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  return connection.connection.db;
};
