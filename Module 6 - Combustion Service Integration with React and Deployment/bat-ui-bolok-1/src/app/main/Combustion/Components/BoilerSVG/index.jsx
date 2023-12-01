import { getCombustionTagDetailData } from 'app/store/actions/combustion-tag-detail-actions';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Detail from './Detail';
import './style.css';

function SvgComponent(props) {
  const dispatch = useDispatch();
  const combustionReducer = useSelector((state) => state.combustionReducer);
  const { loading } = useSelector((state) => state.combustionTagDetailReducer);
  const { combustionTags } = combustionReducer;

  const {
    // bat_o2_bias,
    // bias_accepted_btn,
    // bias_rejected_btn,
    // boiler_efficeincy,
    coal_bunker,
    coal_cyclone,
    coal_flow_1,
    coal_flow_2,
    coal_flow_3,
    coal_furnace,
    cold_id,
    cold_pa,
    cold_ret_a,
    cold_ret_b,
    cold_sa,
    cold_slag,
    cold_stack,
    // copt_disabled_btn,
    // copt_enabled_btn,
    cyclone_left_inlet_pres,
    cyclone_right_inlet_pres,
    // dcs_o2_bias,
    drum_height_left,
    drum_height_right,
    drum_level_1,
    drum_level_2,
    drum_level_calc,
    furnace_pressure_1,
    furnace_pressure_2,
    furnace_pressure_calc,
    gross_load,
    hot_aph,
    hot_cyclone,
    hot_pa,
    hot_sa,
    idf_a_damper_position,
    idf_a_duration,
    idf_a_motor_current,
    idf_b_damper_position,
    idf_b_duration,
    idf_b_motor_current,
    inlet_aph_o2,
    outlet_aph_o2,
    paf_a_damper_position,
    paf_a_duration,
    paf_a_motor_current,
    paf_b_damper_position,
    paf_b_duration,
    paf_b_motor_current,
    // primary_air_flow,
    primary_air_flow_a,
    primary_air_flow_b,
    return_fan_left_flow,
    return_fan_left_motor_current,
    return_fan_right_flow,
    return_fan_right_motor_current,
    rtf_a_duration,
    rtf_b_duration,
    saf_a_damper_position,
    saf_a_duration,
    saf_a_motor_current,
    saf_b_damper_position,
    saf_b_duration,
    saf_b_motor_current,
    // secondary_air_flow,
    secondary_air_flow_a,
    secondary_air_flow_b,
    total_air_flow,
    total_coal_flow,
    // winbox_air_flow_a,
    // winbox_air_flow_b,
    bed_temperature_a,
    bed_temperature_b,
    bed_temperature_c,
    bed_temperature_d,
    // cyclone_left_temp,
    // cyclone_right_temp,
    bias_accepted_btn,
  } = combustionTags;

  const [openDetail, setOpenDetail] = React.useState(false);

  const loadingSyle = loading ? 'cursor-wait' : 'cursor-pointer';

  const handleOpenDetail = async (tag = '') => {
    const response = await dispatch(getCombustionTagDetailData(tag));
    if (response) {
      setOpenDetail(true);
    }
  };

  return (
    <>
      <svg
        className="copt-schema"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2050 1200"
        {...props}
      >
        <defs>
          <marker
            id="arrowhead"
            markerHeight={7}
            markerWidth={10}
            orient="auto"
            refX={0}
            refY={3.5}
          >
            <path d="m0 0 10 3.5L0 7z" />
          </marker>
          <filter
            id="fire-filter"
            width={300}
            height={800}
            x={450}
            y={300}
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={8} />
            <feComponentTransfer result="cutoff">
              <feFuncA intercept={-5} slope={20} type="linear" />
            </feComponentTransfer>
          </filter>
        </defs>
        <g className="cold-air">
          <path d="M1880 660h-40m-100-20h-80v150h-100m320-30h-40m-100-20h-80" />
          <circle id="cold_pa" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_pa}
              path="M1880 660 h-40 m-100 -20 h-80 v150 h-100 m320 -30 h-40 m-100 -20 h-80"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M1880 400h-40m-100-20h-120v300h-60m320-180h-40m-100-20h-120" />
          <circle id="cold_sa" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_sa}
              path="M1880 400 h-40 m-100 -20 h-120 v300 h-60 m320 -180 h-40 m-100 -20 h-120"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M1425 910v110h65m160 0h80v50h90m-90-50v-50h90" />
          <circle id="cold_id" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_id}
              path="M1425 910 v110 h65 m160 0 h80 v50 h90 m-90 -50 v-50 h90"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M1910 950h50m-50 100h50V480" />
          <circle id="cold_stack" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_stack}
              path="M1910 950 h50 m-50 100 h50 v-570"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M960 1025v-10m0-30v-30h115m115 70v-10m0-30v-30h-115V805H960v-25m0-30v-55m115 110h115v-25m0-30v-55" />
          <circle id="cold_ret_a" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_ret_a}
              path="M960 1025 v-10 m0 -30 v-30 h115 v-150 h-115 v-25 m0 -30 v-55 m115 110 h115 v-25 m0 -30 v-55"
              repeatCount="indefinite"
            />
          </circle>
          <circle r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_ret_b}
              path="M1190 1025 v-10 m0 -30 v-30 h-115 v-150 h115 v-25 m0 -30 v-55 m-115 110 h-115 v-25 m0 -30 v-55"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M520 975v10m0 30v35m80-75v10m0 30v10m80-50v10m0 30v35m0-25H520" />
          <circle id="cold_slag" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={cold_slag}
              path="M520 975 v75 m160 -75 v75"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g className="hot-air">
          <path d="M1290 790h-20v210H330V820h130M330 955h120m420 45V820H740m130 135H750" />
          <circle id="hot_pa" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={hot_pa}
              path="M1290 790 h-20 v210 h-940 v-180 h130 m-130 135 h120 m420 45 v-180 h-130 m130 135 h-120"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M1290 685h-50v80H880V235H320v280h125m-125-80h125m430 0H750m125 80H750" />
          <circle id="hot_sa" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={hot_sa}
              path="M1290 685 h-50 v80 h-360 v-530 h-560 v280 h125 m-125 -80 h125 m430 0 h-125 m125 80 h-125"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M750 360h115m30 0h10m-155 20h115m30 0h240" />
          <circle id="hot_cyclone" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={hot_cyclone}
              path="M750 360 h155 M750 380 h145 h240"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M975 295v-60h450v60m-220 0v-60" />
          <circle id="hot_aph" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={hot_aph}
              path="M975 295 v-60 h450 v60 M1205 295 v-60"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g className="coal">
          <path d="M975 510v90m230-90v90" />
          <circle id="coal_cyclone" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={coal_cyclone}
              path="M975 510 v90 M1205 510 v90"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M930 645 780 780h-40m430-135L800 780h-40" />
          <circle id="coal_furnace" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={coal_furnace}
              path="M930 645 l-150 135 h-40 M1170 645 l-370 135 h-40"
              repeatCount="indefinite"
            />
          </circle>
          <path d="M80 710v10l100 60h270m-270-70v10l100 60h10m-10-70v10l100 60h10" />
          <circle id="coal_bunker" cx={0} cy={0} r={1} className="particle">
            <animateMotion
              calcMode="paced"
              dur={coal_bunker}
              path="M80 710 v10 l100 60 h270 M180 710 v10 l100 60 h10 M280 710 v10 l100 60 h10"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g id="furnace" className="object">
          <path
            d="M450 300h300v485l-60 155h60v30H450v-30h60l-60-155z"
            className="path1"
          />
          <mask id="bed">
            <path
              d="M453 300h294v485l-58 152H511l-58-152z"
              style={{
                fill: '#fff',
              }}
            />
          </mask>
          <g className="fire-1" filter="url(#fire-filter)" mask="url(#bed)">
            <circle cx={476} cy={994.77} r={28}>
              <animate
                attributeName="cy"
                begin="-0.339s"
                dur={0.78}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="994.77;218.03"
              />
              <animate
                attributeName="r"
                begin="-0.339s"
                dur={0.78}
                keyTimes="0;0.673;1"
                repeatCount="indefinite"
                values="28;0;0"
              />
            </circle>
            <circle cx={675} cy={982.38} r={39}>
              <animate
                attributeName="cy"
                begin="-0.424s"
                dur={0.78}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="982.38;461.47"
              />
              <animate
                attributeName="r"
                begin="-0.424s"
                dur={0.78}
                keyTimes="0;0.987;1"
                repeatCount="indefinite"
                values="39;0;0"
              />
            </circle>
            <circle cx={490} cy={990.14} r={16}>
              <animate
                attributeName="cy"
                begin="-0.476s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="990.14;714.76"
              />
              <animate
                attributeName="r"
                begin="-0.476s"
                dur={0.48}
                keyTimes="0;0.904;1"
                repeatCount="indefinite"
                values="16;0;0"
              />
            </circle>
            <circle cx={566} cy={978.01} r={30}>
              <animate
                attributeName="cy"
                begin="-0.37s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="978.01;634.03"
              />
              <animate
                attributeName="r"
                begin="-0.37s"
                dur={0.48}
                keyTimes="0;0.778;1"
                repeatCount="indefinite"
                values="30;0;0"
              />
            </circle>
            <circle cx={621} cy={987.43} r={17}>
              <animate
                attributeName="cy"
                begin="-0.479s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="987.43;639.66"
              />
              <animate
                attributeName="r"
                begin="-0.479s"
                dur={0.48}
                keyTimes="0;0.661;1"
                repeatCount="indefinite"
                values="17;0;0"
              />
            </circle>
            <circle cx={600} cy={976.99} r={57}>
              <animate
                attributeName="cy"
                begin="-0.437s"
                dur={0.748}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="976.99;233.85"
              />
              <animate
                attributeName="r"
                begin="-0.437s"
                dur={0.748}
                keyTimes="0;0.40;1"
                repeatCount="indefinite"
                values="57;18;0"
              />
            </circle>
            <circle cx={694} cy={957.82} r={45}>
              <animate
                attributeName="cy"
                begin="-0.428s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="957.82;637.72"
              />
              <animate
                attributeName="r"
                begin="-0.428s"
                dur={0.48}
                keyTimes="0;0.823;1"
                repeatCount="indefinite"
                values="45;0;0"
              />
            </circle>
            <circle cx={474} cy={999.21} r={42}>
              <animate
                attributeName="cy"
                begin="-0.456s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="999.21;654.53"
              />
              <animate
                attributeName="r"
                begin="-0.456s"
                dur={0.48}
                keyTimes="0;0.862;1"
                repeatCount="indefinite"
                values="42;0;0"
              />
            </circle>
            <circle cx={646} cy={950.42} r={51}>
              <animate
                attributeName="cy"
                begin="-0.444s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="950.42;635.58"
              />
              <animate
                attributeName="r"
                begin="-0.444s"
                dur={0.48}
                keyTimes="0;0.721;1"
                repeatCount="indefinite"
                values="51;0;0"
              />
            </circle>
            <circle cx={724} cy={952.19} r={11}>
              <animate
                attributeName="cy"
                begin="-0.476s"
                dur={0.48}
                keyTimes="0;1"
                repeatCount="indefinite"
                values="952.19;670.5"
              />
              <animate
                attributeName="r"
                begin="-0.476s"
                dur={0.48}
                keyTimes="0;0.709;1"
                repeatCount="indefinite"
                values="11;0;0"
              />
            </circle>
          </g>
          <g className="fire-2" filter="url(#fire-filter)" mask="url(#bed)">
            <circle cx={519} cy={990.87} r={54}>
              <animate
                attributeName="cy"
                begin="-0.325s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="990.87;728.12"
              />
              <animate
                attributeName="r"
                begin="-0.325s"
                dur="0.57s"
                keyTimes="0;0.695;1"
                repeatCount="indefinite"
                values="54;0;0"
              />
            </circle>
            <circle cx={546} cy={954.9} r={35}>
              <animate
                attributeName="cy"
                begin="-0.484s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="954.9;654.09"
              />
              <animate
                attributeName="r"
                begin="-0.484s"
                dur="0.57s"
                keyTimes="0;0.943;1"
                repeatCount="indefinite"
                values="35;0;0"
              />
            </circle>
            <circle cx={590} cy={954.63} r={50}>
              <animate
                attributeName="cy"
                begin="-0.499s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="954.63;608.08"
              />
              <animate
                attributeName="r"
                begin="-0.499s"
                dur="0.57s"
                keyTimes="0;0.647;1"
                repeatCount="indefinite"
                values="50;0;0"
              />
            </circle>
            <circle cx={561} cy={961.76} r={54}>
              <animate
                attributeName="cy"
                begin="-0.362s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="961.76;646.07"
              />
              <animate
                attributeName="r"
                begin="-0.362s"
                dur="0.57s"
                keyTimes="0;0.825;1"
                repeatCount="indefinite"
                values="54;0;0"
              />
            </circle>
            <circle cx={585} cy={972.52} r={18}>
              <animate
                attributeName="cy"
                begin="-0.417s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="972.52;701.23"
              />
              <animate
                attributeName="r"
                begin="-0.417s"
                dur="0.57s"
                keyTimes="0;0.857;1"
                repeatCount="indefinite"
                values="18;0;0"
              />
            </circle>
            <circle cx={584} cy={972.79} r={14}>
              <animate
                attributeName="cy"
                begin="-0.481s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="972.79;656.47"
              />
              <animate
                attributeName="r"
                begin="-0.481s"
                dur="0.57s"
                keyTimes="0;0.838;1"
                repeatCount="indefinite"
                values="14;0;0"
              />
            </circle>
            <circle cx={614} cy={986.29} r={55}>
              <animate
                attributeName="cy"
                begin="-0.471s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="986.29;713.81"
              />
              <animate
                attributeName="r"
                begin="-0.471s"
                dur="0.57s"
                keyTimes="0;0.954;1"
                repeatCount="indefinite"
                values="55;0;0"
              />
            </circle>
            <circle cx={624} cy={985.46} r={22}>
              <animate
                attributeName="cy"
                begin="-0.315s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="985.46;646.56"
              />
              <animate
                attributeName="r"
                begin="-0.315s"
                dur="0.57s"
                keyTimes="0;0.871;1"
                repeatCount="indefinite"
                values="22;0;0"
              />
            </circle>
            <circle cx={677} cy={994.89} r={43}>
              <animate
                attributeName="cy"
                begin="-0.483s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="994.89;715.4"
              />
              <animate
                attributeName="r"
                begin="-0.483s"
                dur="0.57s"
                keyTimes="0;0.922;1"
                repeatCount="indefinite"
                values="43;0;0"
              />
            </circle>
            <circle cx={548} cy={957.28} r={36}>
              <animate
                attributeName="cy"
                begin="-0.442s"
                dur="0.57s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="957.28;640.59"
              />
              <animate
                attributeName="r"
                begin="-0.442s"
                dur="0.57s"
                keyTimes="0;0.602;1"
                repeatCount="indefinite"
                values="36;0;0"
              />
            </circle>
          </g>
          <g className="fire-3" filter="url(#fire-filter)" mask="url(#bed)">
            <circle cx={501} cy={986.02} r={19}>
              <animate
                attributeName="cy"
                begin="-0.37s"
                dur="0.261s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="986.02;368.4"
              />
              <animate
                attributeName="r"
                begin="-0.37s"
                dur="0.261s"
                keyTimes="0;0.959;1"
                repeatCount="indefinite"
                values="19;0;0"
              />
            </circle>
            <circle cx={515} cy={978.91} r={28}>
              <animate
                attributeName="cy"
                begin="-0.423s"
                dur="0.461s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="978.91;441.53"
              />
              <animate
                attributeName="r"
                begin="-0.423s"
                dur="0.461s"
                keyTimes="0;0.853;1"
                repeatCount="indefinite"
                values="28;0;0"
              />
            </circle>
            <circle cx={639} cy={978.24} r={48}>
              <animate
                attributeName="cy"
                begin="-0.439s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="978.24;404.45"
              />
              <animate
                attributeName="r"
                begin="-0.439s"
                dur="0.61s"
                keyTimes="0;0.798;1"
                repeatCount="indefinite"
                values="48;0;0"
              />
            </circle>
            <circle cx={531} cy={959.79} r={39}>
              <animate
                attributeName="cy"
                begin="-0.409s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="959.79;738.03"
              />
              <animate
                attributeName="r"
                begin="-0.409s"
                dur="0.61s"
                keyTimes="0;0.667;1"
                repeatCount="indefinite"
                values="39;0;0"
              />
            </circle>
            <circle cx={675} cy={993.7} r={33}>
              <animate
                attributeName="cy"
                begin="-0.421s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="993.7;709.4"
              />
              <animate
                attributeName="r"
                begin="-0.421s"
                dur="0.61s"
                keyTimes="0;0.73;1"
                repeatCount="indefinite"
                values="33;0;0"
              />
            </circle>
            <circle cx={498} cy={964.84} r={36}>
              <animate
                attributeName="cy"
                begin="-0.365s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="964.84;667.79"
              />
              <animate
                attributeName="r"
                begin="-0.365s"
                dur="0.61s"
                keyTimes="0;0.868;1"
                repeatCount="indefinite"
                values="36;0;0"
              />
            </circle>
            <circle cx={707} cy={988.68} r={38}>
              <animate
                attributeName="cy"
                begin="-0.475s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="988.68;601.71"
              />
              <animate
                attributeName="r"
                begin="-0.475s"
                dur="0.61s"
                keyTimes="0;0.888;1"
                repeatCount="indefinite"
                values="38;0;0"
              />
            </circle>
            <circle cx={613} cy={981.1} r={16}>
              <animate
                attributeName="cy"
                begin="-0.339s"
                dur="0.241s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="981.1;309.87"
              />
              <animate
                attributeName="r"
                begin="-0.339s"
                dur="0.241s"
                keyTimes="0;0.795;1"
                repeatCount="indefinite"
                values="15;0;0"
              />
            </circle>
            <circle cx={450} cy={957.73} r={49}>
              <animate
                attributeName="cy"
                begin="-0.346s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="957.73;390.34"
              />
              <animate
                attributeName="r"
                begin="-0.346s"
                dur="0.61s"
                keyTimes="0;0.994;1"
                repeatCount="indefinite"
                values="49;0;0"
              />
            </circle>
            <circle cx={713} cy={968.94} r={56}>
              <animate
                attributeName="cy"
                begin="-0.424s"
                dur="0.61s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="968.94;703.78"
              />
              <animate
                attributeName="r"
                begin="-0.424s"
                dur="0.61s"
                keyTimes="0;0.821;1"
                repeatCount="indefinite"
                values="56;0;0"
              />
            </circle>
          </g>
        </g>
        <g id="steamdrum" className="object">
          <path
            d="M420 260h120a1 1 180 0 1 0 80H420a1 1 180 0 1 0-80z"
            className="path1"
          />
          <path
            d="M420 260h120a1 1 180 0 1 0 80H420a1 1 180 0 1 0-80z"
            style={{
              stroke: '#1e2125',
              fill: 'transparent',
              strokeWidth: 4,
            }}
          />
          <path
            d="M420 270h15v60h-15zM530 270h15v60h-15z"
            className="drum-level-outer"
          />
          <mask id="drum">
            <path d="M420 270h15v60h-15zM530 270h15v60h-15z" className="drum" />
          </mask>
          <rect
            id="drum_height_left"
            width={15}
            height={100}
            x={422}
            y={drum_height_left}
            className="drum-level"
            mask="url(#drum)"
          />
          <rect
            id="drum_height_right"
            width={15}
            height={100}
            x={532}
            y={drum_height_right}
            className="drum-level"
            mask="url(#drum)"
          />
          <text
            x={480}
            y={307}
            className="fs-normal fw-bold text-primary"
            textAnchor="middle"
          >
            Drum
          </text>
        </g>
        <g id="coal-bunker" className="object">
          <path
            d="M40 550h80v100l-35 60H75l-35-60zM140 550h80v100l-35 60h-10l-35-60zM240 550h80v100l-35 60h-10l-35-60z"
            className="path1"
          />
          <text
            x={180}
            y={530}
            className="fs-large fw-bold text-secondary"
            textAnchor="middle"
          >
            Coal Bunker
          </text>
          <text
            x={80}
            y={630}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            1
          </text>
          <text
            x={180}
            y={630}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            2
          </text>
          <text
            x={280}
            y={630}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            3
          </text>
        </g>
        <g id="cyclone" className="object">
          <path
            d="M950 300h50v40h40v100l-40 60h-10v10h-30v-10h-10l-40-60V340h40"
            className="path1"
          />
          <text
            x={975}
            y={420}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            Cyclone
          </text>
          <text
            x={975}
            y={450}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            Left
          </text>
          <path
            d="M1180 300h50v40h40v100l-40 60h-10v10h-30v-10h-10l-40-60V340h40"
            className="path1"
          />
          <text
            x={1205}
            y={420}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            Cyclone
          </text>
          <text
            x={1205}
            y={450}
            className="fs-large fw-bold text-primary"
            textAnchor="middle"
          >
            Right
          </text>
          <path
            d="M960 600h30v60h-60v-30h30zm-30 62h29v30h-30zm31 0h29v30h-29zM1190 600h30v60h-60v-30h30zm-30 62h29v30h-30zm31 0h29v30h-29z"
            className="path1"
          />
        </g>
        <g id="aph" className="object">
          <path
            d="M1300 300h250v600h-250z"
            className="path2"
            style={{
              fill: '#afdfaf',
              strokeWidth: 0,
            }}
          />
          <path d="M1310 650h230v10h-230v10h230v10h-230v10h230v10h-230v10h230v10h-230" />
          <path
            d="M1300 640h20v90h-20zM1530 640h20v90h-20z"
            className="path1"
          />
          <text
            x={1425}
            y={450}
            className="text-primary fs-large"
            textAnchor="middle"
          >
            Air Preheater
          </text>
          <text
            x={1425}
            y={680}
            className="text-primary fs-normal"
            textAnchor="middle"
          >
            Secondary Air
          </text>
          <text
            x={1425}
            y={710}
            className="text-primary fs-normal"
            textAnchor="middle"
          >
            Preheater
          </text>
          <path d="M1310 760h230v10h-230v10h230v10h-230v10h230v10h-230v10h230v10h-230" />
          <path
            d="M1300 750h20v90h-20zM1530 750h20v90h-20z"
            className="path1"
          />
          <text
            x={1425}
            y={790}
            className="text-primary fs-normal"
            textAnchor="middle"
          >
            Primary Air
          </text>
          <text
            x={1425}
            y={820}
            className="text-primary fs-normal"
            textAnchor="middle"
          >
            Preheater
          </text>
        </g>
        <g id="esp" className="object">
          <text
            x={1570}
            y={980}
            className="fs-large fw-bold text-secondary"
            textAnchor="middle"
          >
            ESP
          </text>
          <path
            d="M1500 990h140v60h-140zm5 65h40v10l-15 20h-10l-15-20zm45 0h40v10l-15 20h-10l-15-20zm45 0h40v10l-15 20h-10l-15-20zm-95 45h140v10h-140z"
            className="path1"
          />
        </g>
        <g id="sa-fan" className="object">
          <path d="m1800 400 30 40h-60z" className="path1" />
          <circle cx={1800} cy={400} r={33} className="path4" />
          <circle cx={1800} cy={400} r={30} className="path1" />
          <path d="M1750 370h50v20h-50z" className="path1" />
          <circle cx={1800} cy={400} r={16} className="path3" />
          <text
            x={1800}
            y={360}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            SA Fan A
          </text>
          <g className="fan">
            <path d="M1800 399a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={saf_a_duration}
              from="360 1800 400"
              repeatCount="indefinite"
              to="0 1800 400"
              type="rotate"
            />
          </g>
          <path d="m1800 500 30 40h-60z" className="path1" />
          <circle cx={1800} cy={500} r={33} className="path4" />
          <circle cx={1800} cy={500} r={30} className="path1" />
          <path d="M1750 470h50v20h-50z" className="path1" />
          <circle cx={1800} cy={500} r={16} className="path3" />
          <text
            x={1800}
            y={570}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            SA Fan B
          </text>
          <g className="fan">
            <path d="M1800 499a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={saf_b_duration}
              from="360 1800 500"
              repeatCount="indefinite"
              to="0 1800 500"
              type="rotate"
            />
          </g>
        </g>
        <g id="pa-fan" className="object">
          <path d="m1800 660 30 40h-60z" className="path1" />
          <circle cx={1800} cy={660} r={33} className="path4" />
          <circle cx={1800} cy={660} r={30} className="path1" />
          <path d="M1750 630h50v20h-50z" className="path1" />
          <circle cx={1800} cy={660} r={16} className="path3" />
          <text
            x={1800}
            y={620}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            PA Fan A
          </text>
          <g className="fan">
            <path d="M1800 659a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={paf_a_duration}
              from="360 1800 660"
              repeatCount="indefinite"
              to="0 1800 660"
              type="rotate"
            />
          </g>
          <path d="m1800 760 30 40h-60z" className="path1" />
          <circle cx={1800} cy={760} r={33} className="path4" />
          <circle cx={1800} cy={760} r={30} className="path1" />
          <path d="M1750 730h50v20h-50z" className="path1" />
          <circle cx={1800} cy={760} r={16} className="path3" />
          <text
            x={1800}
            y={830}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            PA Fan B
          </text>
          <g className="fan">
            <path d="M1800 759a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={paf_b_duration}
              from="360 1800 760"
              repeatCount="indefinite"
              to="0 1800 760"
              type="rotate"
            />
          </g>
        </g>
        <g id="id-fan" className="object">
          <path d="m1850 970 30 40h-60z" className="path1" />
          <circle cx={1850} cy={970} r={33} className="path4" />
          <circle cx={1850} cy={970} r={30} className="path1" />
          <path d="M1850 940h50v20h-50z" className="path1" />
          <circle cx={1850} cy={970} r={16} className="path3" />
          <text
            x={1850}
            y={930}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            ID Fan A
          </text>
          <g className="fan">
            <path d="M1850 969a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={idf_a_duration}
              from="0 1850 970"
              repeatCount="indefinite"
              to="360 1850 970"
              type="rotate"
            />
          </g>
          <path d="m1850 1070 30 40h-60z" className="path1" />
          <circle cx={1850} cy={1070} r={33} className="path4" />
          <circle cx={1850} cy={1070} r={30} className="path1" />
          <path d="M1850 1040h50v20h-50z" className="path1" />
          <circle cx={1850} cy={1070} r={16} className="path3" />
          <text
            x={1850}
            y={1140}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            ID Fan B
          </text>
          <g className="fan">
            <path d="M1850 1069a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={idf_b_duration}
              from="0 1850 1070"
              repeatCount="indefinite"
              to="360 1850 1070"
              type="rotate"
            />
          </g>
        </g>
        <g id="return-fan" className="object">
          <path d="m940 1080 30 40h-60z" className="path1" />
          <circle cx={940} cy={1080} r={33} className="path4" />
          <circle cx={940} cy={1080} r={30} className="path1" />
          <path d="M950 1030h20v50h-20z" className="path1" />
          <circle cx={940} cy={1080} r={16} className="path3" />
          <g className="fan">
            <path d="M940 1079a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={rtf_a_duration}
              from="360 940 1080"
              repeatCount="indefinite"
              to="0 940 1080"
              type="rotate"
            />
          </g>
          <text
            x={940}
            y={1150}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Return Fan A
          </text>
          <path d="m1170 1080 30 40h-60z" className="path1" />
          <circle cx={1170} cy={1080} r={33} className="path4" />
          <circle cx={1170} cy={1080} r={30} className="path1" />
          <path d="M1180 1030h20v50h-20z" className="path1" />
          <circle cx={1170} cy={1080} r={16} className="path3" />
          <g className="fan">
            <path d="M1170 1079a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={rtf_b_duration}
              from="360 1170 1080"
              repeatCount="indefinite"
              to="0 1170 1080"
              type="rotate"
            />
          </g>
          <text
            x={1170}
            y={1150}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Return Fan B
          </text>
        </g>
        <g id="slag-cooler" className="object">
          <path d="M655 1055h50v50h-50z" className="path1" />
          <circle cx={680} cy={1080} r={16} className="path3" />
          <g className="fan">
            <path d="M680 1079a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur=".8s"
              from="360 680 1080"
              repeatCount="indefinite"
              to="0 680 1080"
              type="rotate"
            />
          </g>
          <text
            x={680}
            y={1140}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Slag
          </text>
          <text
            x={680}
            y={1170}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Cooler 1
          </text>
          <path d="M495 1055h50v50h-50z" className="path1" />
          <circle cx={520} cy={1080} r={16} className="path3" />
          <g className="fan">
            <path d="M520 1079a1 1 0 0 0 0 2 1 1 0 0 0 0-2m-2-2c-6-8-5-9-2-10a12 12 0 0 1 8 0c3 1 3 1-3 9q-1.7 2.4-3 1zm5 1c8-6 9-5 10-2a12 12 0 0 1 0 8c-1 3-1 3-9-3q-2.4-1.7-1-3zm-1 5c6 8 5 9 2 10a12 12 0 0 1-8 0c-3-2-3-2 3-9q1.7-2.4 3-1zm-5-1c-8 6-9 5-10 2a12 12 0 0 1 0-8c1-3 1-3 9 3q2.4 1.7 1 3z" />
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur=".8s"
              from="360 520 1080"
              repeatCount="indefinite"
              to="0 520 1080"
              type="rotate"
            />
          </g>
          <text
            x={520}
            y={1140}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Slag
          </text>
          <text
            x={520}
            y={1170}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Cooler 2
          </text>
        </g>
        <g id="stack" className="object">
          <path d="M1930 470h60l-10-200c0-5-40-5-40 0z" className="path1" />
          <path
            d="M1939 290c0-5 42-5 42 0l-.5-10c0-5-41-5-41 0zm-1 20c0-5 44-5 44 0l-.5-10c0-5-43-5-43 0zm-1 20c0-5 46-5 46 0l-.5-10c0-5-45-5-45 0z"
            className="path3"
          />
          <text
            x={1960}
            y={250}
            className="text-secondary fs-large"
            textAnchor="middle"
          >
            Stack
          </text>
        </g>
        <g className="head">
          <path
            d="M50 100h350v50H50z"
            className={`head-bg ${loadingSyle}`}
            onClick={() => handleOpenDetail('gross_load')}
          />
          <text x={60} y={90}>
            Gross Load:
          </text>
          <text
            x={380}
            y={135}
            textAnchor="end"
            onClick={() => handleOpenDetail('gross_load')}
            className={loadingSyle}
          >
            {gross_load}
          </text>
          <path
            d="M450 100h350v50H450z"
            className={`head-bg ${loadingSyle}`}
            onClick={() => handleOpenDetail('drum_level_calc')}
          />
          <text x={460} y={90}>
            Drum Level:
          </text>
          <text
            x={780}
            y={135}
            textAnchor="end"
            onClick={() => handleOpenDetail('drum_level_calc')}
            className={loadingSyle}
          >
            {drum_level_calc}
          </text>
          <path
            d="M850 100h350v50H850z"
            className={`head-bg ${loadingSyle}`}
            onClick={() => handleOpenDetail('furnace_pressure_calc')}
          />
          <text x={860} y={90}>
            Furnace Pressure:
          </text>
          <text
            x={1180}
            y={135}
            textAnchor="end"
            onClick={() => handleOpenDetail('furnace_pressure_calc')}
            className={loadingSyle}
          >
            {furnace_pressure_calc}
          </text>
          <path
            onClick={() => handleOpenDetail('total_coal_flow')}
            d="M1250 100h350v50h-350z"
            className={`head-bg ${loadingSyle}`}
          />
          <text x={1260} y={90}>
            Total Coal Flow:
          </text>
          <text
            x={1580}
            y={135}
            textAnchor="end"
            onClick={() => handleOpenDetail('total_coal_flow')}
            className={loadingSyle}
          >
            {total_coal_flow}
          </text>
          <path
            d="M1650 100h350v50h-350z"
            onClick={() => handleOpenDetail('total_air_flow')}
            className={`head-bg ${loadingSyle}`}
          />
          <text x={1660} y={90}>
            Total Air Flow:
          </text>
          <text
            x={1980}
            y={135}
            textAnchor="end"
            onClick={() => handleOpenDetail('total_air_flow')}
            className={loadingSyle}
          >
            {total_air_flow}
          </text>
          <path
            d="M50 1120h250v50H50z"
            className={`head-bg ${loadingSyle} btn-status {bias_accepted_btn}`}
            onClick={() => handleOpenDetail('bias_accepted_btn')}
          />
          <text x={70} y={1155} className="text-primary">
            O2 Accepted:
          </text>
          <text
            x={280}
            y={1155}
            className={`${loadingSyle} text-primary`}
            textAnchor="end"
            onClick={() => handleOpenDetail('bias_accepted_btn')}
          >
            {bias_accepted_btn}
          </text>
        </g>
        <text
          x={370}
          y={290}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('drum_level_1')}
        >
          {drum_level_1}
        </text>
        <text
          x={590}
          y={290}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('drum_level_2')}
        >
          {drum_level_2}
        </text>
        <text
          x={600}
          y={570}
          className="text-primary fs-large"
          textAnchor="middle"
        >
          Furnace
        </text>
        <text
          x={470}
          y={420}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('furnace_pressure_1')}
        >
          {furnace_pressure_1}
        </text>
        <text
          x={730}
          y={450}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('furnace_pressure_2')}
        >
          {furnace_pressure_2}
        </text>
        <text
          x={730}
          y={735}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('bed_temperature_a')}
        >
          {bed_temperature_a}
        </text>
        <text
          x={730}
          y={770}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('bed_temperature_b')}
        >
          {bed_temperature_b}
        </text>
        <text
          x={470}
          y={735}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('bed_temperature_c')}
        >
          {bed_temperature_c}
        </text>
        <text
          x={470}
          y={770}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('bed_temperature_d')}
        >
          {bed_temperature_d}
        </text>
        <text
          x={20}
          y={740}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('coal_flow_1')}
        >
          {coal_flow_1}
        </text>
        <text
          x={170}
          y={770}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('coal_flow_2')}
        >
          {coal_flow_2}
        </text>
        <text
          x={220}
          y={740}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('coal_flow_3')}
        >
          {coal_flow_3}
        </text>
        <text
          x={1425}
          y={620}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          textAnchor="middle"
          onClick={() => handleOpenDetail('inlet_aph_o2')}
        >
          O2: {inlet_aph_o2}
        </text>
        <text
          x={1425}
          y={870}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          textAnchor="middle"
          onClick={() => handleOpenDetail('outlet_aph_o2')}
        >
          O2: {outlet_aph_o2}
        </text>
        <text
          x={920}
          y={370}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('cyclone_left_inlet_pres')}
        >
          {cyclone_left_inlet_pres}
        </text>
        <text
          x={1150}
          y={370}
          className={`text-primary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('cyclone_right_inlet_pres')}
        >
          {cyclone_right_inlet_pres}
        </text>
        <text
          x={480}
          y={920}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('primary_air_flow_a')}
        >
          {primary_air_flow_a}
        </text>
        <text
          x={720}
          y={920}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('primary_air_flow_b')}
        >
          {primary_air_flow_b}
        </text>
        <text
          x={440}
          y={480}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('secondary_air_flow_a')}
        >
          {secondary_air_flow_a}
        </text>
        <text
          x={760}
          y={480}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('secondary_air_flow_b')}
        >
          {secondary_air_flow_b}
        </text>
        <text
          x={1060}
          y={840}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('return_fan_left_flow')}
        >
          {return_fan_left_flow}
        </text>
        <text
          x={1090}
          y={840}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          onClick={() => handleOpenDetail('return_fan_right_flow')}
        >
          {return_fan_right_flow}
        </text>
        <text
          x={900}
          y={1100}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('return_fan_left_motor_current')}
        >
          {return_fan_left_motor_current}
        </text>
        <text
          x={1130}
          y={1100}
          className={`text-secondary fs-normal tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('return_fan_right_motor_current')}
        >
          {return_fan_right_motor_current}
        </text>
        <text
          x={1760}
          y={410}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('saf_a_motor_current')}
        >
          {saf_a_motor_current}
        </text>
        <text
          x={1760}
          y={440}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('saf_a_damper_position')}
        >
          {saf_a_damper_position}
        </text>
        <text
          x={1760}
          y={510}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('saf_b_motor_current')}
        >
          {saf_b_motor_current}
        </text>
        <text
          x={1760}
          y={540}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('saf_b_damper_position')}
        >
          {saf_b_damper_position}
        </text>
        <text
          x={1760}
          y={670}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('paf_a_motor_current')}
        >
          {paf_a_motor_current}
        </text>
        <text
          x={1760}
          y={700}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('paf_a_damper_position')}
        >
          {paf_a_damper_position}
        </text>
        <text
          x={1760}
          y={770}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('paf_b_motor_current')}
        >
          {paf_b_motor_current}
        </text>
        <text
          x={1760}
          y={800}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('paf_b_damper_position')}
        >
          {paf_b_damper_position}
        </text>
        <text
          x={1810}
          y={960}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('idf_a_motor_current')}
        >
          {idf_a_motor_current}
        </text>
        <text
          x={1810}
          y={990}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('idf_a_damper_position')}
        >
          {idf_a_damper_position}
        </text>
        <text
          x={1810}
          y={1060}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('idf_b_motor_current')}
        >
          {idf_b_motor_current}
        </text>
        <text
          x={1810}
          y={1090}
          className={`fs-normal text-secondary tag-text ${loadingSyle}`}
          textAnchor="end"
          onClick={() => handleOpenDetail('idf_b_damper_position')}
        >
          {idf_b_damper_position}
        </text>
        <g id="legend">
          <text x={40} y={970} className="fs-large fw-bold text-secondary">
            Legend:
          </text>
          <g className="cold-air">
            <path d="M60 1000h20" />
            <text x={100} y={1005} className="fs-normal fw-bold text-secondary">
              : Cold Air
            </text>
          </g>
          <g className="hot-air">
            <path d="M60 1030h20" />
            <text x={100} y={1035} className="fs-normal fw-bold text-secondary">
              : Hot Air
            </text>
          </g>
          <g className="coal">
            <path d="M60 1060h20" />
            <text x={100} y={1065} className="fs-normal fw-bold text-secondary">
              : Solid Fuel
            </text>
          </g>
        </g>
      </svg>
      <Detail open={openDetail} handleClose={() => setOpenDetail(false)} />
    </>
  );
}

export default SvgComponent;
