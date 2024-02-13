require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes");
const { Server } = require("socket.io");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connection Established"))
  .catch((err) => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use("/api", router);

let server = app.listen(port, () => {
  console.log(`Richpanel server running at port ${port}`);
});

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});
global.io = io;

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
