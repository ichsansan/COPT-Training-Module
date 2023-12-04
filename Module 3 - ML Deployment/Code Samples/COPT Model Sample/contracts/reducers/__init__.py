def calculate_efficiency(df_before, df_after):
    """
    Calculates Boiler efficiency by consuming whole numpy arrays.
    """

    # Load input
    mainsteam_press = df_after["Main Steam Pressure"].values  # Pms
    mainsteam_temp = df_after["Main Steam Temperature"].values  # Tms
    feedwater_press = df_after["Feed Water Pressure"].values  # Pfw
    feedwater_temp = df_after["Feed Water Temperature"].values  # Tfw
    shspray_press = df_after["SH Spray Water Pressure"].values  # Psw
    shspray_temp = df_after["SH Spray Temperature"].values  # Tsw

    hotreheat_press = df_after["Hot Reheat Steam Pressure"].values if "Hot Reheat Steam Pressure" in df_after.columns else None  # Prho
    hotreheat_temp = df_after["Hot Reheat Steam Temperature"].values if "Hot Reheat Steam Temperature" in df_after.columns else None  # Trho
    coldreheat_press = df_after["Cold Reheat Steam Pressure"].values if "Cold Reheat Steam Pressure" in df_after.columns else None  # Prhi
    coldreheat_temp = df_after["Cold Reheat Steam Temperature"].values if "Cold Reheat Steam Temperature" in df_after.columns else None  # Trhi

    coal_flow = df_after["Coal Flow"].values / 3600  # Mcoal
    mainsteam_flow = df_after["Main Steam Flow"].values / 3600  # Mms
    feedwater_flow = df_after["Feed Water Flow"].values / 3600  # Mfw
    shspray_flow = df_after["SH Spray Water Flow"].values / 3600  # Mpsw
    reheatsteam_flow = df_after["Hot Reheat Steam Flow"].values / 3600 if "Hot Reheat Steam Flow" in df_after.columns else None  # Mrs

    hhv = df_after["Coal HHV"].values # High Heating Value

    # Calculate enthalpy:

    calc_h_pt = np.frompyfunc(steamTable.h_pt, 2, 1)

    mainsteam_enthalpy = calc_h_pt(mainsteam_press, mainsteam_temp)

    feedwater_enthalpy = calc_h_pt(feedwater_press, feedwater_temp)

    shspray_enthalpy = calc_h_pt(shspray_press, shspray_temp)

    hotreheat_enthalpy = \
        calc_h_pt(hotreheat_press, hotreheat_temp) if \
        hotreheat_press is not None and hotreheat_temp is not None \
        else None

    coldreheat_enthalpy = \
        calc_h_pt(coldreheat_press, coldreheat_temp) if \
        coldreheat_press is not None and coldreheat_temp is not None \
        else None

    # Calculate energy
    energy_mainsteam = (mainsteam_flow - shspray_flow) * \
        (mainsteam_enthalpy - feedwater_enthalpy)

    energy_shspray = shspray_flow * \
        (mainsteam_enthalpy - shspray_enthalpy)

    energy_reheatsteam = \
        reheatsteam_flow * (hotreheat_enthalpy - coldreheat_enthalpy) if \
        (reheatsteam_flow is not None) and \
        (hotreheat_enthalpy is not None) and (coldreheat_enthalpy is not None) else None

    energy_input = coal_flow * hhv
    energy_output = energy_mainsteam + energy_shspray

    if energy_reheatsteam is not None:
        energy_output += energy_reheatsteam

    return energy_output / energy_input * 100


def calculate_total_rh_flow(df_before):

    m_right = df_before["ZT1A010406_PNT"].values
    m_left = df_before["ZT1A011302_PNT"].values

    calc_h_pt = np.frompyfunc(steamTable.h_pt, 2, 1)


    h_right = calc_h_pt(df_before["PT1A010505_PNT"].values, df_before["TC1A011507_PNT"].values)
    h_left = calc_h_pt(df_before["PT1A010403_PNT"].values, df_before["TC1A011506_PNT"].values)

    h1 = calc_h_pt(df_before["PT1B021607_PNT"].values, df_before["RT1A013602_PNT"].values)
    h2 = calc_h_pt(df_before["PT1J010805_PNT"].values, df_before["TC1M053205_PNT"].values)

    m2_right = ((h1 - h_right) / (h_right - h2)) * m_right
    m2_left = ((h1 - h_left) / (h_left - h2)) * m_left

    # Divide by 10 to mitigate the effect of this variable, becasue the magnitude us different is not matching.
    return (m2_left + m2_right) / 10

