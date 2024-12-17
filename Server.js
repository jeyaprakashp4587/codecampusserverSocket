const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { DB2 } = require("./Database/DB");
const { DB1 } = require("./Database/CCDB");
const socket = require("./Socket/Socket");
const axios = require("axios")

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
// socket
socket(server);
// Connect databases update
DB1.on("connected", () => {
  console.log("DB1 is connected");
});

DB2.on("connected", () => {
  console.log("DB2 is connected");
});

// 
// Self-ping endpoint
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive!");
});
// Port listening
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  // Self-ping every 60 seconds
   setInterval(async () => {
     try {
       await axios.get(`https://codecampusserversocket.onrender.com/ping`);
       console.log("Self-ping successful");
    } catch (error) {
       console.error("Error in self-ping:", error);
     }
 },  20 * 60* 1000); // Ping every 60 seconds
});
