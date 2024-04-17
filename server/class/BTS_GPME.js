import _ from "lodash";
import { toNumber, toString } from "../Helpers/helpers.js";
export default class BTS_NDRC {
	constructor(csvObj) {
		this.csvObj = csvObj;
	}

	findStudents() {
		// group by student
		let obj = this.csvObj.filter((e) => e.NOM_ANNEE);
		obj = _.groupBy(obj, "CODE_APPRENANT");
		obj = _.values(obj);
		return obj;
	}

	studentGroupByYear() {
		const students = this.findStudents();

		let studentGroupByYear = [];

		// Group student by year
		for (let i = 0; i < students.length; i++) {
			studentGroupByYear.push(_.groupBy(students[i], "NOM_ANNEE"));
		}

		// Filter student out who isn't in the seconde year
		studentGroupByYear = studentGroupByYear.filter((e) => {
			if ((e.hasOwnProperty("1ere ANNEE") && e.hasOwnProperty("2e ANNEE")) || e.hasOwnProperty("2e ANNEE")) {
				return e;
			}
		});

		return studentGroupByYear;
	}

	getStudents() {
		const students = this.studentGroupByYear();
		// Organiser les notes dans le même ordre que le bulletin de note
		students.map((student, index) => {
			let firstYear = student["1ere ANNEE"] ?? [];
			let secondYear = student["2e ANNEE"] ?? [];
			let firstYearSorted = [];
			let secondYearSorted = [];
			let firstYearSortedOrdered = [];
			let secondYearSortedOrdered = [];
			// If student passed the first year at the Campus CCI
			if (firstYear.length) {
				firstYearSorted = groupBy(student["1ere ANNEE"], "ABREGE_MATIERE");

				//SET ORDER
				firstYearSorted.U1[0].NUM_ORDRE_MATIERE = 1;
				firstYearSorted.U2[0].NUM_ORDRE_MATIERE = 2;
				firstYearSorted["Eco droit"][0].NUM_ORDRE_MATIERE = 3;

				// Create Culture éco appliquée
				firstYearSorted.Culture_eco_appliquee_et_EDM_App = specifObjectForm(
					firstYearSorted["Eco droit"][0],
					firstYearSorted.Com[0],
					firstYearSorted["EDM App"][0]
				);

				firstYearSorted.U6[0].NUM_ORDRE_MATIERE = 6;
				firstYearSorted.Com[0].NUM_ORDRE_MATIERE = 7;
				firstYearSorted["ATELIER PRO"][0].NUM_ORDRE_MATIERE = 8;

				firstYearSortedOrdered = [
					firstYearSorted.U1[0],
					firstYearSorted.U2[0],
					firstYearSorted["Eco droit"][0],
					firstYearSorted.Culture_eco_appliquee_et_EDM_App,
					firstYearSorted["GRCF-AND-GRCF_EBP"][0],
					firstYearSorted.U6[0],
					firstYearSorted.Com[0],
					firstYearSorted["ATELIER PRO"][0],
				];

				students[index]["1ere ANNEE"] = firstYearSortedOrdered;

				delete firstYearSorted.U51;
				delete firstYearSorted.U52;
				delete firstYearSorted.GRCF;
				delete firstYearSorted["GRCF EBP"];
				delete firstYearSorted["EDM App"];
			}

			secondYearSorted = groupBy(student["2e ANNEE"], "ABREGE_MATIERE");
			secondYearSorted = _.mapValues(secondYearSorted, (value) => value[0]);

			// delete secondYearSorted["ATELIER PRO"];

			secondYearSorted.U1.NUM_ORDRE_MATIERE = 1;
			secondYearSorted.U2.NUM_ORDRE_MATIERE = 2;
			if (secondYearSorted["Eco droit"]) secondYearSorted["Eco droit"].NUM_ORDRE_MATIERE = 3;
			// secondYearSorted["EDM App"].NUM_ORDRE_MATIERE = 4;
			console.log({student: secondYear.map((x) => x?.NOM_APPRENANT)})
			secondYearSorted.Culture_eco_appliquee_et_EDM_App = specifObjectForm(
				secondYearSorted["Eco droit"],
				secondYearSorted.Com,
				secondYearSorted["EDM App"]
			);

			secondYearSorted.U51.NUM_ORDRE_MATIERE = 6;
			secondYearSorted.U52.NUM_ORDRE_MATIERE = 7;
			secondYearSorted.U6.NUM_ORDRE_MATIERE = 8;
			secondYearSorted.Com.NUM_ORDRE_MATIERE = 9;
			secondYearSorted["ATELIER PRO"].NUM_ORDRE_MATIERE = 10;

			secondYearSortedOrdered = [
				secondYearSorted.U1,
				secondYearSorted.U2,
				secondYearSorted["Eco droit"],
				// secondYearSorted["EDM App"],
				secondYearSorted.Culture_eco_appliquee_et_EDM_App,
				secondYearSorted["GRCF-AND-GRCF_EBP"],
				secondYearSorted.U51,
				secondYearSorted.U52,
				secondYearSorted.U6,
				secondYearSorted.Com,
				secondYearSorted["ATELIER PRO"],
			];

			delete secondYearSorted.GRCF;
			delete secondYearSorted["GRCF EBP"];
			delete secondYearSorted["EDM App"];

			students[index]["2e ANNEE"] = secondYearSortedOrdered;
			return student;
		});

		console.log({ students: students.map((e) => e["2e ANNEE"].map((x) => x?.NOM_APPRENANT)) });

		return students;
	}
}

