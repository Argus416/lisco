import express from "express";
import expressListRoutes from "express-list-routes";
import cors from "cors";
import path from "path";

import { fileURLToPath } from 'url';
import csvReaderRouter from "./routes/csvReader.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


const app = express();
const PORT = process.env.PORT || 3001;
const URL = `http://localhost:${PORT}`;


const dir = path.join(__dirname, "public");

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(dir));

//Routes
app.use("/csv", csvReaderRouter);

app.listen(PORT, '0.0.0.0', () => {
	expressListRoutes(app);
	console.log(`Server is running ${URL}`);
});
