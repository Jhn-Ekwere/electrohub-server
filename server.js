const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const AuthRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
require("colors");

connectDB();

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", AuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
