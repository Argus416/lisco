import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, NativeSelect, Typography, FormControl, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { updateStudents } from "../features/students";
import { useState } from "react";
import { calcPercentage } from "../Helpers/helpers";

function createData(id, fullName, studentCode) {
	return { id, fullName, studentCode };
}

const StudentsValidation = ({ nextStep }) => {
	const dispatch = useDispatch();
	const students = useSelector((state) => state.students.value);
	const trainingTitle = students[0]["2e ANNEE"][0].NOM_FORMATION;
	const [display, setDisplay] = useState(true);
	// Cloner les élèves qui sont dans le reducers pour que l'objet soit modifiable
	let copiedStudents = JSON.parse(JSON.stringify(students));
	const rows = [];
	let rowsId = 0;

	// Créer les lignes de tableau
	students.forEach((year) => {
		rowsId++;
		//  prenom, code_appreant
		const fullName = year["2e ANNEE"][0].NOM_APPRENANT + " " + year["2e ANNEE"][0].PRENOM_APPRENANT;
		const studentCode = year["2e ANNEE"][0].CODE_APPRENANT;

		rows.push(createData(rowsId, fullName, studentCode));
	});

	const submitHandler = (e) => {
		e.preventDefault();

		if (copiedStudents.length) {
			const juryGlobalDecision = {
				dfsp: { value: 0, percentage: 0, title: "Doit faire ses preuves" },
				f: { value: 0, percentage: 0, title: "Favorable" },
				tf: { value: 0, percentage: 0, title: "Très favorable" },
				total: 0,
			};

			// 1- Incrimenter les valeurs de l'objet juryGlobalDecision
			// 2- Coller le résultat dans chaque élève
			// 3- Dispatcher le réultat (students + juryGlobalDecision) dans le reducer en utilisant la méthode dispatch(updateStudents(copiedStudents));

			for (let i = 0; i < students.length; i++) {
				const juryDecision = { title: "", note: 0 };
				switch (e.target[i + 1].value) {
					case "1":
						juryGlobalDecision.f.value++;
						juryGlobalDecision.total++;
						juryDecision.title = "Doit faire ses preuves";
						break;

					case "2":
						juryGlobalDecision.tf.value++;
						juryGlobalDecision.total++;
						juryDecision.title = "Favorable";
						break;

					case "3":
						juryGlobalDecision.dfsp.value++;
						juryGlobalDecision.total++;
						juryDecision.title = "Trés favorable";
						break;
				}
				juryDecision.note = e.target[i + 1].value;
				copiedStudents[i].juryDecision = juryDecision;
			}

			juryGlobalDecision.tf.percentage = calcPercentage(juryGlobalDecision.tf.value, juryGlobalDecision.total) + "%";
			juryGlobalDecision.f.percentage = calcPercentage(juryGlobalDecision.f.value, juryGlobalDecision.total) + "%";
			juryGlobalDecision.dfsp.percentage = calcPercentage(juryGlobalDecision.dfsp.value, juryGlobalDecision.total) + "%";

			for (let i = 0; i < students.length; i++) {
				copiedStudents[i].juryGlobalDecision = juryGlobalDecision;
			}
		}

		dispatch(updateStudents(copiedStudents));
		setDisplay(false);
		nextStep();
	};

	const changeHandler = (e) => {
		// Background color select manager
		switch (e.target.value) {
			case "1":
				console.log(e.target.value);
				e.target.classList.add("fail");
				e.target.classList.remove("mid");
				e.target.classList.remove("ok");
				e.target.classList.remove("error");

				break;

			case "2":
				console.log(e.target.value);
				e.target.classList.remove("fail");
				e.target.classList.add("mid");
				e.target.classList.remove("ok");
				e.target.classList.remove("error");

				break;

			case "3":
				console.log(e.target.value);
				e.target.classList.remove("fail");
				e.target.classList.remove("mid");
				e.target.classList.add("ok");
				e.target.classList.remove("error");
				break;

			default:
				console.log(e.target.value);
				e.target.classList.remove("fail");
				e.target.classList.remove("mid");
				e.target.classList.remove("ok");
				e.target.classList.add("error");
				break;
		}
	};

	return (
		display && (
			<Box component="section" id="StudentsValidation">
				<Box className="titles">
					<Typography variant="h4">Renseignez les avis du conseil de classe (facultatif)</Typography>

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
									<TableCell></TableCell>
									<TableCell>Nom complet</TableCell>
									<TableCell>Code Apprenant</TableCell>
									<TableCell>Avis</TableCell>
									{/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row, index) => (
									<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell>{row.id}</TableCell>
										<TableCell>{row.fullName}</TableCell>
										<TableCell>{row.studentCode}</TableCell>
										<TableCell>
											<FormControl fullWidth>
												<NativeSelect
													// defaultValue={String(parseInt(Math.random * 4))}
													defaultValue="0"
													inputProps={{
														name: "avis",
														id: "uncontrolled-native",
													}}
													onChange={changeHandler}
													name={String(index)}
													// required
												>
													<option value="0">Choisir un avis</option>
													<option value="1">Doit faire ses preuves</option>
													<option value="2">Favorable</option>
													<option value="3">Très favorable</option>
												</NativeSelect>
											</FormControl>
										</TableCell>
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
export default StudentsValidation;
