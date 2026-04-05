process.env.PORT = process.env.PORT || "5001";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || "900000";
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || "1000";
process.env.MONGOMS_DOWNLOAD_DIR =
  process.env.MONGOMS_DOWNLOAD_DIR || require("path").join(process.cwd(), ".cache", "mongodb-binaries");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
const externalMongoUri = process.env.TEST_MONGO_URI;

jest.setTimeout(60000);

beforeAll(async () => {
  if (externalMongoUri) {
    process.env.MONGO_URI = externalMongoUri;
  } else {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        downloadDir: process.env.MONGOMS_DOWNLOAD_DIR,
      },
    });
    process.env.MONGO_URI = mongoServer.getUri();
  }

  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) return;
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});
