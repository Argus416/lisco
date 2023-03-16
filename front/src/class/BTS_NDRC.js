import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import { getObservation } from "../Helpers/helpers";

export class BTS_NDRC {
	constructor() {
		const apiUrl = process.env.REACT_APP_API_URL;

		this.pdfURL = `${apiUrl}/data/BTS_NDRC.pdf`;
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

						// Get the width and height of the first page
						const { width, height } = firstPage.getSize();

						// **********************************************

						const studentsFirstYear = eleve["1ere ANNEE"] ?? [];
						const studentsSecondeYear = eleve["2e ANNEE"] ?? [];

						const configText = {
							size: 10,
							color: rgb(0, 0, 0.5),
						};

						let moyenneMetierY = 126;
						if (studentsSecondeYear.length && studentsSecondeYear !== undefined) {
							const positionsLineGraphicStudent = [];
							const positionsLineGraphicGroup = [];

							await Promise.all(
								studentsSecondeYear.map(async (secondYear, student_index) => {
									moyenneMetierY = moyenneMetierY - 25;
									// Difinire la position des coordonnées
									const Coordonnes = [
										{
											text: secondYear.NOM_APPRENANT !== null ? secondYear.NOM_APPRENANT : "",
											position: {
												x: width / 2 - 130,
												y: height / 2 + 228,
												...configText,
											},
										},

										{
											text: secondYear.PRENOM_APPRENANT !== null ? secondYear.PRENOM_APPRENANT : "",
											position: {
												x: width / 2 - 130,
												y: height / 2 + 195,
												...configText,
											},
										},

										{
											text: secondYear.DATE_NAISSANCE_APPRENANT !== null ? secondYear.DATE_NAISSANCE_APPRENANT : "",

											position: {
												x: width / 2 - 130,
												y: height / 2 + 163,
												...configText,
											},
										},

										{
											text: "Anglais",
											position: {
												x: width / 2 + 10,
												y: height / 2 + 163,
												size: configText.size,
												// font: configText.font,
												color: configText.color,
											},
										},
									];

									// Imprimer seulement une foix par élève
									Coordonnes.forEach((coord) => {
										if (student_index === 1) {
											firstPage.drawText(coord.text ?? "", coord.position);
										}
									});

									let MoyenneMetierPremiereAnnee = {
										text: studentsFirstYear[student_index] == null ? "" : studentsFirstYear[student_index].MOYENNE_MAT_GENERALE,
										position: {
											x: 70,
											y: height / 2 + moyenneMetierY,
											...configText,
										},
									};

									let MoyenneMetierDeuxiemeAnnee = {
										text: secondYear.MOYENNE_MAT_GENERALE === null ? "" : secondYear.MOYENNE_MAT_GENERALE,
										position: {
											x: width / 2 + 70,
											y: height / 2 + moyenneMetierY,
											...configText,
										},
									};

									let semestreUn = {
										text: secondYear.MOYENNE_1 !== null && secondYear.MOYENNE_1 !== undefined ? secondYear.MOYENNE_1 : "",
										position: {
											x: width / 2 - 40,
											y: height / 2 + moyenneMetierY,
											...configText,
										},
									};

									let semestreDeux = {
										text: secondYear.MOYENNE_2 !== null && secondYear.MOYENNE_2 !== undefined ? secondYear.MOYENNE_2 : "",
										position: {
											x: width / 2 + 15,
											y: height / 2 + moyenneMetierY,
											...configText,
										},
									};

									let observationAnnuelleMatier = {
										text: getObservation(secondYear.OBSERVATION_ANNUELLE_MATIERE, 8, 6),
										position: {
											x: width / 2 + 120,
											y: height / 2 + moyenneMetierY + 3,
											size: 9,
											color: rgb(0, 0, 0.5),
											lineHeight: 12,
										},
									};

									firstPage.drawText(MoyenneMetierPremiereAnnee.text ?? "", MoyenneMetierPremiereAnnee.position);

									firstPage.drawText(semestreUn.text, semestreUn.position);
									firstPage.drawText(semestreDeux.text, semestreDeux.position);

									firstPage.drawText(MoyenneMetierDeuxiemeAnnee.text, MoyenneMetierDeuxiemeAnnee.position);

									firstPage.drawText(observationAnnuelleMatier.text, observationAnnuelleMatier.position);

									// Decision du jury **************************
									if (student_index === 0) {
										const juryDecisionTF = {
											text: String(eleve.juryGlobalDecision.tf.percentage),
											position: {
												x: width / 2 - 145,
												y: 108,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionF = {
											text: String(eleve.juryGlobalDecision.f.percentage),
											position: {
												x: width / 2 - 95,
												y: 108,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionDFSP = {
											text: String(eleve.juryGlobalDecision.dfsp.percentage),
											position: {
												x: width / 2 - 45,
												y: 108,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecisionTOTAL = {
											text: String(eleve.juryGlobalDecision.total),
											position: {
												x: width / 2 + 15,
												y: 108,
												size: 8.5,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										const juryDecision = {
											text: String(eleve.juryDecision.title),
											position: {
												x: 80,
												y: 130,
												size: 10,
												color: rgb(0, 0, 0.5),
												lineHeight: 12,
											},
										};

										switch (eleve.juryDecision.title) {
											case "Trés favorable":
												juryDecision.position.x = 92;
												break;
											case "Favorable":
												juryDecision.position.x = 100;
												break;
										}

										eleve.yearResult.forEach((year, yearIndex) => {
											const yearResult = {
												text: year.year,
												position: {
													x: width / 2 + 55,
													y: 130 - 23 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const presentes = {
												text: year.presentes,
												position: {
													x: width / 2 + 103,
													y: 130 - 23 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const recus = {
												text: year.recus,
												position: {
													x: width / 2 + 143,
													y: 130 - 23 * yearIndex,
													size: 8.5,
													color: rgb(0, 0, 0.5),
													lineHeight: 12,
												},
											};

											const result = {
												text: year.result,
												position: {
													x: width / 2 + 185,
													y: 130 - 23 * yearIndex,
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
									let moyenne = secondYear.MOYENNE_MAT_GENERALE;
									let moyenneGroupMatier = secondYear.MOYENNE_MAT_GRPE_ANNUELLE;

									const getDrawLineStudents = getCoordinateGraph(moyenne, student_index);
									const getDrawLineGroup = getCoordinateGraph(moyenneGroupMatier, student_index);

									// positionsLineGraphicStudent.push(drawLine);
									positionsLineGraphicGroup.push(getDrawLineGroup);
									positionsLineGraphicStudent.push(getDrawLineStudents);
									// *******
									if (student_index + 1 === studentsSecondeYear.length) {
										//drawline group
										printGraphic(secondePage, positionsLineGraphicGroup, student_index, studentsSecondeYear);

										//drawline student
										printGraphic(secondePage, positionsLineGraphicStudent, student_index, studentsSecondeYear, rgb(0.75, 0.2, 0.2));
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

function getCoordinateGraph(moyenne, studentIndex) {
	if (moyenne !== null && moyenne !== NaN) {
		moyenne = moyenne.replace(",", ".");
		moyenne = parseFloat(moyenne);
	}

	const drawLine = {
		start: {
			x: 120 + 80 + (studentIndex - 1) * 79.5,
			y: 85 + 14.2 * moyenne,
		},
	};

	if (moyenne === NaN || moyenne === null) {
		drawLine.start.y = 0;
	}

	return drawLine;
}

const printGraphic = (page, arrayPositons, studentIndex, studentsSecondeYear, colorLine = rgb(0, 0, 0)) => {
	if (studentIndex + 1 === studentsSecondeYear.length) {
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
	}
};