const specifObjectForm = (firstSubject, secondObject, thirdObject) => {
	const template = {
		NUM_ORDRE_MATIERE: 4,
		NOM_MATIERE: "Culture économique juridique et managériale appliquée",
		ABREGE_MATIERE: "Culture éco appliquée",

		MOYENNE_1: toString(numberExistThenCalculate(toNumber(firstSubject.MOYENNE_1), toNumber(secondObject.MOYENNE_1))),
		MOYENNE_2: toString(numberExistThenCalculate(toNumber(firstSubject.MOYENNE_2), toNumber(secondObject.MOYENNE_2))),

		MOYENNE_MAT_GENERALE: toString(numberExistThenCalculate(toNumber(firstSubject.MOYENNE_MAT_GENERALE), toNumber(secondObject.MOYENNE_MAT_GENERALE))),

		MOYENNE_MAT_GRPE_ANNUELLE: toString(
			numberExistThenCalculate(toNumber(firstSubject.MOYENNE_MAT_GRPE_ANNUELLE), toNumber(secondObject.MOYENNE_MAT_GRPE_ANNUELLE))
		),
		OBSERVATION_ANNUELLE_MATIERE: thirdObject.OBSERVATION_ANNUELLE_MATIERE,
	};

	console.log({ template });

	return template;
};

const groupBy = (array, groupByElement) => {
	let sorted = _.groupBy(array, groupByElement);
	sorted.GRCF[0].MOYENNE_1 = toNumber(sorted.GRCF[0].MOYENNE_1);
	sorted["GRCF EBP"][0].MOYENNE_1 = toNumber(sorted["GRCF EBP"][0].MOYENNE_1);

	sorted.GRCF[0].MOYENNE_2 = toNumber(sorted.GRCF[0].MOYENNE_2);
	sorted["GRCF EBP"][0].MOYENNE_2 = toNumber(sorted["GRCF EBP"][0].MOYENNE_2);

	sorted.GRCF[0].MOYENNE_MAT_GENERALE = toNumber(sorted.GRCF[0].MOYENNE_MAT_GENERALE);
	sorted["GRCF EBP"][0].MOYENNE_MAT_GENERALE = toNumber(sorted["GRCF EBP"][0].MOYENNE_MAT_GENERALE);

	sorted.GRCF[0].MOYENNE_MAT_GRPE_ANNUELLE = toNumber(sorted.GRCF[0].MOYENNE_MAT_GRPE_ANNUELLE);
	sorted["GRCF EBP"][0].MOYENNE_MAT_GRPE_ANNUELLE = toNumber(sorted["GRCF EBP"][0].MOYENNE_MAT_GRPE_ANNUELLE);

	// const test = toString(numberExistThenCalculate(sorted.GRCF[0].MOYENNE_2, sorted["GRCF EBP"][0].MOYENNE_2));
	// console.log("here", { GRCF: sorted.GRCF[0].MOYENNE_2, GRCF_EBP: sorted["GRCF EBP"][0].MOYENNE_2, result: test });
	const GRCF_AND_GRCF_EBP = {
		NUM_ORDRE_MATIERE: 5,
		NOM_MATIERE: "Gérer les relations avec les clients fournisseurs de la PME",
		ABREGE_MATIERE: "GRCF & GRCF EBP",

		MOYENNE_1: toString(numberExistThenCalculate(sorted.GRCF[0].MOYENNE_1, sorted["GRCF EBP"][0].MOYENNE_1)),
		MOYENNE_2: toString(numberExistThenCalculate(sorted.GRCF[0].MOYENNE_2, sorted["GRCF EBP"][0].MOYENNE_2)),

		MOYENNE_MAT_GENERALE: toString(numberExistThenCalculate(sorted.GRCF[0].MOYENNE_MAT_GENERALE, sorted["GRCF EBP"][0].MOYENNE_MAT_GENERALE)),

		MOYENNE_MAT_GRPE_ANNUELLE: toString(
			numberExistThenCalculate(sorted.GRCF[0].MOYENNE_MAT_GRPE_ANNUELLE, sorted["GRCF EBP"][0].MOYENNE_MAT_GRPE_ANNUELLE)
		),

		OBSERVATION_ANNUELLE_MATIERE: sorted.GRCF[0].OBSERVATION_ANNUELLE_MATIERE,
	};

	sorted.GRCF, sorted["GRCF EBP"];
	sorted = { ...sorted, "GRCF-AND-GRCF_EBP": [GRCF_AND_GRCF_EBP] };

	return sorted;
};

const numberExistThenCalculate = (checkNumber_1, checkNumber_2) => {
	let number = "";
	if (checkNumber_1 !== null || checkNumber_2 !== null) {
		const valuesToCheck = [checkNumber_1, checkNumber_2];
		let i = 0;
		for (let j = 0; j < valuesToCheck.length; j++) {
			if (valuesToCheck[j] !== null && valuesToCheck[j] !== undefined) {
				valuesToCheck[j] = valuesToCheck[j];
				i++;
			} else {
				valuesToCheck[j] = 0;
			}
		}

		if (i > 0) {
			number = (checkNumber_1 + checkNumber_2) / i;
		} else {
			number = "";
		}
	}
	return number;
};
