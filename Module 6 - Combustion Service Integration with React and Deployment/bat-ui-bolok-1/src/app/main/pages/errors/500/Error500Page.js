import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function Error500Page() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center p-16">
			<div className="max-w-512 text-center">
				<FuseAnimate animation="transition.expandIn" delay={100}>
					<Typography variant="h1" color="inherit" className="font-medium mb-16">
						500
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={500}>
					<Typography variant="h5" color="textSecondary" className="mb-16">
						Oops something went wrong with the server
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={600}>
					<Typography variant="subtitle1" color="textSecondary" className="mb-48">
						Looks like we have an internal issue, please try again later
					</Typography>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default Error500Page;
