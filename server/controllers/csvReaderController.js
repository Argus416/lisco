"use strict";
import { csvToObj } from "csv-to-js-parser";
import BTS_GPME from "../class/BTS_GPME.js";
import BTS_MCO from "../class/BTS_MCO.js";
import BTS_NDRC from "../class/BTS_NDRC.js";

const csvAnalyser = async (req, res) => {
	const data = req.body.csvFile;

	// const data = fs.readFileSync("public/data/Test_export_GPME.csv").toString();
	let obj;
	if (data.length && csvToObj(data, ";").length) {
		obj = csvToObj(data, ";");
	} else {
		return res.json({ error: "Error reading csv file" });
	}
	let result = [];
	const trainingAbreg = obj[0]?.ABREGE_FORMATION;
	const trainingName = obj[0]?.NOM_FORMATION;
	let status = 200;

	switch (trainingAbreg) {
		case "BTS NDRC":
			const BTS_NDRC_CLASS = new BTS_NDRC(obj);
			result = BTS_NDRC_CLASS.getStudents();
			break;

		case "BTS GPME":
			const BTS_GPME_CLASS = new BTS_GPME(obj);
			result = BTS_GPME_CLASS.getStudents();
			break;

		case "BTS MCO":
			const BTS_MCO_CLASS = new BTS_MCO(obj);
			result = BTS_MCO_CLASS.getStudents();
			break;
		default:
			result = "formation non connu";
			status = 400;
	}

	res.json({
		result: result,
		trainingName: trainingName,
		trainingAbrege: trainingAbreg,
		status: status,
	});
};


export default { csvAnalyser };