import lodash from "lodash";
import { orderBy } from "../Helpers/helpers.js";

export default class BTS_MCO {
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
        const studentGroupByYear = this.studentGroupByYear();
        // Order year by subject NUM_ORDRE_MATIERE
        studentGroupByYear.map((student, index) => {
            const firstYear = student["1ere ANNEE"] ?? [];
            const secondYear = student["2e ANNEE"] ?? [];

            // If student passed the first year at the Campus CCI
            if (firstYear.length) {
                student["1ere ANNEE"] = orderBy(student["1ere ANNEE"], "NUM_ORDRE_MATIERE");
                // DELETE  DIGITAL
                student["1ere ANNEE"] = student["1ere ANNEE"].filter((e) => e.ABREGE_MATIERE !== "DIGITAL");
            }

            student["2e ANNEE"] = orderBy(student["2e ANNEE"], "NUM_ORDRE_MATIERE");

            // DELETE  DIGITAL
            student["2e ANNEE"] = student["2e ANNEE"].filter((e) => e.ABREGE_MATIERE !== "DIGITAL");
        });

        return studentGroupByYear;
    }
};
