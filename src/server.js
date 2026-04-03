const app = require("./app");
const connectDB = require("./config/db");
const { mongoUri, port } = require("./config/env");

const start = async () => {
  try {
    await connectDB(mongoUri);
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
