const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
