import * as React from "react";
import { AppBar, Toolbar, Typography, Container, Link } from "@mui/material";

const Navbar = () => {
	return (
		<AppBar className="navbar" position="static">
			<Container component="header">
				<Toolbar disableGutters>
					<Link className="logo" href="/">
						LiSco
						{/* votre temps est précieux, économisez-le ! */}
					</Link>
					<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						LiSco
						{/* votre temps est précieux, économisez-le ! */}
					</Typography>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Navbar;
