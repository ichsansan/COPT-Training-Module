const homeEfficiencySchema = [
  {
    id: 0,
    name: 'Time',
    type: 'date',
    format: '%-d/%-m/%y %H:%M',
    color: '#000',
  },
  {
    id: 1,
    name: 'Boiler Efficiency',
    type: 'number',
    color: '#00ff37',
    value: 'Boiler Efficiency',
  },
  {
    id: 2,
    name: 'Sootblow Running',
    type: 'number',
    color: '#fff000',
    value: 'Sootblow Running',
  },
  {
    id: 3,
    name: 'Combustion Running',
    type: 'number',
    color: '#2196F3',
    value: 'Combustion Running',
  },
  {
    id: 4,
    name: 'Efficiency Baseline',
    type: 'number',
    color: '#ff0000',
    value: 'Boiler Efficiency',
  },
];

export default homeEfficiencySchema;
