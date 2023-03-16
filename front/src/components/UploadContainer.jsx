import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Typography } from "@mui/material";
import LinearWithValueLabel from "./LinearWithValueLabel";
import { Box } from "@mui/system";

//Redux
import { useDispatch } from "react-redux";
import { updateStudents } from "../features/students";

function emptyFileInput() {
	document.querySelector(".csv-file").classList.remove("hidden");
	document.querySelector(".csv-file").value = "";
}

const UploadContainer = ({ nextStep }) => {
	const apiUrl = process.env.REACT_APP_API_URL;

	const [fileUploaded, setFileUploaded] = useState(false);
	const [progressConversion, setProgressConversion] = useState(false);
	const [fileIsUploaded, setFileIsUploaded] = useState(false);
	const [students, setStudents] = useState();
	const [isNotTraining, setIsNotTraining] = useState(false);
	const [display, setDisplay] = useState(true);

	const dispatch = useDispatch();

	const changeHandler = (e) => {
		if (e.target.value) {
			document.querySelector(".csv-file").classList.add("hidden");

			setFileUploaded(true);
			setFileIsUploaded(true);
			setStudents([]);
			setTimeout(() => {
				setFileUploaded(false);
				setIsNotTraining(false);
			}, 3000);
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		const uploadedFile = document.querySelector(".csv-file");
		// Si un fichier est uploadé
		if (uploadedFile.files.length) {
			setFileIsUploaded(false);
			setIsNotTraining(false);
			// Lire le fichier csv uploadé ensuite l'evnoyé au serveur
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
						// Si la réponse du serveur est positif, passe au 2ème étape
						if (typeof resultStudents.data.result === "object" && resultStudents.data.status === 200) {
							const { result } = resultStudents.data;
							// update students globale state
							dispatch(updateStudents(result));
							nextStep();
							setDisplay(false);
						} else {
							emptyFileInput();
							// Sinon affiche une message d'erreur
							setIsNotTraining(true);
							setProgressConversion(false);
							setStudents([]);
							setFileIsUploaded(true);
						}
					})
					.catch((err) => {
						emptyFileInput();
						setIsNotTraining(true);
						setProgressConversion(false);
						setStudents([]);
						setFileIsUploaded(false);
						console.error(err);
					});
			};
		} else {
			setFileIsUploaded(true);
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
						Le fichier a été uploadé
					</Alert>
				)}

				{isNotTraining && (
					<Alert
						severity="error"
						onClose={() => {
							setIsNotTraining(false);
						}}
					>
						Formation non reconnue
					</Alert>
				)}
				<Box className="titles">
					<Typography component="h2" variant="h4" className="box-text-desc">
						Choisissez votre fichier csv
					</Typography>
				</Box>

				{progressConversion && (
					<Box sx={{ marginTop: "20px " }}>
						<Typography variant="p">Traitement des informations...</Typography>
						<LinearWithValueLabel />
					</Box>
				)}

				<form onSubmit={submitHandler} className="form-upload">
					<Box component="section" className="droparea">
						<Box className="content">
							<FontAwesomeIcon icon={faFileArrowUp} size="5x" />
							<input onChange={changeHandler} className="form-control csv-file" name="csvFile" accept=".csv" type="file" />
						</Box>
					</Box>
					{fileIsUploaded && (
						<Box className="btn-container">
							<Button variant="contained" className="btn-upload-file secondary-btn" type="submit">
								Suivant
							</Button>
						</Box>
					)}
				</form>
			</Box>
		)
	);
};

export default UploadContainer;
