import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FusePageSimple from '@fuse/core/FusePageSimple';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';

function ProfilePage() {

	const user = useSelector(({ auth }) => auth.user);

	return (
		<FusePageSimple
			content={
				<div className='py-16 h-full container px-0 mx-24'>
					<div className="md:flex flex-1 flex flex-col w-full h-full">
						<div className="flex flex-col flex-1 h-full">
							<FuseAnimateGroup
								enter={{
									animation: 'transition.slideUpBigIn'
								}}
							>
								<Card className="w-full rounded-8">
									<AppBar position="static" elevation={0}>
										<Toolbar className="px-8">
											<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
												Profile
								</Typography>
										</Toolbar>
									</AppBar>

									<CardContent>
										<div className="mb-24">
											<Typography className="font-bold mb-4 text-15">Name</Typography>
											<Typography>{user && user.data && user.data.displayName}</Typography>
										</div>

										<div className="mb-24">
											<Typography className="font-bold mb-4 text-15">Email</Typography>
											<Typography>{user && user.data && user.data.email}</Typography>
										</div>

										<div className="mb-24">
											<Typography className="font-bold mb-4 text-15">Role</Typography>
											<Typography>{user && user.role[0]}</Typography>
										</div>

										<div className="mb-24">
											<Typography className="font-bold mb-4 text-15">Password</Typography>

										</div>

									</CardContent>
								</Card>

							</FuseAnimateGroup>
						</div>

					</div>
				</div>
			}
		/>
	);
}

export default ProfilePage;