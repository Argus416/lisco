const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const URL = `http://localhost:${PORT}`;
const expressListRoutes = require("express-list-routes");

const cors = require("cors");

const path = require("path");
const dir = path.join(__dirname, "public");

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(dir));

//Routes
const csvReaderRouter = require("./routes/csvReader");
app.use("/csv", csvReaderRouter);

app.listen(PORT, () => {
	expressListRoutes(app);
	console.log(`Server is running ${URL}`);
});
