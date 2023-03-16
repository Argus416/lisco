import * as React from "react";
import { useSelector } from "react-redux";
import { PDFDocument } from "pdf-lib";
import downloadjs from "downloadjs";
import { Box, Typography, Button, Icon } from "@mui/material";

import { BTS_NDRC } from "../class/BTS_NDRC";
import { BTS_MCO } from "../class/BTS_MCO";
import { BTS_GPME } from "../class/BTS_GPME";

import { useState } from "react";
import { useEffect } from "react";
import AccordionCus from "./AccordionCus";
import AddchartIcon from "@mui/icons-material/Addchart";
import BallotIcon from "@mui/icons-material/Ballot";

import JuryGlobalDecision from "./JuryGlobalDecision";
const ResultStudent = () => {
	const students = useSelector((state) => state.students.value);
	const [trainingTitle, setTrainingTitle] = useState();

	const [studentPdf, setStudentPdf] = useState([]);
	const trainingTitleHere = students[0]["2e ANNEE"][0].NOM_FORMATION;
	const trainingAbrege = students[0]["2e ANNEE"][0].ABREGE_FORMATION;
	const [displayStudents, setDisplayStudents] = useState(true);

	let pdfs = [];

	useEffect(() => {
		const generatePdf = async () => {
			switch (trainingAbrege) {
				case "BTS NDRC":
					setTrainingTitle(trainingTitleHere);
					const bts_ndrc = new BTS_NDRC();
					pdfs = await bts_ndrc.generatePdf(students);
					break;

				case "BTS GPME":
					setTrainingTitle(trainingTitleHere);
					const bts_gpme = new BTS_GPME();
					pdfs = await bts_gpme.generatePdf(students);
					break;

				case "BTS MCO":
					setTrainingTitle(trainingTitleHere);
					const bts_mco = new BTS_MCO();
					pdfs = await bts_mco.generatePdf(students);
					break;
			}
			setStudentPdf(pdfs);
		};
		generatePdf();
	}, []);

	// Regrouper tous le pdf en une seule fichier ensuite le télécharger

	const donwloadPdf = async () => {
		if (studentPdf.length === students.length) {
			const doc = await PDFDocument.create();
			await Promise.all(
				studentPdf.map(async (pageBuffer) => {
					const loadPage = await PDFDocument.load(pageBuffer);
					const contentPages = await doc.copyPages(loadPage, loadPage.getPageIndices());
					contentPages.map(async (page) => {
						doc.addPage(page);
					});
				})
			);
			const docSave = await doc.save();
			downloadjs(docSave, `Livret scolaire ${trainingTitle} ${new Date().getFullYear()}.pdf`);
		}
	};

	return (
		<>
			{students && trainingTitle && (
				<>
					<Box component="section" id="resultStudent">
						<Box component="section" className="uploaded-files">
							<Box component="header" className="header">
								<Box className="titles">
									<Typography variant="h4">Téléchargez vos livrets scolaires</Typography>

									<Typography variant="h5" className="title">
										Formation : {trainingTitle}
									</Typography>
								</Box>

								<Box className="btn-container">
									<Button onClick={donwloadPdf} className="downloadAll secondary-btn" variant="contained">
										Télécharger
									</Button>
								</Box>
							</Box>
							<Box className="icons">
								{students[0].juryGlobalDecision.dfsp.percentage !== "NaN%" && (
									<>
										<Button onClick={() => setDisplayStudents(true)}>
											<Icon component={BallotIcon} />
										</Button>
										<Button onClick={() => setDisplayStudents(false)}>
											<Icon component={AddchartIcon} />
										</Button>
									</>
								)}
							</Box>
							{displayStudents ? (
								<>
									{students.map((student, index) => (
										<AccordionCus key={index} student={student} index={index} pdf={studentPdf} />
									))}

									{students.length > 15 && (
										<Box className="btn-container">
											<Button onClick={donwloadPdf} className="downloadAll secondary-btn" variant="contained">
												Télécharger
											</Button>
										</Box>
									)}
								</>
							) : (
								<JuryGlobalDecision />
							)}
						</Box>
					</Box>
				</>
			)}
		</>
	);
};
export default ResultStudent;
