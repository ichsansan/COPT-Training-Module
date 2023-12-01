import { Grid, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { Home } from '@material-ui/icons';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import { selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FullScreenToggle from '../../shared-components/FullScreenToggle';

const useStyles = makeStyles(theme => ({
	root: {}
}));

function ToolbarLayout2(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const classes = useStyles(props);

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx(classes.root, 'flex relative z-10')}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
				elevation={2}
			>
				<Toolbar className="container p-0 lg:px-24 min-h-48 md:min-h-64">
					{config.navbar.display && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
						</Hidden>
					)}

					<Grid container alignItems="center" justify="space-between">
						<Grid item xs={4}>
							<Link to="/home">
								<IconButton className="w-40 h-40">
									<Home color="action" />
								</IconButton>
							</Link>
						</Grid>
						<Grid item>
							<FullScreenToggle />
						</Grid>

						{/* <Grid item>
							<UserMenu />
						</Grid> */}
					</Grid>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout2);
