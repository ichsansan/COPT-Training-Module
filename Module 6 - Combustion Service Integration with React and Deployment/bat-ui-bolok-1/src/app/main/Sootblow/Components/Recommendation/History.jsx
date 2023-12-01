import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@material-ui/core';
import TablePaginationAction from 'app/fuse-layouts/shared-components/TablePaginationAction';
import { changeSootblow, getRecommendationHistory } from 'app/store/actions';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const columns = [
	{ id: 'suggestionTime', label: 'Suggestion Time', minWidth: 170, align: 'center' },
	{ id: 'sootblowTime', label: 'Sootblow Time', minWidth: 170, align: 'center' },
	{ id: 'trigger', label: 'Trigger', minWidth: 100, align: 'center' }
];

const createData = (date, sootDate, trigger) => {
	return { date, sootDate, trigger };
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

const History = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const sootblowReducer = useSelector(state => state.sootblowReducer);

	const {
		sootblowRecommendationHistoryPage,
		sootblowRecommendationHistoryLimit,
		sootblowRecommendationHistoryTotal,
		sootblowRecommendationHistoryData,
		errorRecommendationHistory,
		sootblowRecommendationHistoryLoading
	} = sootblowReducer;

	useEffect(() => {
		const getHistoryList = () => {
			dispatch(getRecommendationHistory());
		};

		return getHistoryList();
	}, [dispatch]);

	const handleChangePage = async (event, newPage) => {
		await dispatch(
			changeSootblow({
				sootblowRecommendationHistoryPage: newPage
			})
		);
		await dispatch(getRecommendationHistory());
	};

	const handleChangeRowsPerPage = async event => {
		await dispatch(
			changeSootblow({
				sootblowRecommendationHistoryPage: 0,
				sootblowRecommendationHistoryLimit: event.target.value
			})
		);
		await dispatch(getRecommendationHistory());
	};

	const historyData = sootblowRecommendationHistoryData?.map(item => createData(item.date, item.sootDate, item.trigger));

	return (
		<div className={classes.root}>
			{sootblowRecommendationHistoryLoading ? (
				<div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
					<Typography className="text-12 xl:text-16">Loading</Typography>
				</div>
			) : errorRecommendationHistory ? (
				<div className="flex-1 flex  min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
					<Typography className="text-center text-12 xl:text-16 text-red-600">
						Sorry something went wrong, try again later!
					</Typography>
				</div>
			) : historyData?.length === 0 ? (
				<div className="flex-1 flex  min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
					<Typography className="text-center text-12 xl:text-16">No History Found</Typography>
				</div>
			) : (
				<>
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
								{historyData?.map((row, index) => (
									<TableRow key={index}>
										<TableCell
											component="th"
											scope="row"
											align="center"
											className={`text-10 xl:text-14 py-4`}
										>
											{row.date || '-'}
										</TableCell>
										<TableCell align="center" className="text-10 xl:text-14 py-4">
											{row.sootDate || '-'}
										</TableCell>
										<TableCell align="center" className="text-10 xl:text-14 py-4">
											{row.trigger || '-'}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 25, 50, 100]}
						component="div"
						count={sootblowRecommendationHistoryTotal}
						rowsPerPage={sootblowRecommendationHistoryLimit}
						page={sootblowRecommendationHistoryPage}
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
						ActionsComponent={TablePaginationAction}
					/>
				</>
			)}
		</div>
	);
};

export default History;
