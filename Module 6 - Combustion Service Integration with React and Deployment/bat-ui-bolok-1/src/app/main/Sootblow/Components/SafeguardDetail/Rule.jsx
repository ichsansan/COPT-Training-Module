import { makeStyles, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core';
import {
	Cancel,
	CheckCircle
} from '@material-ui/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import Confirmation from 'app/fuse-layouts/shared-components/Confirmation';
// import { postAddSuggestionAsTest } from 'app/store/actions';

const columns = [
	{ id: 'sequence', label: 'Sequence', minWidth: 100, align: 'center' },
	{ id: 'actualValue', label: 'Actual Value', minWidth: 170, align: 'center' },
	{ id: 'setValue', label: 'Set Value', minWidth: 170, align: 'center' },
	{ id: 'description', label: 'Description', minWidth: 100, align: 'center' },
	{ id: 'status', label: 'Status', minWidth: 100, align: 'center' }

];

const createRuleData = (sequence, minTime, setValue, actualValue, tagDescription, status) => {
	return { sequence, minTime, setValue, actualValue, tagDescription, status };
};

const useStyles = makeStyles(() => ({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: 360,
		border: '1px solid rgba(81, 81, 81, 1)'
	}
}));

const Rule = () => {
	const classes = useStyles();
	// const dispatch = useDispatch()
	const sootblowReducer = useSelector(state => state.sootblowReducer);
	const [showRuleLogic, setShowRuleLogic] = useState(false)
	// const [openConfirmation, setOpenConfirmation] = useState(false)

	const {
		sootblowSafeguardDetailRuleData,
		sootblowSafeguardDetailRuleValue,
		sootblowSafeguardDetailRuleLogic,
		// sootblowSuggestionAsTestData,
		loading,
		// loadingSootblowSuggestionAsTest,
		errorSafeguardDetailRule,
	} = sootblowReducer;

	// const { area } = sootblowSuggestionAsTestData

	const ruleData = sootblowSafeguardDetailRuleData?.map(item => createRuleData(item.sequence, item.minTime, item.setValue, item.actualValue, item.tagDescription, item.status));

	const showRuleLogicHandler = () => {
		setShowRuleLogic(!showRuleLogic)
	}

	const renderStatusIcon = value => {
		if (!value) {
			return (
				<Tooltip title="false" arrow className="text-20">
					<Cancel fontSize="inherit" className="text-red-600" />
				</Tooltip>
			)

		} else {
			return (
				<Tooltip title="true" arrow className="text-20">
					<CheckCircle fontSize="inherit" className="text-green-600" />
				</Tooltip>
			)
		}
	};

	// const closeAddSuggestionConfirmation = () => {
	// 	// setOpenConfirmation(false)
	// }

	// const confirmAddSuggestion = async () => {
	// 	// await dispatch(postAddSuggestionAsTest())
	// 	await closeAddSuggestionConfirmation()
	// }

	return (
		<>
			<div className={classes.root}>
				{loading ? (
					<div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
						<Typography className="text-12 xl:text-16">Loading</Typography>
					</div>
				) :
					errorSafeguardDetailRule ? (
						<div className="flex-1 flex  min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
							<Typography className="text-center text-12 xl:text-16 text-red-600">
								Sorry something went wrong, try again later!
							</Typography>
						</div>)
						: ruleData?.length === 0 ? (
							<div className="flex-1 flex  min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
								<Typography className="text-center text-12 xl:text-16">No Rule Data Found</Typography>
							</div>
						) : (
							<div className='flex flex-col py-12 gap-20'>
								<div className="flex flex-col">
									<section className="flex items-center justify-between">
										<div className="flex items-center gap-x-12">
											<Typography className="text-14">Rule Logic</Typography>
											<Switch size="small" onClick={showRuleLogicHandler} />
										</div>
										{/* <Button onClick={(e) => setOpenConfirmation(true)} color='inherit' className='bg-red-600 hover:bg-red-700' size='small' variant='contained'>Add to Suggestion as Test</Button> */}
									</section>
									{showRuleLogic &&
										<pre className='mt-12 '>
											<code style={{ color: !sootblowSafeguardDetailRuleValue ? '#4CAF50' : '#F44336' }} className={`whitespace-pre-line `}>
												{sootblowSafeguardDetailRuleLogic}
											</code>
										</pre>
									}
								</div>
								<>
									<Typography className="text-14">Rule Detail</Typography>
									<TableContainer component={Paper} className={classes.container}>
										<Table stickyHeader aria-label="sticky table">
											<TableHead>
												<TableRow>
													{columns?.map(column => (
														<TableCell
															key={column.id}
															align={column.align}
															className="text-11 xl:text-16 py-auto text-light-blue-300"
														>
															{column.label}
														</TableCell>
													))}
												</TableRow>
											</TableHead>
											<TableBody>
												{ruleData?.map((row) => (
													<TableRow key={row.sequence}>
														<TableCell
															component="th"
															scope="row"
															align="center"
															className={`text-10 xl:text-14 py-4`}
														>
															{row.sequence ?? '-'}
														</TableCell>
														<TableCell align="center" className="text-10 xl:text-14 py-4">
															{row.actualValue ?? '-'}
														</TableCell>
														<TableCell align="center" className="text-10 xl:text-14 py-4">
															{row.setValue ?? '-'}
														</TableCell>
														<TableCell align="center" className="text-10 xl:text-14 py-4">
															{row.tagDescription || '-'}
														</TableCell>
														<TableCell align="center" className="text-10 xl:text-14 py-4">
															{renderStatusIcon(!row.status)}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</>

							</div>
						)}
			</div>
			{/* <Confirmation loading={loadingSootblowSuggestionAsTest} open={openConfirmation} title={`Confirm to add suggestion as test?`} contentText={`Make sure and to confirm this suggestion on area ${area} with trigger "Test" added`} cancelHandler={closeAddSuggestionConfirmation} confirmHandler={confirmAddSuggestion} loadingText={'Processing'} /> */}
		</>
	);
};

export default Rule;
