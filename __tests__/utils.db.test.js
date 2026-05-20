import mongoose from "mongoose";
import { connect } from "../utils/db";

jest.mock("mongoose", () => ({
  __esModule: true,
  default: {
    connection: { readyState: 0 },
    connect: jest.fn(),
  },
}));

describe("utils/db connect", () => {
  const originalMongoUrl = process.env.MONGO_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.connection.readyState = 0;
    process.env.MONGO_URL = "mongodb://localhost:27017/getlancer_test";
  });

  afterAll(() => {
    process.env.MONGO_URL = originalMongoUrl;
  });

  it("does not reconnect when mongoose is already connected", async () => {
    mongoose.connection.readyState = 1;

    await connect();

    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("connects with configured timeout when disconnected", async () => {
    await connect();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/getlancer_test",
      { serverSelectionTimeoutMS: 5000 }
    );
  });

  it("throws a clear error when MONGO_URL is missing", async () => {
    delete process.env.MONGO_URL;

    await expect(connect()).rejects.toThrow(
      "MONGO_URL is not defined in environment"
    );
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("rethrows mongoose connect errors", async () => {
    mongoose.connect.mockRejectedValueOnce(new Error("boom"));

    await expect(connect()).rejects.toThrow("boom");
  });
});
