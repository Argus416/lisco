import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";

function createData(avis, nombre, pourcentage) {
	return { avis, nombre, pourcentage };
}

const JuryGlobalDecision = () => {
	const students = useSelector((state) => state.students.value);

	const { juryGlobalDecision } = students[0];

	// const rows = [createData("Frozen yoghurt", 159, 6.0), createData("Ice cream sandwich", 237, 9.0), createData("Eclair", 262, 16.0)];
	const descisionTitles = Object.keys(juryGlobalDecision);

	const rows = descisionTitles.map((decisionTitle) => {
		return createData(juryGlobalDecision[decisionTitle].title, juryGlobalDecision[decisionTitle].value, juryGlobalDecision[decisionTitle].percentage);
	});
	rows.pop();

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Avis</TableCell>
						<TableCell align="right">Nombre</TableCell>
						<TableCell align="right">%</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.avis} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							<TableCell component="th" scope="row">
								{row.avis}
							</TableCell>
							<TableCell align="right">{row.nombre}</TableCell>
							<TableCell align="right">{row.pourcentage}</TableCell>
						</TableRow>
					))}

					<TableRow key="4" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
						<TableCell component="th" scope="row">
							Total
						</TableCell>
						<TableCell align="right">{juryGlobalDecision.total}</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default JuryGlobalDecision;
