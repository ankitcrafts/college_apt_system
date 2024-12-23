import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Importing connection.js for developing the connection with the mySQL-DB.
import connectToDatabase from "./src/config/dbConfig.js";

// Import the Routes
import userAuthRoutes from "./src/routes/userAuthRoute/userAuth.js";
import appointmentRoutes from "./src/routes/appointmentRoute/appointment.js";

dotenv.config();

const app = express();

// Middleware to parse incoming JSON
app.use(bodyParser.json());

const port = process.env.PORT || 5001;

// For Ditectory Path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Streaming the logs to the file into the access.log file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

//Initializing the Morgan Connection
morgan.token("type", (req, res) => {
  return req.headers["Content-Type"];
});

// Initializing Middleware
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :date[web]:type,",
    {
      stream: accessLogStream,
    }
  )
);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Establish a database connection
const connection = await connectToDatabase();

app.get("/", (req, res) => {
  res.json("Helloooo To-Do Application!!!");
});

// User Route
app.use("/api/users/auth", userAuthRoutes);
// Appointment Route
app.use("/api/appointments", appointmentRoutes);


// Application Listening at the Port
app.listen(port, () => {
  console.log(`App is running on port http://localhost:${port}`);
});

export default connection;