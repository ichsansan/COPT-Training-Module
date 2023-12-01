import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';

const OnboardTooltip = ({
  continuous,
  index,
  step,
  isLastStep,
  backProps,
  primaryProps,
  tooltipProps,
  skipProps,
  hideFooter,
}) => (
  <Box
    maxWidth={480}
    width="full"
    borderRadius={6}
    bgcolor="primary.main"
    color="text.primary"
    {...tooltipProps}
  >
    <Box p={2}>
      <Typography variant="body1">{step?.title || 'Tips'}</Typography>
    </Box>
    <Divider />
    <Box px={2} py={4}>
      <Typography variant="caption">{step.content}</Typography>
    </Box>
    {!tooltipProps?.hideFooter && (
      <>
        <Divider />
        <Box py={1} px={2}>
          <section className="justify-between flex gap-4">
            <div>
              {!isLastStep && (
                <Button
                  {...skipProps}
                  size="small"
                  className="text-12"
                  variant="outlined"
                >
                  <Typography id="skip">Skip</Typography>
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              {index > 0 && (
                <Grid item xs={12}>
                  <Button
                    {...backProps}
                    autoFocus
                    size="small"
                    className="text-12"
                    color="secondary"
                  >
                    <Typography id="back">Back</Typography>
                  </Button>
                </Grid>
              )}
              {continuous && (
                <Grid item xs={12}>
                  <Button
                    {...primaryProps}
                    autoFocus
                    size="small"
                    className="text-12"
                    color="secondary"
                    variant="contained"
                  >
                    <Typography id="next">
                      {index === 0
                        ? 'Get Started'
                        : isLastStep
                        ? 'Finish'
                        : 'Next'}
                    </Typography>
                  </Button>
                </Grid>
              )}
            </div>
          </section>
        </Box>
      </>
    )}
  </Box>
);

export default OnboardTooltip;
