import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import { getObservation } from "../Helpers/helpers";

export class BTS_MCO {
	constructor() {
		const apiUrl = process.env.REACT_APP_API_URL;

		this.pdfURL = `${apiUrl}/data/BTS_MCO.pdf`;
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

	// ********************************************

	async generatePdf(students) {
		const pdf = await this.getPdf();
		const allStudentPdf = [];

		if (students.length) {
			try {
				await Promise.all(
					students.map(async (eleve, index) => {
						// Load an existing PDFDocument
						const pdfDoc = await PDFDocument.load(pdf);

						// Get the first page of the document
						const firstPage = pdfDoc.getPage(0);
						const secondePage = pdfDoc.getPage(1);

						// Get the width and heieght of a page
						const widthFirstPage = firstPage.getWidth();
						const heightFirstPage = firstPage.getHeight();

						// **********************************************

						const studentsFirstYear = eleve["1ere ANNEE"] ?? [];
						const studentsSecondeYear = eleve["2e ANNEE"] ?? [];

						const configText = {
							size: 10,
							color: rgb(0, 0, 0.5),
						};

						let moyenneMetierY = 169;

						if (studentsSecondeYear.length && studentsSecondeYear !== undefined) {
							const positionsLineGraphicStudent = [];
							const positionsLineGraphicGroup = [];

							await Promise.all(
								studentsSecondeYear.map(async (secondYear, student_index) => {
									moyenneMetierY = moyenneMetierY - 18;

									// Difinire la position des coordonnées
									const Coordonnes = [
										{
											text: secondYear.NOM_APPRENANT !== null ? secondYear.NOM_APPRENANT : "",
											position: {
												x: widthFirstPage / 2 - 40,
												y: heightFirstPage / 2 + 268,
												...configText,
											},
										},

										{
											text: secondYear.PRENOM_APPRENANT !== null ? secondYear.PRENOM_APPRENANT : "",
											position: {
												x: widthFirstPage / 2 + 140,
												y: heightFirstPage / 2 + 268,
												...configText,
											},
										},

										{
											text: secondYear.DATE_NAISSANCE_APPRENANT !== null ? secondYear.DATE_NAISSANCE_APPRENANT : "",

											position: {
												x: widthFirstPage / 2 - 118,
												y: heightFirstPage / 2 + 231,
												...configText,
											},
										},

										{
											text: "Anglais",
											position: {
												x: widthFirstPage / 2 + 120,
												y: heightFirstPage / 2 + 220,
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

									//First Year
									let firstSemesterFirstYear = {
										text: studentsFirstYear[student_index] == null ? "" : studentsFirstYear[student_index].MOYENNE_1,
										position: {
											x: 55,
											y: heightFirstPage / 2 + moyenneMetierY,
											...configText,
										},
									};

									let secondSemesterFirstYear = {
										text: studentsFirstYear[student_index] == null ? "" : studentsFirstYear[student_index].MOYENNE_2,
										position: {
											x: 100,
											y: heightFirstPage / 2 + moyenneMetierY,
											...configText,
										},
									};

									let averageSubjectFisrtYear = {
										text: studentsFirstYear[student_index] == null ? "" : studentsFirstYear[student_index].MOYENNE_MAT_GENERALE,
										position: {
											x: 155,
											y: heightFirstPage / 2 + moyenneMetierY,
											...configText,
										},
									};

									// Print text on the pdf
									firstPage.drawText(firstSemesterFirstYear.text ?? "", firstSemesterFirstYear.position);

									firstPage.drawText(secondSemesterFirstYear.text ?? "", secondSemesterFirstYear.position);

									firstPage.drawText(averageSubjectFisrtYear.text ?? "", averageSubjectFisrtYear.position);

									// Second year
									let firstSemesterSecondYear = {
										text: secondYear.MOYENNE_1 !== null && secondYear.MOYENNE_1 !== undefined ? secondYear.MOYENNE_1 : "",
										position: {
											x: widthFirstPage / 2 - 43,
											y: heightFirstPage / 2 + moyenneMetierY,
											...configText,
										},
									};

									let secondSemestreSecondYear = {
										text: secondYear.MOYENNE_2 !== null && secondYear.MOYENNE_2 !== undefined ? secondYear.MOYENNE_2 : "",
										position: {
											x: widthFirstPage / 2,
											y: heightFirstPage / 2 + moyenneMetierY,
											...configText,
										},
									};

									let averageSubjectSecondYear = {
										text: secondYear.MOYENNE_MAT_GENERALE === null ? "" : secondYear.MOYENNE_MAT_GENERALE,
										position: {
											x: widthFirstPage / 2 + 50,
											y: heightFirstPage / 2 + moyenneMetierY,
											...configText,
										},
									};

									let observationAnnuelleMatier = {
										text: getObservation(secondYear.OBSERVATION_ANNUELLE_MATIERE, 8, 10),
										position: {
											x: widthFirstPage / 2 + 90,
											y: heightFirstPage / 2 + moyenneMetierY + 5,
											size: 9,
											color: rgb(0, 0, 0.5),
											lineHeight: 12,
										},
									};

									// Print text on the pdf
									firstPage.drawText(firstSemesterSecondYear.text, firstSemesterSecondYear.position);
									firstPage.drawText(secondSemestreSecondYear.text, secondSemestreSecondYear.position);

									firstPage.drawText(averageSubjectSecondYear.text, averageSubjectSecondYear.position);

									firstPage.drawText(observationAnnuelleMatier.text, observationAnnuelleMatier.position);

									// Decision **************************
									if (student_index === 0 && eleve.juryDecision.title !== "") {
										const juryDecisionTF = {
											text: String(eleve.juryGlobalDecision.tf.percentage),
											position: {
												x: widthFirstPage / 2 - 122,
												y: 125,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};
										const juryDecisionF = {
											text: String(eleve.juryGlobalDecision.f.percentage),
											position: {
												x: widthFirstPage / 2 - 80,
												y: 125,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionDFSP = {
											text: String(eleve.juryGlobalDecision.dfsp.percentage),
											position: {
												x: widthFirstPage / 2 - 35,
												y: 125,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionTOTAL = {
											text: String(eleve.juryGlobalDecision.total),
											position: {
												x: widthFirstPage / 2 + 15,
												y: 125,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecision = {
											text: String(eleve.juryDecision.title),
											position: {
												x: 95,
												y: 150,
												size: 10,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										switch (eleve.juryDecision.title) {
											case "Trés favorable":
												juryDecision.position.x = 110;
												break;
											case "Favorable":
												juryDecision.position.x = 120;
												break;
										}

										eleve.yearResult.forEach((year, yearIndex) => {
											const yearResult = {
												text: year.year,
												position: {
													x: widthFirstPage / 2 + 62,
													y: 180 - 18 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const presentes = {
												text: year.presentes,
												position: {
													x: widthFirstPage / 2 + 110,
													y: 180 - 18 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const recus = {
												text: year.recus,
												position: {
													x: widthFirstPage / 2 + 155,
													y: 180 - 18 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const result = {
												text: year.result,
												position: {
													x: widthFirstPage / 2 + 185,
													y: 180 - 18 * yearIndex,
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

									// ! Graphic
									// Moyenne d'un eleve
									let average = secondYear.MOYENNE_MAT_GENERALE;
									let moyenneGroupMatier = secondYear.MOYENNE_MAT_GRPE_ANNUELLE;

									const getDrawLineStudents = getCoordinateGraphic(average, student_index);
									const getDrawLineGroup = getCoordinateGraphic(moyenneGroupMatier, student_index);

									// positionsLineGraphicStudent.push(drawLine);
									positionsLineGraphicGroup.push(getDrawLineGroup);
									positionsLineGraphicStudent.push(getDrawLineStudents);

									// *******
									if (student_index + 1 === studentsSecondeYear.length) {
										//drawline group
										printGraphic(secondePage, positionsLineGraphicGroup);

										//drawline student
										printGraphic(secondePage, positionsLineGraphicStudent, rgb(0.75, 0.2, 0.2));
									}

									// ! *********************************************************
								})
							);
						}

						let pdfStudent = await pdfDoc.save();
						allStudentPdf.push(pdfStudent);
					})
				);
			} catch (err) {
				return console.error(`Error generating PDF, CODE ERROR ${err}`);
			}
		} else {
			console.error("No students have been found");
		}

		return allStudentPdf;
	}

	// ********************************************
}

// * since we can't create private methods in Javascript, I'm creating this function outside the class WITHOUT EXPORTING IT

function getCoordinateGraphic(average, studentIndex) {
	// the average must be a number
	if (average !== null && average !== NaN) {
		average = average.replace(",", ".");
		average = parseFloat(average);
	}

	const drawLine = {
		start: {
			x: 132 + 56 + (studentIndex - 1) * 56.8,
			y: 102 + 17 * average,
		},
	};

	if (average === NaN || average === null) {
		drawLine.start.y = 0;
	}

	return drawLine;
}

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
				page.drawCircle({
					x: arrayPositons[indexLinePosition + 1].start.x,
					y: arrayPositons[indexLinePosition + 1].start.y,
					size: 3,
					color: colorLine,
				});
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
		}
	});
};
