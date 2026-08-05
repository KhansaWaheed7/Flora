const dotenv = require("dotenv");

dotenv.config();
require("./config/env");

const connectDB = require("./config/database");

const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const {
  initializeSocket,
} = require("./socket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    initializeSocket(server);

    server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.error(error);
  }
};



startServer();