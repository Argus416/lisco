import { useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Box, Button, Typography } from "@mui/material";
import DenseTable from "./DenseTable";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	"&:not(:last-child)": {
		borderBottom: 0,
	},
	"&:before": {
		display: "none",
	},
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />)(
	({ theme }) => ({
		backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
		flexDirection: "row-reverse",
		"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
			transform: "rotate(90deg)",
		},
		"& .MuiAccordionSummary-content": {
			marginLeft: theme.spacing(1),
		},
	})
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const AccordionCus = ({ student, index, pdf }) => {
	const [expanded, setExpanded] = useState("panel1");

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	const viewPdf = (pdf) => {
		const pdfPreview = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
		window.open(pdfPreview, "_blank");
	};
	return (
		<Accordion onChange={handleChange(`panel${index}`)}>
			<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
				<Box className="header-element-table">
					<Typography>
						{`
                            ${student["2e ANNEE"][0].PRENOM_APPRENANT} 
                            ${student["2e ANNEE"][0].NOM_APPRENANT} 
                        `}
					</Typography>
					<Box>
						<Button className="downloadPdf" variant="contained" onClick={() => viewPdf(pdf[index])}>
							<FontAwesomeIcon icon={faEye} />
						</Button>
					</Box>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				{student["1ere ANNEE"] && (
					<Box sx={{ marginBottom: 3 }}>
						<Typography variant="h5">1ère année</Typography>
						<DenseTable key={student["1ere ANNEE"] + "a"} student={student["1ere ANNEE"]} />
					</Box>
				)}
				<Typography sx={{ marginBottom: 2 }} variant="h5">
					2e année
				</Typography>
				<DenseTable key={student["2e ANNEE"] + "b"} student={student["2e ANNEE"]} />
			</AccordionDetails>
		</Accordion>
	);
};

export default AccordionCus;
