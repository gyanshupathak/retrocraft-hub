const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoutes");
const { MONGO_URL, PORT } = process.env;
const users = require("./routes/UserRoutes");
const jobRoute = require("./routes/JobRoutes");
const peopleRoute = require("./routes/PeoplesRoutes");
const profileRoute = require("./routes/ProfileRoutes");


mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});




app.use(express.json());


app.use(cookieParser());
// Serve static files from the "images" directory
app.use("/images", express.static("images"));

app.use("/profile", profileRoute);
app.use("/", authRoute);
app.use("/jobs", jobRoute);
app.use("/users", users);
app.use("/people", peopleRoute);





