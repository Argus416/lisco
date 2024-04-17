import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import { getObservation } from "../Helpers/helpers";

export class BTS_GPME {
	constructor() {
		const apiUrl = process.env.REACT_APP_API_URL;
		this.pdfURL = `${apiUrl}/data/BTS_GPME.pdf`;
	}

	// ********************************************

	// Récupèrer le pdf à partir du serveur en format arraybuffer
	async getPdf() {
		const pdf = await axios({
			method: "GET",
			responseType: "arraybuffer",
			url: this.pdfURL,
		})
			.then((res) => res.data)
			.catch((err) => console.error(`Error fetching PDF, CODE ERROR ${err}`));

		return pdf;
	}

	getFirstStudentWhoPassedBothYears(students) {
		let index = null;

		if (students.length) {
			for (let i = 0; i < students.length; i++) {
				if (students[i]["1ere ANNEE"] !== undefined && students[i]["2e ANNEE"] !== undefined) {
					index = i;
					break;
				}
			}
		}
		return index;
	}

	// ********************************************

	async generatePdf(students) {
		const pdf = await this.getPdf();

		const firstStudentPassedBothYears = this.getFirstStudentWhoPassedBothYears(students);
		const allStudentPdf = [];

		if (students.length) {
			await Promise.all(
				students.map(async (eleve, index) => {
					// Load an existing PDFDocument
					const pdfDoc = await PDFDocument.load(pdf);

					// Get the first page of the document
					const firstPage = pdfDoc.getPage(0);
					const secondePage = pdfDoc.getPage(1);

					// Get the width and height of the first page
					const { width, height } = firstPage.getSize();

					// **********************************************

					const studentsFirstYear = eleve["1ere ANNEE"] ?? [];
					const studentsSecondeYear = eleve["2e ANNEE"] ?? [];

					const configText = {
						size: 10,
						color: rgb(0, 0, 0.5),
					};

					let moyenneMetierYFirstYear = height / 2 + 275;
					let moyenneMetierYSecondYear = height / 2 + 50;

					// ! Change year here
					if (studentsSecondeYear.length && studentsSecondeYear !== undefined) {
						let studentIndex = 0;
						let studentIndexSubjectSecondYearIndex = 8;

						const positionsLineGraphicStudentCommuns = [];
						const positionsLineGraphicGroupCommuns = [];
						const positionsLineGraphicSubjectsSecondYearStudents = [];
						const positionsLineGraphicSubjectsSecondYearGroup = [];

						let differnceY = 25;

						let differnceYFirstYearYear = differnceY;
						let differnceYSecondYear = differnceY;

						// ! Change year here
						try {
							await Promise.all(
								studentsSecondeYear.map(async (secondYear, student_index) => {

									if (student_index < 2) {
										//First year
										differnceYFirstYearYear = differnceYFirstYearYear - 1;

										//Second year
										differnceYSecondYear = differnceYSecondYear - 0.4;
										moyenneMetierYSecondYear = moyenneMetierYSecondYear - differnceYSecondYear;
									} else {
										//Second year
										moyenneMetierYSecondYear = moyenneMetierYSecondYear - differnceYSecondYear + 0.6;
										differnceYSecondYear = differnceYSecondYear - 0.1;
									}

									moyenneMetierYFirstYear = moyenneMetierYFirstYear - differnceYFirstYearYear;
									// Difinire la position des coordonnées
									const Coordonnes = [
										{
											text: secondYear?.NOM_APPRENANT !== null ? secondYear?.NOM_APPRENANT : "",
											position: {
												x: width / 2 - 15,
												y: height / 2 + 353,
												...configText,
											},
										},

										{
											text: secondYear?.PRENOM_APPRENANT !== null ? secondYear?.PRENOM_APPRENANT : "",
											position: {
												x: width / 2 - 80,
												y: height / 2 + 330,
												...configText,
											},
										},

										{
											text: secondYear?.DATE_NAISSANCE_APPRENANT !== null ? secondYear?.DATE_NAISSANCE_APPRENANT : "",

											position: {
												x: width / 2 - 116,
												y: height / 2 + 297,
												...configText,
											},
										},

										{
											text: "Anglais",
											position: {
												x: width / 2 - 20,
												y: height / 2 + 297,
												size: configText.size,
												// font: configText.font,
												color: configText.color,
											},
										},
									];

									Coordonnes.forEach((coord) => {
										// Print only one time
										if (student_index === 1) {
											firstPage.drawText(coord.text ?? "", coord.position);
										}
									});

									// First year **************************

									let firstYearObservation = {};
									let MoyenneMetierPremiereAnnee = {};
									let semestreUnPremiereAnnee = {};
									let semestreDeuxPremiereAnnee = {};

									// Puisque les matières de 2ème année sont moins que la 1ère année
									if (studentsFirstYear[student_index] !== undefined) {
										MoyenneMetierPremiereAnnee = {
											text: studentsFirstYear[student_index].MOYENNE_MAT_GENERALE,
											position: {
												x: width / 2 - 8,
												y: moyenneMetierYFirstYear,
												...configText,
											},
										};

										semestreUnPremiereAnnee = {
											text: studentsFirstYear[student_index].MOYENNE_1,
											position: {
												x: width / 2 - 102,
												y: moyenneMetierYFirstYear,
												...configText,
											},
										};

										semestreDeuxPremiereAnnee = {
											text: studentsFirstYear[student_index].MOYENNE_2,
											position: {
												x: width / 2 - 58,
												y: moyenneMetierYFirstYear,
												...configText,
											},
										};

										firstYearObservation = {
											text: getObservation(studentsFirstYear[student_index].OBSERVATION_ANNUELLE_MATIERE, 8, 8),
											position: {
												x: width / 2 + 35,
												y: moyenneMetierYFirstYear + 5,
												size: 7,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};
									}

									// Second year **************************

									let MoyenneMetierDeuxiemeAnnee = {
										text: secondYear.MOYENNE_MAT_GENERALE === null ? "" : secondYear.MOYENNE_MAT_GENERALE,
										position: {
											x: width / 2 - 8,
											y: moyenneMetierYSecondYear,
											...configText,
										},
									};

									let semestreUnDeuxiemeAnnee = {
										text: secondYear.MOYENNE_1 !== null && secondYear.MOYENNE_1 !== undefined ? secondYear.MOYENNE_1 : "",
										position: {
											x: width / 2 - 102,
											y: moyenneMetierYSecondYear,
											...configText,
										},
									};

									let semestreDeuxDeuxiemeAnnee = {
										text: secondYear.MOYENNE_2 !== null && secondYear.MOYENNE_2 !== undefined ? secondYear.MOYENNE_2 : "",
										position: {
											x: width / 2 - 58,
											y: moyenneMetierYSecondYear,
											...configText,
										},
									};

									let secondYearObservation = {
										text: getObservation(secondYear.OBSERVATION_ANNUELLE_MATIERE, 8, 8),
										position: {
											x: width / 2 + 35,
											y: moyenneMetierYSecondYear + 5,
											size: 7,
											color: rgb(0, 0, 0.5),
											lineHeight: 12,
										},
									};

									// Print notes of the first year
									if (studentsFirstYear[student_index] !== undefined) {
										if (
											studentsFirstYear[student_index].MOYENNE_MAT_GENERALE !== null &&
											studentsFirstYear[student_index].MOYENNE_MAT_GENERALE !== Boolean &&
											studentsFirstYear[student_index].MOYENNE_MAT_GENERALE !== undefined
										) {
											if (studentsFirstYear[student_index].ABREGE_MATIERE === "ATELIER PRO") {
												// let coief = 0;
												let yPosition = height / 2 + 95;

												drawCirelAtelierPro(studentsFirstYear[student_index].MOYENNE_MAT_GENERALE, yPosition, firstPage, width);
												firstPage.drawText(firstYearObservation.text, firstYearObservation.position);
											} else {
												firstPage.drawText(firstYearObservation.text ?? "", firstYearObservation.position);
												firstPage.drawText(MoyenneMetierPremiereAnnee.text ?? "", MoyenneMetierPremiereAnnee.position);
												firstPage.drawText(semestreUnPremiereAnnee.text ?? "", semestreUnPremiereAnnee.position);
												firstPage.drawText(semestreDeuxPremiereAnnee.text ?? "", semestreDeuxPremiereAnnee.position);
											}
										}
									}

									if (secondYear.ABREGE_MATIERE === "ATELIER PRO") {
										let yPosition2 = height / 2 - 180;
										drawCirelAtelierPro(secondYear.MOYENNE_MAT_GENERALE, yPosition2, firstPage, width);
									} else {
										firstPage.drawText(semestreUnDeuxiemeAnnee.text, semestreUnDeuxiemeAnnee.position);
										firstPage.drawText(semestreDeuxDeuxiemeAnnee.text, semestreDeuxDeuxiemeAnnee.position);

										firstPage.drawText(MoyenneMetierDeuxiemeAnnee.text, MoyenneMetierDeuxiemeAnnee.position);
									}

									firstPage.drawText(secondYearObservation.text, secondYearObservation.position);

									// Decision **************************
									if (student_index === 0 && eleve.juryDecision.title !== "") {
										const juryDecisionTF = {
											text: String(eleve.juryGlobalDecision.tf.percentage),
											position: {
												x: width / 2 - 115,
												y: 80,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};
										const juryDecisionF = {
											text: String(eleve.juryGlobalDecision.f.percentage),
											position: {
												x: width / 2 - 80,
												y: 80,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionDFSP = {
											text: String(eleve.juryGlobalDecision.dfsp.percentage),
											position: {
												x: width / 2 - 45,
												y: 80,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionTOTAL = {
											text: String(eleve.juryGlobalDecision.total),
											position: {
												x: width / 2,
												y: 80,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecision = {
											text: String(eleve.juryDecision.title),
											position: {
												x: 50,
												y: 100,
												size: 10,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										switch (eleve.juryDecision.title) {
											case "Trés favorable":
												juryDecision.position.x = 60;
												break;
											case "Favorable":
												juryDecision.position.x = 75;
												break;
										}

										eleve.yearResult.map((year, yearIndex) => {
											const yearResult = {
												text: year.year,
												position: {
													x: width / 2 + 30,
													y: 100 - 15 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const presentes = {
												text: year.presentes,
												position: {
													x: width / 2 + 70,
													y: 100 - 15 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const recus = {
												text: year.recus,
												position: {
													x: width / 2 + 110,
													y: 100 - 15 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const result = {
												text: year.result,
												position: {
													x: width / 2 + 140,
													y: 100 - 15 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											firstPage.drawText(presentes.text, presentes.position);
											firstPage.drawText(recus.text, recus.position);
											firstPage.drawText(result.text, result.position);
											firstPage.drawText(yearResult.text, yearResult.position);
										});

										firstPage.drawText(juryDecisionTF.text, juryDecisionTF.position);
										firstPage.drawText(juryDecisionF.text, juryDecisionF.position);
										firstPage.drawText(juryDecisionDFSP.text, juryDecisionDFSP.position);
										firstPage.drawText(juryDecisionTOTAL.text, juryDecisionTOTAL.position);
										firstPage.drawText(juryDecision.text, juryDecision.position);
									}

									// ! *************************************************
									// ! Graphic
									// ! *************************************************

									// Moyenne d'un eleve
									let averageFirstYear = "";
									let moyenneGroupMatier = "";
									if (studentsFirstYear[studentIndex] !== undefined) {
										averageFirstYear = studentsFirstYear[studentIndex].MOYENNE_MAT_GENERALE;
									}
									let moyenne = calculateAverage(averageFirstYear, secondYear.MOYENNE_MAT_GENERALE);

									moyenneGroupMatier = calculateAverage(
										students[firstStudentPassedBothYears]["1ere ANNEE"][studentIndex].MOYENNE_MAT_GRPE_ANNUELLE,
										secondYear.MOYENNE_MAT_GRPE_ANNUELLE
									);

									let averageSubjectsecondYear = secondYear.MOYENNE_MAT_GENERALE;

									// let moyenne = secondYear.MOYENNE_MAT_GENERALE;
									// let moyenneGroupMatier = secondYear.MOYENNE_MAT_GRPE_ANNUELLE;

									// *******
									if (secondYear.ABREGE_MATIERE !== "U51" && secondYear.ABREGE_MATIERE !== "U52") {
										const getDrawLineStudents = getCoordinateGraph(moyenne, studentIndex, secondYear.ABREGE_MATIERE);

										const getDrawLineGroup = getCoordinateGraph(moyenneGroupMatier, studentIndex, secondYear.ABREGE_MATIERE);
										positionsLineGraphicGroupCommuns.push(getDrawLineGroup);
										positionsLineGraphicStudentCommuns.push(getDrawLineStudents);
										if (student_index + 1 === studentsSecondeYear.length) {
											//drawline group
											printGraphic(secondePage, positionsLineGraphicGroupCommuns);

											//drawline student
											printGraphic(secondePage, positionsLineGraphicStudentCommuns, rgb(0.75, 0.2, 0.2));
										}
										studentIndex++;
									} else {
										// Enseignements de 2ème année
										const getDrawLineGroup2 = getCoordinateGraph(
											secondYear.MOYENNE_MAT_GRPE_ANNUELLE,
											studentIndexSubjectSecondYearIndex,
											secondYear.ABREGE_MATIERE
										);

										const getDrawLineStudents2 = getCoordinateGraph(
											averageSubjectsecondYear,
											studentIndexSubjectSecondYearIndex,
											secondYear.ABREGE_MATIERE
										);

										positionsLineGraphicSubjectsSecondYearGroup.push(getDrawLineGroup2);
										positionsLineGraphicSubjectsSecondYearStudents.push(getDrawLineStudents2);

										studentIndexSubjectSecondYearIndex++;
									}

									// Print graphic subjects second year
									if (positionsLineGraphicGroupCommuns.length === 8) {
										if (positionsLineGraphicSubjectsSecondYearStudents.length === 2) {
											if (positionsLineGraphicStudentCommuns[7].start.y !== 0) {
												//drawline student
												secondePage.drawLine({
													start: {
														x: positionsLineGraphicStudentCommuns[7].start.x,
														y: positionsLineGraphicStudentCommuns[7].start.y,
													},
													end: {
														x: positionsLineGraphicSubjectsSecondYearStudents[0].start.x,
														y: positionsLineGraphicSubjectsSecondYearStudents[0].start.y,
													},
													thickness: 2,
													color: rgb(0.75, 0.2, 0.2),
												});

												//drawline student
												printGraphic(secondePage, positionsLineGraphicSubjectsSecondYearStudents, rgb(0.75, 0.2, 0.2));
											} else {
												// When students didn't do the first year, print only the subjects of the second year
												printGraphic(secondePage, positionsLineGraphicSubjectsSecondYearStudents, rgb(0.75, 0.2, 0.2));
											}

											if (positionsLineGraphicGroupCommuns[7].start.y !== 0) {
												//drawline group
												secondePage.drawLine({
													start: {
														x: positionsLineGraphicGroupCommuns[7].start.x,
														y: positionsLineGraphicGroupCommuns[7].start.y,
													},
													end: {
														x: positionsLineGraphicSubjectsSecondYearGroup[0].start.x,
														y: positionsLineGraphicSubjectsSecondYearGroup[0].start.y,
													},
													thickness: 2,
												});

												//drawline group
												printGraphic(secondePage, positionsLineGraphicSubjectsSecondYearGroup);
											}
										}
									}

									// ! *********************************************************
								})
							);
						} catch (err) {
							console.error(err);
						}
					}

					let pdfStudent = await pdfDoc.save();
					allStudentPdf.push(pdfStudent);
				})
			);
		} else {
			console.error("No students have been found");
		}

		return allStudentPdf;
	}

	// ********************************************
}

// * since we can't create private methods in Javascript, I'm creating this function outside the class WITHOUT EXPORTING IT

const drawCirelAtelierPro = (moyenne_mat_generale, yPosition, page, widthPage) => {
	let coeif = 0;
	if (moyenne_mat_generale !== null && moyenne_mat_generale !== undefined && moyenne_mat_generale !== "") {
		moyenne_mat_generale = moyenne_mat_generale.replace(",", ".");
		moyenne_mat_generale = parseFloat(moyenne_mat_generale);

		for (let i = 1; i <= 4; i++) {
			if (moyenne_mat_generale <= 5 * i) {
				coeif = 11 * i;
				if (5 * i === 20) {
					coeif = 10.5 * i;
				}
				break;
			}
		}

		page.drawCircle({
			x: widthPage / 2 - 114 + coeif,
			y: yPosition,
			size: 6,
			borderWidth: 2,
			borderColor: rgb(0, 0, 0.5),
		});
	}
};

// One of BTS_GPME conditions was to caclulate the average of both years and take the condition the empty average !
// Exemples
// 1- (15 + 15) / 2 = 15
// 2- (15 + 0) / 2 = 7.5
// 3- (15 + "") / 2 = 15
// 4- ( ""+ "") / 2 = "" => print nothing

const calculateAverage = (averageFirstYear, averageSecondeYear) => {
	if (averageFirstYear && averageSecondeYear) {
		let result = "";

		const firstYear = toNumber(averageFirstYear);
		const secondYear = toNumber(averageSecondeYear);
		result = numberExistThenGetAverage(firstYear, secondYear);

		return result;
	}
};

function getCoordinateGraph(moyenne, studentIndex, subjectAbrege = "") {
	let drawLine = { start: { x: 0, y: 0 } };
	if (moyenne === null || moyenne === NaN || moyenne === undefined || moyenne === "") {
		drawLine.start.y = 0;
	} else {
		moyenne = toNumber(moyenne);
		//Conditions
		let xDifference = 52.6;
		let yDifference = 14.2;

		switch (subjectAbrege) {
			case "GRCF & GRCF EBP":
				xDifference = 51.6;
				break;

			case "U51":
				xDifference = 53.2;
				break;

			case "U52":
				xDifference = 53.4;
				break;
		}

		drawLine = {
			start: {
				x: 167 + xDifference + (studentIndex - 1) * xDifference,
				y: 82 + yDifference * moyenne,
			},
		};
	}

	return drawLine;
}

// After calculating the average of notes of both years, get the position then draw the line
// the ending of a line is the beginning of the next position
const printGraphic = (page, arrayPositons, colorLine = rgb(0, 0, 0)) => {
	arrayPositons.forEach((position, indexLinePosition) => {
		if (indexLinePosition + 1 !== arrayPositons.length) {
			// If there is no note
			if (position.start.y !== 0 && arrayPositons[indexLinePosition + 1].start.y !== 0) {
				page.drawLine({
					start: {
						x: position.start.x,
						y: position.start.y,
					},
					end: {
						x: arrayPositons[indexLinePosition + 1].start.x,
						y: arrayPositons[indexLinePosition + 1].start.y,
					},
					thickness: 2,
					color: colorLine,
				});

				// Draw the circle the very first note
				if (indexLinePosition === 0) {
					page.drawCircle({
						x: position.start.x,
						y: position.start.y,
						size: 3,
						color: colorLine,
					});
				}

				// Draw the circle for the other notes
			}

			// Draw the circle when there is no note
			if (arrayPositons[indexLinePosition + 1].start.y !== 0) {
				if (indexLinePosition === 0) {
					page.drawCircle({
						x: position.start.x,
						y: position.start.y,
						size: 3,
						color: colorLine,
					});
				}

				page.drawCircle({
					x: arrayPositons[indexLinePosition + 1].start.x,
					y: arrayPositons[indexLinePosition + 1].start.y,
					size: 3,
					color: colorLine,
				});
			}
		} else {
			// For the first value of arrayPosition, we draw only a circle
			page.drawCircle({
				x: arrayPositons[indexLinePosition - 1].start.x,
				y: arrayPositons[indexLinePosition - 1].start.y,
				size: 3,
				color: colorLine,
			});
		}
	});
};

const numberExistThenGetAverage = (checkNumber_1, checkNumber_2) => {
	const valuesToCheck = [checkNumber_1, checkNumber_2];
	let number = "";
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

	return number;
};

const toNumber = (number) => {
	if (number !== null && number !== NaN) {
		number = typeof number === "string" ? number.toString().replace(",", ".") : number;
		number = parseFloat(number);
	}

	return number;
};
