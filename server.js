const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passportSetup = require("./config/passportSetup");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.status(200).send({
//     success: true,
//     message: "Server is running",
//   });
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_INTERNCONNECT_MODE} mode on port ${PORT}`
      .bgCyan.white.bold
  );
});
