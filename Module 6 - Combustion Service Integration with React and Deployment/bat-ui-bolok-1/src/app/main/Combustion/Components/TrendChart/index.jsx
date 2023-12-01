import FusionCharts from 'fusioncharts';
import TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import React from 'react';
import ReactFC from 'react-fusioncharts';

ReactFC.fcRoot(FusionCharts, TimeSeries, FusionTheme);
FusionCharts.options.license({
	key:
		'lB-21D8ramD4A2I3I2B4D2C7E6D5F3H2I2crtE2D6D-11A-9qmzA7C8qgpC4D1I4D1B3D3E2E6C1G1B4F4B3B6C1E3gzzC1G4B1zB1E4B1oreA33A8B14cetB4A4H4gyB-33A7A3A3D6C1C4C1C3C5A2B2B-13vvF1B3EC2fbqE6D4G4i1sB8TD6B5iizH3H3B5D9A6D5B5B1F4D3H2C9C5C1f1==',
	creditLabel: false
});

export default class TrendChart extends React.Component {
	constructor(props) {
		super(props);
		this.onFetchData = this.onFetchData.bind(this);
		this.state = {
			timeseriesDs: {
				type: 'timeseries',
				renderAt: 'container',
				width: '100%',
				dataFetch: false,
				height: '100%',
				schemaFetch: [
					{
						id: 0,
						name: 'Time',
						type: 'date',
						format: '%d/%m/%Y %H:%M'
					},
					{
						id: 1,
						name: 'O2 Concentrate Left',
						type: 'number'
					},
					{
						id: 2,
						name: 'O2 Concentrate Right',
						type: 'number'
					},
					{
						id: 3,
						name: 'Opening Damper SA-1A',
						type: 'number'
					},
					{
						id: 4,
						name: 'Opening Damper SA-1B',
						type: 'number'
					}
				],
				dataSource: {
					caption: {
						text: 'Boiler Efficiency vs CombOpt'
					},
					chart: {
						chartLeftMargin: '0',
						chartTopMargin: '0',
						chartRightMargin: '0',
						chartBottomMargin: '0',
						bgColor: '#000',
						bgAlpha: '0',
						showLegend: 1,
						showtooltip: 1,
						multiCanvas: false,
						paletteColors: '#2196F3, #00ff37,#ff0000,#fff000',
						style: {
							text: {
								fill: '#fff'
							},

							canvas: {
								'fill-opacity': 0
							},
							background: {
								'fill-opacity': 0
							}
						}
					},
					yAxis: [
						{
							id: 1,
							plot: [
								{
									value: 'O2 Concentrate Left',
									connectNullData: true,
								}
							],
							title: '',
							orientation: 'left',
							plottype: 'smooth-line',
							min: '0.0',
							max: '21.0',
							format: {
								"suffix": "%",
							}
						},
						{
							id: 2,
							plot: [
								{
									value: 'O2 Concentrate Right',
									connectNullData: true,
								}
							],
							title: '',
							orientation: 'left',
							plottype: 'smooth-line',
							min: '0.0',
							max: '21.0',
							format: {
								"suffix": "%",
							}
						},
						{
							id: 3,
							plot: [
								{
									value: 'Opening Damper SA-1A',
									connectNullData: true,
								}
							],
							title: '',
							orientation: 'right',
							plottype: 'smooth-line',
							min: '0',
							max: '100',
							format: {
								"suffix": "%",
							}
						},
						{
							id: 4,
							plot: [
								{
									value: 'Opening Damper SA-1B',
									connectNullData: true,
								}
							],
							title: '',
							orientation: 'right',
							plottype: 'smooth-line',
							min: '0',
							max: '100',
							format: {
								"suffix": "%",
							}
						}
					],

					legend: {
						alignment: 'middle'
					},

					navigator: {
						enabled: 1
					},
					extensions: {
						customRangeSelector: {
							enabled: '0'
						}
					}
				}
			}
		};
	}

	async componentDidMount() {
		const { data } = this.props;
		if (data && data.length > 0) {
			this.setState({
				timeseriesDs: {
					...this.state.timeseriesDs,
					dataFetch: await data
				}
			});
			await this.onFetchData();
		}
	}

	async onFetchData() {
		const {
			timeseriesDs: { dataFetch, schemaFetch }
		} = this.state;

		Promise.all([dataFetch, schemaFetch]).then(res => {
			const data = res[0];
			const schema = res[1];
			const fusionTable = new FusionCharts.DataStore().createDataTable(data, schema);
			const timeseriesDs = { ...this.state.timeseriesDs };
			timeseriesDs.dataSource.data = fusionTable;

			this.setState({
				timeseriesDs
			});
		});
	}

	render() {
		return (
			<>
				{this.props.loading ? (
					<div className="w-full text-11 xl:text-16 text-center">Loading Chart</div>
				) : this.props.data.length === 0 ? (
					<div className="w-full text-11 xl:text-16 text-center">No chart available right now</div>
				) : (
					<ReactFC {...this.state.timeseriesDs} />
				)}
			</>
		);
	}
}
