import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faFileArrowUp, faLariSign } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Container, Typography } from "@mui/material";
import AccordionCus from "./AccordionCus";
import LinearWithValueLabel from "./LinearWithValueLabel";
import { Box } from "@mui/system";
import { PDFDocument } from "pdf-lib";
import downloadjs from "downloadjs";
import { BTS_NDRC } from "../class/BTS_NDRC";
import { BTS_MCO } from "../class/BTS_MCO";
import { BTS_GPME } from "../class/BTS_GPME";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { updateStudents } from "../features/students";

const UploadContainer = ({ display }) => {
	// TODO : Add chart line
	// https://devexpress.github.io/devextreme-reactive/react/chart/demos/line/line/

	const apiUrl = process.env.REACT_APP_API_URL;

	const [fileUploaded, setFileUploaded] = useState(false);
	const [progressConversion, setProgressConversion] = useState(false);
	const [fileIsUploaded, setFileIsUploaded] = useState(false);
	const [students, setStudents] = useState();
	const [studentPdf, setStudentPdf] = useState([]);
	const [traniningTitle, setTraniningTitle] = useState();
	const [pdfPreview, setPdfPreview] = useState("");
	const [isNotTraining, setIsNotTraining] = useState(false);

	const dispatch = useDispatch();

	const onChange = (e) => {
		if (e.target.value) {
			setFileUploaded(true);
			setStudents();
			setTimeout(() => {
				setFileUploaded(false);
				setIsNotTraining(false);
			}, 3000);
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		const uploadedFile = document.querySelector(".csv-file");
		if (uploadedFile.files.length) {
			setTraniningTitle("");
			setFileIsUploaded(false);
			setIsNotTraining(false);
			const reader = new FileReader();
			const csvFile = uploadedFile.files[0];
			//read csv file
			reader.readAsText(csvFile);

			const url = `${apiUrl}/csv/analyse`;
			setProgressConversion(true);
			reader.onload = async function (event) {
				const text = event.target.result;
				axios
					.post(url, { csvFile: text })
					.then(async (resultStudents) => {
						if (typeof resultStudents.data.result === "object" && resultStudents.data.status === 200) {
							const trainingTitleHere = resultStudents.data.trainingName;
							const { result, trainingAbrege } = resultStudents.data;
							let pdfs = [];
							// update students globale state
							dispatch(updateStudents(result));

							switch (trainingAbrege) {
								case "BTS NDRC":
									setTraniningTitle(trainingTitleHere);
									setStudents(result);
									const bts_ndrc = new BTS_NDRC();
									pdfs = await bts_ndrc.generatePdf(result);
									break;

								case "BTS GPME":
									setTraniningTitle(trainingTitleHere);
									setStudents(result);
									const bts_gpme = new BTS_GPME();
									pdfs = await bts_gpme.generatePdf(result);
									break;

								case "BTS MCO":
									setTraniningTitle(trainingTitleHere);
									setStudents(result);
									const bts_mco = new BTS_MCO();
									pdfs = await bts_mco.generatePdf(result);
									break;
							}
							if (pdfs.length) {
								setProgressConversion(false);
								setStudentPdf(pdfs);

								// TODO : DELETE
								const pdfPreviewBlob = URL.createObjectURL(new Blob([pdfs[1]], { type: "application/pdf" }));
								setPdfPreview(pdfPreviewBlob);
								// END TODO DELETE;
							}
						} else {
							setIsNotTraining(true);
							setProgressConversion(false);
							setStudents([]);
						}
					})
					.catch((err) => console.error(err));
			};
		} else {
			setFileIsUploaded(true);
		}
	};

	const downloadAll = async () => {
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
			downloadjs(docSave, `${traniningTitle}.pdf`);
		}
	};

	return (
		display && (
			<Box>
				{fileUploaded && (
					<Alert
						className="alert"
						sx={{
							marginBottom: 1,
						}}
						onClose={() => {
							setFileUploaded(false);
						}}
					>
						Le fichier a été uploader
					</Alert>
				)}

				{isNotTraining && (
					<Alert
						severity="error"
						onClose={() => {
							setIsNotTraining(false);
						}}
					>
						Formation non connu
					</Alert>
				)}

				<Box component="section" className="droparea">
					<Box className="content">
						<FontAwesomeIcon icon={faFileArrowUp} size="5x" />
						<Typography component="p" className="box-text-desc">
							Jetez les élèves dans la boîte :3
						</Typography>
						<form onSubmit={submitHandler} className="form-upload">
							<input onChange={onChange} className="form-control csv-file" name="csvFile" accept=".csv" type="file" />
							<Button variant="contained" className=" primary-btn btn-upload-file" type="submit">
								Convertir
							</Button>
						</form>

						{/* <iframe src={pdfPreview} width="700" height="700" frameborder="0"></iframe> */}
						{fileIsUploaded && (
							<Typography component="p" className="error-file-upload">
								Veuillez uploader un fichier
							</Typography>
						)}
					</Box>
				</Box>

				{progressConversion && (
					<Box sx={{ marginTop: "20px " }}>
						<Typography variant="p">Convertir en pdf...</Typography>
						<LinearWithValueLabel />
					</Box>
				)}

				{students && traniningTitle && (
					<>
						<section className="uploaded-files">
							<Box component="header" className="header">
								<Typography sx={{ marginBottom: "20px", marginTop: "40px", textAlign: "center" }} variant="h4" component="h3">
									{traniningTitle} <small>(Convertie...)</small>
								</Typography>

								<Button onClick={downloadAll} className="downloadAll" color="warning" variant="contained">
									Télécharger tout
								</Button>
							</Box>
							{students.map((student, index) => (
								<AccordionCus key={index} student={student} index={index} pdf={studentPdf} />
							))}
						</section>
					</>
				)}
			</Box>
		)
	);
};

export default UploadContainer;
