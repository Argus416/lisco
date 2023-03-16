"use strict";

const fs = require("fs");
const csvToObj = require("csv-to-js-parser").csvToObj;
// https://www.npmjs.com/package/csv-to-js-parser
const lodash = require("lodash");
const BTS_NDRC = require("../class/BTS_NDRC.js");
const BTS_GPME = require("../class/BTS_GPME.js");
const BTS_MCO = require("../class/BTS_MCO.js");

exports.csvAnalyser = async (req, res) => {
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
