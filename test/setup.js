import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import transporter from "../utilis/email";

let mongoServer;

beforeAll (async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  transporter.close();
});