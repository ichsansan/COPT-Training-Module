import FireLeftGIF from 'app/fuse-layouts/shared-components/FireLeftGIF';
import FireRightGIF from 'app/fuse-layouts/shared-components/FireRightGIF';
import React from 'react';
import { useSelector } from 'react-redux';

const SootblowSchema = (props) => {
  const { sootblowData, sootblowCurrentProcessData } = useSelector(
    (state) => state.sootblowReducer
  );

  const {
    lastProcess,
    aphOutletTemp,
    mainSteamTemp,
    activePower,
  } = sootblowCurrentProcessData;

  const indicator01 =
    (sootblowData && sootblowData.indicator && sootblowData.indicator.SB1) ||
    '#00B050';
  const indicator02 =
    (sootblowData && sootblowData.indicator && sootblowData.indicator.SB2) ||
    '#00B050';
  const indicator03 =
    (sootblowData && sootblowData.indicator && sootblowData.indicator.SB3) ||
    '#00B050';
  const indicator04 =
    (sootblowData && sootblowData.indicator && sootblowData.indicator.SB4) ||
    '#00B050';
  const indicator05 =
    (sootblowData && sootblowData.indicator && sootblowData.indicator.SB5) ||
    '#00B050';
  const indicator06 =
    (sootblowData && sootblowData.indicator && sootblowData.indicator.SB6) ||
    '#00B050';
  const indicatorLastProcess = lastProcess;
  const indicatorActivePower = activePower;
  const indicatorMainSteamTemp = mainSteamTemp;
  const indicatorAPHGasOutletTemp = aphOutletTemp;
  const indicatorSbAvailability = sootblowData?.sbPercentage;

  const blinkIndicator = (indicator = '') => {
    return indicator === '#FF0000' ? (
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        begin="0.1"
      />
    ) : null;
  };

  const SOOTBLOW_ON = +indicatorActivePower >= 2;

  const handleConvertFireSize = (newActivePower = 0) => {
    if (newActivePower > 0 && newActivePower < 50) {
      return 'small';
    }
    if (newActivePower > 50 && newActivePower < 100) {
      return 'medium';
    }
    return 'large';
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={944.446}
      height={530.747}
      viewBox="0 0 708.334 398.06"
      xmlSpace="preserve"
      colorInterpolationFilters="sRGB"
      style={{
        fill: 'none',
        fillRule: 'evenodd',
        fontSize: 12,
        overflow: 'visible',
        strokeLinecap: 'square',
        strokeMiterlimit: 3,
      }}
      {...props}
    >
      <style>
        {
          '.st1,.st2,.st3,.st4,.st5,.st6{fill:#1e2125;stroke:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:.75}.st2,.st3,.st4,.st5,.st6{fill:url(#grad0-6)}.st3,.st4,.st5,.st6{fill:#fff;stroke:#000}.st4,.st5,.st6{fill:url(#grad0-17);stroke:none;stroke-width:.24}.st5,.st6{fill:url(#grad0-21)}.st6{fill:url(#grad0-25)}.st7{fill:none}.st8{stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:.75}.st9{fill:none;stroke:none}.st11,.st12,.st9{stroke-linecap:round;stroke-linejoin:round;stroke-width:.75}.st11{fill:url(#grad0-70);stroke:none}.st12{stroke:#fff}.st13,.st15{fill:#000;font-family:Arial;font-size:.833336em}.st15{fill:#fff;font-size:.583328em}.st16,.st17{stroke-linecap:round;stroke-linejoin:round}.st16{fill:#1e2125;stroke:none;stroke-width:.24}.st17{marker-end:url(#mrkr2-253);stroke:#fff;stroke-width:.75}.st19{fill:#000;font-family:Arial;font-size:.499992em;font-weight:700}.st20{fill:#92d050;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:1}.st23{fill:#fff;font-family:Arial;font-size:.666664em}.st24{fill:#00b0f0;font-size:1em}'
        }
      </style>
      <defs id="Patterns_And_Gradients">
        <linearGradient
          id="grad0-6"
          x1={0}
          y1={0}
          x2={1}
          y2={0}
          gradientTransform="rotate(90 .5 .5)"
        >
          <stop offset={0} stopColor="#f7a409" />
          <stop offset={1} stopColor="#fc3" />
        </linearGradient>
        <linearGradient
          id="grad0-17"
          x1={0}
          y1={0}
          x2={1}
          y2={0}
          gradientTransform="rotate(-90 .5 .5)"
        >
          <stop offset={0} stopColor="red" />
          <stop offset={1} stopColor="#f59d56" />
        </linearGradient>
        <linearGradient id="grad0-21" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#ffc000" />
          <stop offset={0.48} stopColor="#f60" />
          <stop offset={1} stopColor="red" />
        </linearGradient>
        <linearGradient
          id="grad0-25"
          x1={0}
          y1={0}
          x2={1}
          y2={0}
          gradientTransform="rotate(90 .5 .5)"
        >
          <stop offset={0} stopColor="#ffc000" />
          <stop offset={0.71} stopColor="#ffc000" />
          <stop offset={1} stopColor="#fee599" />
        </linearGradient>
        <linearGradient
          id="grad0-70"
          x1={0}
          y1={0}
          x2={1}
          y2={0}
          gradientTransform="rotate(90 .5 .5)"
        >
          <stop offset={0} stopColor="#ffc000" />
          <stop offset={1} stopColor="#ffc000" />
        </linearGradient>
      </defs>
      <defs id="Markers">
        <marker
          id="mrkr2-253"
          refX={-2.92}
          orient="auto"
          markerUnits="strokeWidth"
          overflow="visible"
          style={{
            fill: '#fff',
            fillOpacity: 1,
            stroke: '#fff',
            strokeOpacity: 1,
            strokeWidth: 0.34246576666458,
          }}
        >
          <use xlinkHref="#lend2" transform="scale(-2.92)" />
        </marker>
        <path
          d="M1 1 0 0l1-1v2"
          style={{
            stroke: 'none',
          }}
          id="lend2"
        />
      </defs>

      <g id="shape1-1">
        <path className="st1" d="M0 0h708.334v398.06H0z" />
      </g>

      <g id="shape1-3" transform="matrix(0 -1 -1 0 584.965 108.373)">
        <path className="st2" d="M0 341.491h28.346v56.569H0z" />
      </g>
      <g id="shape2-7" transform="rotate(-90 115.588 -7.36)">
        <path className="st2" d="M0 357.927h28.202v40.133H0z" />
      </g>
      <g id="shape3-10" transform="rotate(180 280.215 294.38)">
        <path
          d="M0 398.06h36.64l-11.05-40.77H11.06L0 398.06Z"
          className="st3"
        />
      </g>
      <g id="shape4-12" transform="matrix(1 0 0 -1 147.484 588.761)">
        <path
          d="M0 398.06h36.64l-11.05-40.77H11.06L0 398.06Z"
          className="st3"
        />
      </g>
      <g id="shape5-14" transform="rotate(180 244.02 347.738)">
        <path
          d="M0 398.06h117.14l-19.03-68.35H19.04L0 398.06Z"
          className="st4"
        />
      </g>
      <g id="shape6-18" transform="rotate(90 344.43 424.527)">
        <path className="st5" d="M0 247.948h217.323V398.06H0z" />
      </g>
      <g id="shape7-22" transform="translate(583.218 -71.42)">
        <path className="st6" d="M0 118.245h102.324V398.06H0z" />
      </g>
      <g id="shape8-26" transform="rotate(90 330.327 438.627)">
        <path d="M0 398.06h189.12H0Z" className="st7" />
        <path d="M0 398.06h189.12" className="st8" />
      </g>
      <g id="shape9-29" transform="rotate(90 344.428 424.526)">
        <path d="M0 398.06h28.2H0Z" className="st7" />
        <path d="M0 398.06h28.2" className="st8" />
      </g>
      <g id="shape10-32" transform="rotate(74.438 251.695 591.89)">
        <path d="M0 398.06h70.95H0Z" className="st7" />
        <path d="M0 398.06h70.95" className="st8" />
      </g>
      <g id="shape11-35" transform="rotate(105.482 282.296 533.357)">
        <path d="M0 398.06h71.31H0Z" className="st7" />
        <path d="M0 398.06h71.31" className="st8" />
      </g>
      <g id="shape12-38" transform="rotate(.268 7087.767 83631.313)">
        <path d="M0 398.06h79.07H0Z" className="st7" />
        <path d="M0 398.06h79.07" className="st8" />
      </g>
      <g id="shape13-41" transform="rotate(180 243.951 239.078)">
        <path d="M0 398.06h117.01H0Z" className="st7" />
        <path d="M0 398.06h117.01" className="st8" />
      </g>
      <g id="shape14-44" transform="rotate(90 307.567 578.533)">
        <path d="M0 398.06h26.45H0Z" className="st7" />
        <path d="M0 398.06h26.45" className="st8" />
      </g>
      <g id="shape15-47" transform="translate(583.218 -71.561)">
        <path d="M0 398.06h85.81H0Z" className="st7" />
        <path d="M0 398.06h85.81" className="st8" />
      </g>
      <g id="shape16-50" transform="translate(640.324 -71.561)">
        <path d="M0 398.06h45.57H0Z" className="st7" />
        <path d="M0 398.06h45.57" className="st8" />
      </g>
      <g id="shape17-53" transform="translate(666.15 -99.763)">
        <path d="M0 398.06h19.39H0Z" className="st7" />
        <path d="M0 398.06h19.39" className="st8" />
      </g>
      <g id="group18-56" transform="translate(332.559 -308.551)">
        <g id="shape19-57" transform="translate(1.962)">
          <path
            d="M0 378.44a19.625 19.625 0 0 1 39.25 0 19.625 19.625 0 0 1-39.25 0Z"
            className="st3"
          />
        </g>
        <g id="shape20-59" transform="translate(0 -10.202)">
          <path className="st9" d="M0 379.221h43.174v18.84H0z" />
          <text
            x={14.64}
            y={391.64}
            style={{
              fill: '#000',
              fontFamily: 'Arial',
              fontSize: '.833336em',
              fontWeight: 700,
            }}
          >
            SD
          </text>
        </g>
      </g>
      <g id="group21-62" transform="translate(523.787 -196.568)">
        <g id="shape22-63">
          <path
            d="M0 385.28a18.321 12.636 0 1 0 36.64 0V284.2H0v101.08Z"
            className="st3"
          />
        </g>
        <g id="shape23-65" transform="translate(0 -101.228)">
          <ellipse
            cx={18.321}
            cy={385.424}
            rx={18.321}
            ry={12.636}
            className="st3"
          />
        </g>
      </g>
      <g id="shape24-67" transform="translate(530.827 -323.032)">
        <path className="st11" d="M0 369.858h22.158v28.202H0z" />
      </g>
      <g id="shape25-71" transform="translate(552.599 -337.133)">
        <path className="st11" d="M0 383.959h32.71v14.101H0z" />
      </g>
      <g id="shape26-74" transform="translate(508.98 -137.934)">
        <path className="st1" d="M0 369.858h32.71v28.202H0z" />
      </g>
      <g id="shape27-76" transform="rotate(90 353.911 585.836)">
        <path d="M0 398.06h28.2H0Z" className="st7" />
        <path d="M0 398.06h28.2" className="st12" />
      </g>
      <g id="shape28-79" transform="rotate(90.098 388.84 496.854)">
        <path d="M0 398.06h167.43H0Z" className="st7" />
        <path d="M0 398.06h167.43" className="st8" />
      </g>
      <g id="shape29-82" transform="translate(488.299 -289.875)">
        <path d="M0 398.06h32.71H0Z" className="st7" />
        <path d="M0 398.06h32.71" className="st8" />
      </g>
      <g id="shape30-85" transform="rotate(.136 134011.222 205501.598)">
        <path d="M0 398.06h33.11H0Z" className="st7" />
        <path d="M0 398.06h33.11" className="st8" />
      </g>
      <g id="group31-88" transform="translate(521.009 -287.163)">
        <g id="shape32-89">
          <path
            d="M0 394.43a21.587 3.586 0 1 0 43.17 0v-28.68H0v28.68Z"
            className="st3"
          />
        </g>
        <g id="shape33-91" transform="translate(0 -28.732)">
          <ellipse
            cx={21.587}
            cy={394.474}
            rx={21.587}
            ry={3.586}
            className="st3"
          />
        </g>
      </g>
      <g id="shape34-93" transform="translate(552.985 -337.131)">
        <path d="M0 398.06h30.23H0Z" className="st7" />
        <path d="M0 398.06h30.23" className="st8" />
      </g>
      <g id="shape35-96" transform="rotate(90 441.03 487.855)">
        <path d="M0 398.06h28.2H0Z" className="st7" />
        <path d="M0 398.06h28.2" className="st8" />
      </g>
      <g id="shape36-99" transform="rotate(90 445.058 505.985)">
        <path d="M0 398.06h14.51H0Z" className="st7" />
        <path d="M0 398.06h14.51" className="st8" />
      </g>
      <g id="shape37-102" transform="rotate(90.004 508.69 555.505)">
        <path d="M0 398.06h251.47H0Z" className="st7" />
        <path d="M0 398.06h251.47" className="st8" />
      </g>
      <g id="shape38-105" transform="translate(530.827 -351.232)">
        <path d="M0 398.06h135.34H0Z" className="st7" />
        <path d="M0 398.06h135.34" className="st8" />
      </g>
      <g id="shape39-108" transform="rotate(90 459.946 521.329)">
        <path d="M0 398.06h265.11H0Z" className="st7" />
        <path d="M0 398.06h265.11" className="st8" />
      </g>
      <g id="shape40-111" transform="rotate(-90 214.225 165.46)">
        <path
          d="M0 394.85a6.77 3.165 180 1 1 13.54 0 6.77 3.165 180 1 1-13.54 0Z"
          className="st3"
        />
      </g>
      <g id="group41-113" transform="translate(440.453 -18.378)">
        <g id="shape42-114">
          <path
            d="M0 397.27a3.165.785 0 0 0 6.329 0l.001-6.28H0v6.28Z"
            className="st3"
          />
        </g>
        <g id="shape43-116" transform="translate(0 -6.28)">
          <ellipse
            cx={3.165}
            cy={397.275}
            rx={3.165}
            ry={0.785}
            className="st3"
          />
        </g>
      </g>
      <g id="shape44-118" transform="rotate(-90 198.366 181.318)">
        <path
          d="M0 394.85a6.77 3.165 180 1 1 13.54 0 6.77 3.165 180 1 1-13.54 0Z"
          className="st3"
        />
      </g>
      <g id="group45-120" transform="translate(408.735 -18.378)">
        <g id="shape46-121">
          <path
            d="M0 397.27a3.165.785 0 0 0 6.329 0l.001-6.28H0v6.28Z"
            className="st3"
          />
        </g>
        <g id="shape47-123" transform="translate(0 -6.28)">
          <ellipse
            cx={3.165}
            cy={397.275}
            rx={3.165}
            ry={0.785}
            className="st3"
          />
        </g>
      </g>
      <g id="shape48-125" transform="rotate(90 409.614 520.685)">
        <path className="st9" d="M0 378.319h79.634v19.741H0z" />
        <text x={15.64} y={391.19} className="st13">
          CYCLONE
        </text>
      </g>
      <g id="shape49-128" transform="translate(20.617 -46.233)">
        <path
          d="M0 392.85a5.215 5.215 0 0 1 10.43 0 5.215 5.215 0 0 1-10.43 0Z"
          style={{
            fill: '#00b050',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 1,
          }}
        />
      </g>
      <g id="shape50-130" transform="translate(33.018 -47.659)">
        <path className="st9" d="M0 391.179h70.425v6.881H0z" />
        <text x={4} y={396.72} className="st15">
          READY/STANDBY
        </text>
      </g>
      <g id="shape55-133" transform="translate(220.01 -317.965)">
        <path d="M0 398.06h117.14H0Z" className="st7" />
        <path d="M0 398.06h117.14" className="st8" />
      </g>
      <g id="shape56-136" transform="matrix(1 0 0 -1 219.873 695.477)">
        <path
          d="M0 398.06h117.14l-19.03-68.35H19.04L0 398.06Z"
          className="st4"
        />
      </g>
      <g id="shape57-139" transform="matrix(0 1 1 0 -61.043 80.097)">
        <path className="st5" d="M0 247.948h217.323V398.06H0z" />
      </g>
      <g id="shape58-142" transform="matrix(-1 0 0 1 124.696 -71.42)">
        <path className="st6" d="M0 118.245h102.324V398.06H0z" />
      </g>
      <g id="shape59-145" transform="matrix(0 1 1 0 -61.04 108.299)">
        <path d="M0 398.06h189.12H0Z" className="st7" />
        <path d="M0 398.06h189.12" className="st8" />
      </g>
      <g id="shape60-148" transform="matrix(0 1 1 0 -61.04 80.097)">
        <path d="M0 398.06h28.2H0Z" className="st7" />
        <path d="M0 398.06h28.2" className="st8" />
      </g>
      <g
        id="shape61-151"
        transform="scale(-1 1) rotate(74.438 -102.262 125.89)"
      >
        <path d="M0 398.06h70.95H0Z" className="st7" />
        <path d="M0 398.06h70.95" className="st8" />
      </g>
      <g id="shape62-154" transform="rotate(74.518 176.09 492.268)">
        <path d="M0 398.06h71.31H0Z" className="st7" />
        <path d="M0 398.06h71.31" className="st8" />
      </g>
      <g
        id="shape63-157"
        transform="scale(-1 1) rotate(.268 6733.81 -67506.533)"
      >
        <path d="M0 398.06h79.07H0Z" className="st7" />
        <path d="M0 398.06h79.07" className="st8" />
      </g>
      <g id="shape64-160" transform="translate(220.012 -317.965)">
        <path d="M0 398.06h117.01H0Z" className="st7" />
        <path d="M0 398.06h117.01" className="st8" />
      </g>
      <g id="shape65-163" transform="matrix(0 1 1 0 -178.185 270.966)">
        <path d="M0 398.06h26.45H0Z" className="st7" />
        <path d="M0 398.06h26.45" className="st8" />
      </g>
      <g id="shape66-166" transform="matrix(-1 0 0 1 124.696 -71.561)">
        <path d="M0 398.06h85.81H0Z" className="st7" />
        <path d="M0 398.06h85.81" className="st8" />
      </g>
      <g id="shape67-169" transform="matrix(-1 0 0 1 67.59 -71.561)">
        <path d="M0 398.06h45.57H0Z" className="st7" />
        <path d="M0 398.06h45.57" className="st8" />
      </g>
      <g id="shape68-172" transform="matrix(-1 0 0 1 41.764 -99.763)">
        <path d="M0 398.06h19.74H0Z" className="st7" />
        <path d="M0 398.06h19.74" className="st8" />
      </g>
      <g id="group69-175" transform="translate(147.485 -196.284)">
        <g id="shape70-176" transform="matrix(-1 0 0 1 36.642 0)">
          <path
            d="M0 385.51a18.321 12.692 0 0 0 36.64 0V283.97H0v101.54Z"
            className="st3"
          />
        </g>
        <g id="shape71-178" transform="matrix(-1 0 0 1 36.642 -101.398)">
          <ellipse
            cx={18.321}
            cy={385.368}
            rx={18.321}
            ry={12.692}
            className="st3"
          />
        </g>
      </g>
      <g id="shape72-180" transform="matrix(-1 0 0 1 177.087 -323.032)">
        <path className="st11" d="M0 369.858h22.158v28.202H0z" />
      </g>
      <g id="shape73-183" transform="matrix(-1 0 0 1 155.315 -337.133)">
        <path className="st11" d="M0 383.959h32.71v14.101H0z" />
      </g>
      <g id="shape74-186" transform="matrix(-1 0 0 1 198.934 -137.934)">
        <path className="st1" d="M0 369.858h32.71v28.202H0z" />
      </g>
      <g id="shape75-188" transform="matrix(0 1 1 0 -231.833 231.924)">
        <path d="M0 398.06h28.2H0Z" className="st7" />
        <path d="M0 398.06h28.2" className="st12" />
      </g>
      <g id="shape76-191" transform="rotate(89.902 254.994 363.118)">
        <path d="M0 398.06h167.43H0Z" className="st7" />
        <path d="M0 398.06h167.43" className="st8" />
      </g>
      <g id="shape77-194" transform="matrix(-1 0 0 1 219.615 -289.875)">
        <path d="M0 398.06h32.71H0Z" className="st7" />
        <path d="M0 398.06h32.71" className="st8" />
      </g>
      <g
        id="shape78-197"
        transform="scale(-1 1) rotate(.304 59746.755 -41862.199)"
      >
        <path d="M0 398.06h36.73H0Z" className="st7" />
        <path d="M0 398.06h36.73" className="st8" />
      </g>
      <g id="group79-200" transform="translate(143.731 -287.163)">
        <g id="shape80-201" transform="matrix(-1 0 0 1 43.174 0)">
          <path
            d="M0 394.43a21.587 3.586 0 1 0 43.17 0v-28.68H0v28.68Z"
            className="st3"
          />
        </g>
        <g id="shape81-203" transform="matrix(-1 0 0 1 43.174 -28.732)">
          <ellipse
            cx={21.587}
            cy={394.474}
            rx={21.587}
            ry={3.586}
            className="st3"
          />
        </g>
      </g>
      <g id="shape82-205" transform="matrix(-1 0 0 1 154.929 -337.131)">
        <path d="M0 398.06h30.23H0Z" className="st7" />
        <path d="M0 398.06h30.23" className="st8" />
      </g>
      <g id="shape83-208" transform="matrix(0 1 1 0 -220.97 46.826)">
        <path d="M0 398.06h28.2H0Z" className="st7" />
        <path d="M0 398.06h28.2" className="st8" />
      </g>
      <g id="shape84-211" transform="matrix(0 1 1 0 -243.129 60.927)">
        <path d="M0 398.06h14.51H0Z" className="st7" />
        <path d="M0 398.06h14.51" className="st8" />
      </g>
      <g id="shape85-214" transform="rotate(89.996 196.504 243.319)">
        <path d="M0 398.06h251.47H0Z" className="st7" />
        <path d="M0 398.06h251.47" className="st8" />
      </g>
      <g id="shape86-217" transform="matrix(-1 0 0 1 177.087 -351.232)">
        <path d="M0 398.06h135.34H0Z" className="st7" />
        <path d="M0 398.06h135.34" className="st8" />
      </g>
      <g id="shape87-220" transform="matrix(0 1 1 0 -273.361 61.382)">
        <path d="M0 398.06h265.11H0Z" className="st7" />
        <path d="M0 398.06h265.11" className="st8" />
      </g>
      <g id="shape88-223" transform="matrix(0 -1 -1 0 659.149 379.684)">
        <path
          d="M0 394.85a6.77 3.165 180 1 1 13.54 0 6.77 3.165 180 1 1-13.54 0Z"
          className="st3"
        />
      </g>
      <g id="group89-225" transform="translate(261.131 -18.378)">
        <g id="shape90-226" transform="matrix(-1 0 0 1 6.33 0)">
          <path
            d="M0 397.27a3.165.785 0 0 0 6.329 0l.001-6.28H0v6.28Z"
            className="st3"
          />
        </g>
        <g id="shape91-228" transform="matrix(-1 0 0 1 6.33 -6.28)">
          <ellipse
            cx={3.165}
            cy={397.275}
            rx={3.165}
            ry={0.785}
            className="st3"
          />
        </g>
      </g>
      <g id="shape92-230" transform="matrix(0 -1 -1 0 690.866 379.684)">
        <path
          d="M0 394.85a6.77 3.165 180 1 1 13.54 0 6.77 3.165 180 1 1-13.54 0Z"
          className="st3"
        />
      </g>
      <g id="group93-232" transform="translate(292.849 -18.378)">
        <g id="shape94-233" transform="matrix(-1 0 0 1 6.33 0)">
          <path
            d="M0 397.27a3.165.785 0 0 0 6.329 0l.001-6.28H0v6.28Z"
            className="st3"
          />
        </g>
        <g id="shape95-235" transform="matrix(-1 0 0 1 6.33 -6.28)">
          <ellipse
            cx={3.165}
            cy={397.275}
            rx={3.165}
            ry={0.785}
            className="st3"
          />
        </g>
      </g>
      <g id="shape96-237" transform="matrix(0 1 1 0 -222.384 111.07)">
        <path className="st9" d="M0 378.319h79.634v19.741H0z" />
        <text x={-63.99} y={391.19} transform="scale(-1 1)" className="st13">
          CYCLONE
        </text>
      </g>
      <g id="shape97-240" transform="translate(186.701 -96.931)">
        <path className="st16" d="M0 205.521h32.71V398.06H0z" />
      </g>
      <g id="shape98-242" transform="matrix(-1 0 0 1 198.934 -137.932)">
        <path d="M0 398.06h32.71H0Z" className="st7" />
        <path d="M0 398.06h32.71" className="st12" />
      </g>
      <g id="shape99-245" transform="matrix(0 1 1 0 -199.123 246.024)">
        <path d="M0 398.06h14.1H0Z" className="st7" />
        <path d="M0 398.06h14.1" className="st12" />
      </g>
      <g id="shape100-248" transform="rotate(45 282.993 562.178)">
        <path d="M0 398.06h25.54" className="st17" />
      </g>
      <g id="shape101-254" transform="translate(488.77 -99.765)">
        <path className="st16" d="M0 208.326h32.71V398.06H0z" />
      </g>
      <g id="shape102-256" transform="translate(508.98 -137.932)">
        <path d="M0 398.06h32.71H0Z" className="st7" />
        <path d="M0 398.06h32.71" className="st12" />
      </g>
      <g id="shape103-259" transform="rotate(90 330.507 576.531)">
        <path d="M0 398.06h14.1H0Z" className="st7" />
        <path d="M0 398.06h14.1" className="st12" />
      </g>
      <g id="shape104-262" transform="rotate(135 285.977 427.455)">
        <path d="M0 398.06h25.54" className="st17" />
      </g>
      <g id="shape105-267" transform="translate(18.12 -100.163)">
        <path className="st16" d="M0 146.31h23.232v251.75H0z" />
      </g>
      <g id="shape106-269" transform="translate(666.522 -100.143)">
        <path className="st16" d="M0 146.154h23.692V398.06H0z" />
      </g>
      <g id="shape107-271" transform="matrix(-1 0 0 1 658.831 -299.454)">
        <path className="st3" d="M0 372.241h68.251v25.819H0z" />
      </g>
      <g id="shape108-273" transform="matrix(-1 0 0 1 655.935 -305.256)">
        <path className="st9" d="M0 383.845h62.362v14.215H0z" />
        <text x={-39.35} y={392.75} transform="scale(-1 1)" className="st19">
          HTSH
        </text>
      </g>
      <g id="shape109-276" transform="matrix(-1 0 0 1 658.419 -254.328)">
        <path className="st3" d="M0 373.682h68.251v24.378H0z" />
      </g>
      <g id="shape110-278" transform="matrix(-1 0 0 1 655.935 -259.806)">
        <path className="st9" d="M0 384.638h62.362v13.422H0z" />
        <text x={-39.01} y={393.15} transform="scale(-1 1)" className="st19">
          LTSH
        </text>
      </g>
      <g id="shape111-281" transform="matrix(-1 0 0 1 657.825 -158.821)">
        <path className="st3" d="M0 374.395h68.251v23.665H0z" />
      </g>
      <g id="shape112-283" transform="matrix(-1 0 0 1 657.825 -164.139)">
        <path className="st9" d="M0 385.031h68.251v13.029H0z" />
        <text x={-58.46} y={393.35} transform="scale(-1 1)" className="st19">
          SECONDARY AH
        </text>
      </g>
      <g id="shape113-286" transform="matrix(-1 0 0 1 626.491 -186.761)">
        <path
          d="M0 393.11a5.102 5.102 0 1 1 10.2 0 5.102 5.102 0 0 1-10.2 0Z"
          fill={indicator03}
          stroke="#000"
        >
          {blinkIndicator(indicator03)}
        </path>
      </g>
      <g id="shape114-288" transform="matrix(-1 0 0 1 634.085 -197.179)">
        <path className="st9" d="M0 392.942h25.349v5.118H0z" />
        <text x={-14.34} y={397.3} transform="scale(-1 1)" className="st19">
          3
        </text>
      </g>
      <g id="shape115-291" transform="matrix(-1 0 0 1 626.491 -139.727)">
        <path
          d="M0 392.8a5.102 5.102 0 0 1 10.2 0 5.102 5.102 0 1 1-10.2 0Z"
          fill={indicator06}
          stroke="#000"
        >
          {blinkIndicator(indicator06)}
        </path>
      </g>
      <g id="shape116-293" transform="matrix(-1 0 0 1 634.406 -150.455)">
        <path className="st9" d="M0 392.942h26.199v5.118H0z" />
        <text x={-14.77} y={397.3} transform="scale(-1 1)" className="st19">
          6
        </text>
      </g>
      <g id="shape117-296" transform="matrix(-1 0 0 1 657.853 -113.381)">
        <path className="st3" d="M0 375.334h68.251v22.727H0z" />
      </g>
      <g id="shape118-298" transform="matrix(-1 0 0 1 653.1 -118.488)">
        <path className="st9" d="M0 385.548h58.961v12.512H0z" />
        <text x={-48.48} y={393.6} transform="scale(-1 1)" className="st19">
          PRIMARY AH
        </text>
      </g>
      <g id="shape119-301" transform="matrix(-1 0 0 1 627.21 -233.192)">
        <path
          d="M0 392.8a5.102 5.102 0 0 1 10.2 0 5.102 5.102 0 1 1-10.2 0Z"
          fill={indicator02}
          stroke="#000"
        >
          {blinkIndicator(indicator02)}
        </path>
      </g>
      <g id="shape120-303" transform="matrix(-1 0 0 1 635.124 -243.92)">
        <path className="st9" d="M0 392.942h26.199v5.118H0z" />
        <text x={-14.77} y={397.3} transform="scale(-1 1)" className="st19">
          2
        </text>
      </g>
      <g id="shape121-306" transform="matrix(-1 0 0 1 658.56 -205.265)">
        <path className="st3" d="M0 373.723h68.251v24.337H0z" />
      </g>
      <g id="shape122-308" transform="matrix(-1 0 0 1 650.813 -210.734)">
        <path className="st9" d="M0 384.661h54.016v13.399H0z" />
        <text x={-47.34} y={393.16} transform="scale(-1 1)" className="st19">
          ECONOMIZER
        </text>
      </g>
      <g id="shape123-311" transform="matrix(-1 0 0 1 117.338 -299.506)">
        <path className="st3" d="M0 372.241h68.251v25.819H0z" />
      </g>
      <g id="shape124-313" transform="matrix(-1 0 0 1 114.442 -305.308)">
        <path className="st9" d="M0 383.845h62.362v14.215H0z" />
        <text x={-39.35} y={392.75} transform="scale(-1 1)" className="st19">
          HTSH
        </text>
      </g>
      <g id="shape125-316" transform="matrix(-1 0 0 1 116.926 -254.379)">
        <path className="st3" d="M0 373.682h68.251v24.378H0z" />
      </g>
      <g id="shape126-318" transform="matrix(-1 0 0 1 114.442 -259.857)">
        <path className="st9" d="M0 384.638h62.362v13.422H0z" />
        <text x={-39.01} y={393.15} transform="scale(-1 1)" className="st19">
          LTSH
        </text>
      </g>
      <g id="shape127-321" transform="matrix(-1 0 0 1 116.332 -158.873)">
        <path className="st3" d="M0 374.395h68.251v23.665H0z" />
      </g>
      <g id="shape128-323" transform="matrix(-1 0 0 1 116.332 -164.191)">
        <path className="st9" d="M0 385.031h68.251v13.029H0z" />
        <text x={-58.46} y={393.35} transform="scale(-1 1)" className="st19">
          SECONDARY AH
        </text>
      </g>
      <g id="shape129-326" transform="matrix(-1 0 0 1 84.998 -186.813)">
        <path
          d="M0 393.11a5.102 5.102 0 1 1 10.2 0 5.102 5.102 0 0 1-10.2 0Z"
          fill={indicator04}
          stroke="#000"
        >
          {blinkIndicator(indicator04)}
        </path>
      </g>
      <g id="shape130-328" transform="matrix(-1 0 0 1 92.591 -197.23)">
        <path className="st9" d="M0 392.942h25.349v5.118H0z" />
        <text x={-14.34} y={397.3} transform="scale(-1 1)" className="st19">
          4
        </text>
      </g>
      <g id="shape131-331" transform="matrix(-1 0 0 1 84.998 -139.778)">
        <path
          d="M0 392.8a5.102 5.102 0 0 1 10.2 0 5.102 5.102 0 1 1-10.2 0Z"
          fill={indicator05}
          stroke="#000"
        >
          {blinkIndicator(indicator05)}
        </path>
      </g>
      <g id="shape132-333" transform="matrix(-1 0 0 1 92.912 -150.507)">
        <path className="st9" d="M0 392.942h26.199v5.118H0z" />
        <text x={-14.77} y={397.3} transform="scale(-1 1)" className="st19">
          5
        </text>
      </g>
      <g id="shape133-336" transform="matrix(-1 0 0 1 116.36 -113.433)">
        <path className="st3" d="M0 375.334h68.251v22.727H0z" />
      </g>
      <g id="shape134-338" transform="matrix(-1 0 0 1 111.607 -118.539)">
        <path className="st9" d="M0 385.548h58.961v12.512H0z" />
        <text x={-48.48} y={393.6} transform="scale(-1 1)" className="st19">
          PRIMARY AH
        </text>
      </g>
      <g id="shape135-341" transform="matrix(-1 0 0 1 85.717 -233.243)">
        <path
          d="M0 392.8a5.102 5.102 0 0 1 10.2 0 5.102 5.102 0 1 1-10.2 0Z"
          fill={indicator01}
          stroke="#000"
        >
          {blinkIndicator(indicator01)}
        </path>
      </g>
      <g id="shape136-343" transform="matrix(-1 0 0 1 93.631 -243.971)">
        <path className="st9" d="M0 392.942h26.199v5.118H0z" />
        <text x={-14.77} y={397.3} transform="scale(-1 1)" className="st19">
          1
        </text>
      </g>
      <g id="shape137-346" transform="matrix(-1 0 0 1 117.066 -205.316)">
        <path className="st3" d="M0 373.723h68.251v24.337H0z" />
      </g>
      <g id="shape138-348" transform="matrix(-1 0 0 1 109.32 -210.785)">
        <path className="st9" d="M0 384.661h54.016v13.399H0z" />
        <text x={-47.34} y={393.16} transform="scale(-1 1)" className="st19">
          ECONOMIZER
        </text>
      </g>
      <g id="shape142-351" transform="translate(20.644 -29.44)">
        <path
          d="M0 392.85a5.215 5.215 0 0 1 10.43 0 5.215 5.215 0 0 1-10.43 0Z"
          style={{
            fill: 'red',
            stroke: '#000',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 1,
          }}
        />
      </g>
      <g id="shape143-353" transform="translate(33.045 -30.866)">
        <path className="st9" d="M0 391.179h86.01v6.881H0z" />
        <text x={4} y={396.72} className="st15">
          SOOTBLOW
        </text>
      </g>
      {/* <g id="shape148-356" transform="translate(107.717 -45.994)">

        <path
          d="M0 392.85a5.215 5.215 0 0 1 10.43 0 5.215 5.215 0 0 1-10.43 0Z"
          style={{
            fill: "#bfbfbf",
            stroke: "#000",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1,
          }}
        />
      </g>
      <g id="shape149-358" transform="translate(120.117 -47.42)">

        <path className="st9" d="M0 391.179h70.425v6.881H0z" />
        <text x={4} y={396.72} className="st15">
          {"BY PASS/DISABLE"}
        </text>
      </g> */}
      <g id="group156-361" transform="translate(37.536 -352.756)">
        <g id="shape157-362">
          <path className="st9" d="M0 378.06h152v20H0z" />
          <text x={4} y={389.26} className="st23">
            ACTIVE POWER
          </text>
        </g>
        <g id="shape158-365" transform="translate(72)">
          <path className="st9" d="M0 378.06h77.219v20H0z" />
          <text x={4} y={389.26} className="st23">
            {': '}
            <tspan className="st24">
              {indicatorActivePower ? `${indicatorActivePower} MW` : '-'}
            </tspan>
          </text>
        </g>
      </g>
      <g id="group159-369" transform="translate(37.536 -369.921)">
        <g id="shape160-370">
          <path className="st9" d="M0 378.06h152v20H0z" />
          <text x={4} y={389.26} className="st23">
            LAST PROCESS
          </text>
        </g>
        <g id="shape161-373" transform="translate(72)">
          <path className="st9" d="M0 378.06h489.318v20H0z" />
          <text x={4} y={389.26} className="st23">
            {': '}
            <tspan className="st24">{indicatorLastProcess || '-'}</tspan>
          </text>
        </g>
      </g>
      <g id="group162-377" transform="translate(480.45 -46)">
        <g id="group163-378">
          <g id="shape164-379">
            <path className="st9" d="M0 378.06h152v20H0z" />
            <text x={4} y={389.26} className="st23">
              APH OUTLET GAS TEMPERATURE
            </text>
          </g>
        </g>
        <g id="group165-382" transform="translate(145)">
          <g id="shape166-383">
            <path className="st9" d="M0 378.06h77.219v20H0z" />
            <text x={4} y={389.26} className="st23">
              {': '}
              <tspan className="st24">
                {indicatorAPHGasOutletTemp
                  ? `${indicatorAPHGasOutletTemp} \xB0C`
                  : '-'}
              </tspan>
            </text>
          </g>
        </g>
      </g>
      <g id="group167-387" transform="translate(480.45 -30)">
        <g id="group168-388">
          <g id="shape169-389">
            <path className="st9" d="M0 378.06h174.376v20H0z" />
            <text x={4} y={389.26} className="st23">
              MAIN STEAM TEMPERATURE
            </text>
          </g>
        </g>
        <g id="group170-392" transform="translate(145)">
          <g id="shape171-393">
            <path className="st9" d="M0 378.06h77.219v20H0z" />
            <text x={4} y={389.26} className="st23">
              {': '}
              <tspan className="st24">
                {indicatorMainSteamTemp
                  ? `${indicatorMainSteamTemp} \xB0C`
                  : '-'}
              </tspan>
            </text>
          </g>
        </g>
      </g>
      <g id="group167-xx" transform="translate(480.45 -14)">
        <g id="group168-xx">
          <g id="shape169-xx">
            <path className="st9" d="M0 378.06h174.376v20H0z" />
            <text x={4} y={389.26} className="st23">
              SOOTBLOW AVAILABILITY
            </text>
          </g>
        </g>
        <g id="group170-xx" transform="translate(145)">
          <g id="shape171-xx">
            <path className="st9" d="M0 378.06h77.219v20H0z" />
            <text x={4} y={389.26} className="st23">
              {': '}
              <tspan className="st24">{indicatorSbAvailability || '-'}</tspan>
            </text>
          </g>
        </g>
      </g>
      {SOOTBLOW_ON && (
        <>
          <FireLeftGIF
            size={handleConvertFireSize(indicatorActivePower || 0)}
          />
          <FireRightGIF
            size={handleConvertFireSize(indicatorActivePower || 0)}
          />
        </>
      )}
    </svg>
  );
};

export default SootblowSchema;
