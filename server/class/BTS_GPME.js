import { toNumber, toString } from "../Helpers/helpers.js";

export default class BTS_NDRC {
	constructor(csvObj) {
		this.csvObj = csvObj;
	}

	findStudents() {
		// group by student
		let obj = this.csvObj.filter((e) => e.NOM_ANNEE);
		obj = lodash.groupBy(obj, "CODE_APPRENANT");
		obj = lodash.values(obj);
		return obj;
	}

	studentGroupByYear() {
		const students = this.findStudents();

		let studentGroupByYear = [];

		// Group student by year
		for (let i = 0; i < students.length; i++) {
			studentGroupByYear.push(lodash.groupBy(students[i], "NOM_ANNEE"));
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
			let secodYearSorted = [];
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

			secodYearSorted = groupBy(student["2e ANNEE"], "ABREGE_MATIERE");

			// delete secodYearSorted["ATELIER PRO"];

			secodYearSorted.U1[0].NUM_ORDRE_MATIERE = 1;
			secodYearSorted.U2[0].NUM_ORDRE_MATIERE = 2;
			secodYearSorted["Eco droit"].at(0).NUM_ORDRE_MATIERE = 3;
			// secodYearSorted["EDM App"][0].NUM_ORDRE_MATIERE = 4;
			secodYearSorted.Culture_eco_appliquee_et_EDM_App = specifObjectForm(
				secodYearSorted["Eco droit"][0],
				secodYearSorted.Com[0],
				secodYearSorted["EDM App"][0]
			);
			secodYearSorted.U51[0].NUM_ORDRE_MATIERE = 6;
			secodYearSorted.U52[0].NUM_ORDRE_MATIERE = 7;
			secodYearSorted.U6[0].NUM_ORDRE_MATIERE = 8;
			secodYearSorted.Com[0].NUM_ORDRE_MATIERE = 9;
			secodYearSorted["ATELIER PRO"][0].NUM_ORDRE_MATIERE = 10;

			secondYearSortedOrdered = [
				secodYearSorted.U1[0],
				secodYearSorted.U2[0],
				secodYearSorted["Eco droit"][0],
				// secodYearSorted["EDM App"][0],
				secodYearSorted.Culture_eco_appliquee_et_EDM_App,
				secodYearSorted["GRCF-AND-GRCF_EBP"][0],
				secodYearSorted.U51[0],
				secodYearSorted.U52[0],
				secodYearSorted.U6[0],
				secodYearSorted.Com[0],
				secodYearSorted["ATELIER PRO"][0],
			];

			delete secodYearSorted.GRCF;
			delete secodYearSorted["GRCF EBP"];
			delete secodYearSorted["EDM App"];

			students[index]["2e ANNEE"] = secondYearSortedOrdered;
		});

		return students;
	}
};

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
	return template;
};

const groupBy = (array, groupByElement) => {
	let sorted = lodash.groupBy(array, groupByElement);
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
