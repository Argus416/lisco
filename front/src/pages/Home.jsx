import { Box, Typography, Container } from "@mui/material";
import Navbar from "../components/partiel/Navbar";
import UploadContainer from "../components/UploadContainer";
import StudentsValidation from "../components/StudentsValidation";
import YearResult from "../components/YearResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import "../style/style.scss";
import { useState } from "react";
import ResultStudent from "../components/ResultStudent";

const Home = () => {
	const students = useSelector((state) => state.students.value);
	const [stepState, setStepState] = useState(1);
	console.log(stepState);

	const progressionHandler = (step) => {
		const allSteps = document.querySelectorAll(".ProgressionMenuStep");
		allSteps[step - 1].querySelector(".cpm").classList.remove("active");
		allSteps[step - 1].querySelector(".cpm").classList.add("passed");
		allSteps[step].querySelector(".cpm").classList.add("active");
		setStepState(step);
	};

	return (
		<>
			{stepState && (
				<Box component="main" className="Home">
					<Navbar />
					<Container>
						<Typography className="title" component="h1" variant="h3">
							Créez vos livrets scolaires en 4 étapes
						</Typography>

						{/* Indicateurs de progression */}
						<Box className="ProgressionMenu">
							<Box className="ProgressionMenuStep pmStep1">
								<Typography component="span" className="cercle-progression-menu cpm active">
									1
								</Typography>
								<FontAwesomeIcon className="arrowIcon" icon={faArrowRightLong} size="3x" />
							</Box>
							<Box className="ProgressionMenuStep pmStep2">
								<Typography component="span" className="cercle-progression-menu cpm">
									2
								</Typography>
								<FontAwesomeIcon className="arrowIcon" icon={faArrowRightLong} size="3x" />
							</Box>

							<Box className="ProgressionMenuStep pmStep3">
								<Typography component="span" className="cercle-progression-menu cpm">
									3
								</Typography>
								<FontAwesomeIcon className="arrowIcon" icon={faArrowRightLong} size="3x" />
							</Box>

							<Box className="ProgressionMenuStep pmStep4">
								<Typography component="span" className="cercle-progression-menu cpm">
									4
								</Typography>
							</Box>
						</Box>

						{/* Les conditions d'affichage des composants*/}
						{/* On passe en props la function progressionHandler pour gérer l'affichage des composants  */}

						<UploadContainer nextStep={() => progressionHandler(1)} />
						{students && <StudentsValidation nextStep={() => progressionHandler(2)} />}
						{stepState === 2 && <YearResult nextStep={() => progressionHandler(3)} />}
						{stepState === 3 && <ResultStudent nextStep={() => progressionHandler(4)} />}
					</Container>
				</Box>
			)}
		</>
	);
};

export default Home;
