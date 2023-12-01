import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function Error401Page() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center p-16">
			<div className="max-w-512 text-center">
				<FuseAnimate animation="transition.expandIn" delay={100}>
					<Typography variant="h1" color="inherit" className="font-medium mb-16">
						401
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={500}>
					<Typography variant="h5" color="textSecondary" className="mb-16">
                    User is not registered
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={600}>
					<Typography variant="subtitle1" color="textSecondary" className="mb-48">
                    Sorry you are not allowed to access this site, please ask admin to activate your account.
					</Typography>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default Error401Page;
