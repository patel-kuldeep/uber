// server.js
import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import colors from "colors";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create server (important for socket.io later)
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
    console.log(`
====================================
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
====================================
  `.bgYellow.black);
});
