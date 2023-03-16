import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Box,
	NativeSelect,
	Typography,
	FormControl,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
} from "@mui/material";
import { updateStudents } from "../features/students";
import { useState } from "react";
import { calcPercentage } from "../Helpers/helpers";

const YearResult = ({ nextStep }) => {
	const dispatch = useDispatch();
	const students = useSelector((state) => state.students.value);
	const trainingTitle = students[0]["2e ANNEE"][0].NOM_FORMATION;
	const [display, setDisplay] = useState(true);

	// Cloner les élèves qui sont dans le reducers pour que l'objet soit modifiable
	let copiedStudents = JSON.parse(JSON.stringify(students));
	let todayYear = new Date();
	todayYear = todayYear.getFullYear();
	let years = 0;
	const trainingName = students[0]["2e ANNEE"][0].ABREGE_FORMATION;

	// Difinier le nombre d'année a afficher
	switch (trainingName) {
		case "BTS NDRC":
			years = 3;
			break;

		case "BTS GPME":
			years = 3;
			break;

		case "BTS MCO":
			years = 5;
			break;
	}

	const submitHandler = (e) => {
		// Taux de réussite brut = (Bacheliers x 100) / Présents
		e.preventDefault();
		let results = [];

		// 1- Coller le résultat dans results
		// 2- Dispatcher le réultat dans le reducer en utilisant la méthode dispatch(updateStudents(copiedStudents));

		for (let i = 0; i < years; i++) {
			const resultYear = calcPercentage(e.target[`recus${i}`].value, e.target[`presente${i}`].value, false);
			results.push({
				presentes: e.target[`presente${i}`].value,
				recus: e.target[`recus${i}`].value,
				year: String(todayYear - i - 1),
				result: resultYear ? `${resultYear}%` : "",
			});
		}

		for (let i = 0; i < students.length; i++) {
			copiedStudents[i].yearResult = [...results];
		}

		dispatch(updateStudents(copiedStudents));
		setDisplay(false);
		nextStep();
	};

	let secondInputIsFilled = false;

	// Gérer la taux de réussite en pourcentage
	//! ATTENTION
	// En cas de modification de l'html/Dom cette fonction ne sera plus fonctionnelle
	const changeHandler = (e) => {
		const getResultDom = e.target.parentNode.parentNode.parentNode.nextSibling;
		if (getResultDom.classList.contains("result")) {
			secondInputIsFilled = true;
			const firstInput = e.target.parentNode.parentNode.parentNode.previousSibling.firstChild.firstChild.firstChild.value;
			if (firstInput !== "") {
				const secondInput = e.target.value;
				getResultDom.textContent = `${calcPercentage(secondInput, firstInput)}%`;
			}
		}

		// if the event target is the first input, works only after the second input is triggered/filled
		const firstInputContainer = e.target.parentNode.parentNode;
		if (firstInputContainer.classList.contains("firstInput") && secondInputIsFilled === true) {
			const firstInput = e.target.value;
			const secondInput = e.target.parentNode.parentNode.parentNode.nextSibling.firstChild.firstChild.firstChild.value;
			const resultDomDependingOnFirstInput = e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling;
			resultDomDependingOnFirstInput.textContent = `${calcPercentage(secondInput, firstInput)}%`;
		}
	};

	return (
		display && (
			<Box component="section" id="YearResult">
				<Box className="titles">
					<Typography variant="h4" className="title">
						Renseignez les résultats des dernières années (facultatif)
					</Typography>
					<Typography variant="h5" className="title">
						Formation : {trainingTitle}
					</Typography>
				</Box>
				<form onSubmit={submitHandler} className="form-student-validation">
					<Box className="btn-container">
						<Button type="submit" className="secondary-btn">
							Suivant
						</Button>
					</Box>

					<TableContainer component={Paper}>
						<Table size="small" aria-label="a dense table">
							<TableHead>
								<TableRow>
									<TableCell>Années</TableCell>
									<TableCell>Présentés</TableCell>
									<TableCell>Reçus</TableCell>
									<TableCell>Taux de réussite</TableCell>
									{/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
								</TableRow>
							</TableHead>
							<TableBody>
								{/* Transformer le nombre d'année en tableau */}
								{[...Array(years)].map((e, i) => (
									<TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} onChange={(e) => changeHandler(e)}>
										<TableCell sx={{ display: "none" }}>
											<input type="hidden" name={todayYear - i - 1} />
										</TableCell>
										<TableCell>{todayYear - i - 1}</TableCell>
										<TableCell>
											<TextField className="firstInput" name={"presente" + i} type="number" placeholder="0" variant="filled" />
										</TableCell>
										<TableCell>
											<TextField className="secondInput" name={"recus" + i} type="number" placeholder="0" variant="filled" />
										</TableCell>
										<TableCell className="result">0.00%</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</form>
			</Box>
		)
	);
};
export default YearResult;
