import React from 'react';
import PropTypes from 'prop-types';

const FireLeftGIF = ({ size }) => {
  if (size === 'small') {
    return (
      <g id="shape172-397" transform={`translate(${181.417 + 50} -34.016)`}>
        <path className="st9" d="M0 134.438h175.748V398.06H0z" />
        <image
          y={134.438 + 90}
          width={175.748 - 90}
          height={263.622 - 90}
          preserveAspectRatio="none"
          xlinkHref="assets/images/gifs/fire.gif"
        />
        <path className="st9" d="M0 134.438h175.748V398.06H0z" />
      </g>
    );
  }
  if (size === 'medium') {
    return (
      <g id="shape172-397" transform={`translate(${181.417 + 20} -34.016)`}>
        <path className="st9" d="M0 134.438h175.748V398.06H0z" />
        <image
          y={134.438 + 40}
          width={175.748 - 40}
          height={263.622 - 40}
          preserveAspectRatio="none"
          xlinkHref="assets/images/gifs/fire.gif"
        />
        <path className="st9" d="M0 134.438h175.748V398.06H0z" />
      </g>
    );
  }
  if (size === 'large') {
    return (
      <g id="shape172-397" transform="translate(181.417 -34.016)">
        <path className="st9" d="M0 134.438h175.748V398.06H0z" />
        <image
          y={134.438}
          width={175.748}
          height={263.622}
          preserveAspectRatio="none"
          xlinkHref="assets/images/gifs/fire.gif"
        />
        <path className="st9" d="M0 134.438h175.748V398.06H0z" />
      </g>
    );
  }
  return (
    <g id="shape172-397" transform="translate(181.417 -34.016)">
      <path className="st9" d="M0 134.438h175.748V398.06H0z" />
      <image
        y={134.438}
        width={175.748}
        height={263.622}
        preserveAspectRatio="none"
        xlinkHref="assets/images/gifs/fire.gif"
      />
      <path className="st9" d="M0 134.438h175.748V398.06H0z" />
    </g>
  );
};

export default FireLeftGIF;

FireLeftGIF.propTypes = {
  size: PropTypes.string.isRequired,
};

FireLeftGIF.defaultProps = {
  size: 'large',
};
