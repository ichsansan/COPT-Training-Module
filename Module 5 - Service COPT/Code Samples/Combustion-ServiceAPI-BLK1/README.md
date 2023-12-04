# ServiceAPI
## Descriptions
Background services that manage the backend parts of Combustion Optimization outside the Machine Learning parts. This Service splitted into 2 main codes

- Background Service

  Handle the background tasks such as safeguard state and calling COPT's Machine Learning (ML). Every calculation of the ML results are done before sending up the values into the OPC.
  
- UI Service

  Handle values that needed to display on the UI side. This values include each sensor variables, parameter settings, and alarms.
  

## Updates:

> **Update v1.5.4**
>
> Removing limit on downloading Recommendation, adding editing description on alarm-history
> Fixing bugs on alarm-history