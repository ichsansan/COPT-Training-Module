import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

const InputNumberCustom = forwardRef(function InputNumberCustom(props, ref) {
	const { onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={ref}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value
					}
				});
			}}
			// isNumericString
		/>
	);
});

InputNumberCustom.propTypes = {
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

export default InputNumberCustom;
