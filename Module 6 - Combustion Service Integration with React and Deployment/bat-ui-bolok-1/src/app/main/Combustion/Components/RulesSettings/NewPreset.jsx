import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Grid,
  Switch,
} from '@material-ui/core';
import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
  postCombustionNewPreset,
  changeCombustion,
  getCombustionRuleByID,
} from 'app/store/actions';

const NewPreset = ({ open, title, cancelHandler }) => {
  const dispatch = useDispatch();
  const combustionReducer = useSelector((state) => state.combustionReducer);
  const [showPreview, setShowPreview] = useState(false);

  const closeHandler = () => {
    cancelHandler();
    setShowPreview(false);
  };

  const {
    combustionRuleDetail,
    combustionNewPresetName,
    loadingRuleUpdate,
    combustionRuleDetailData: { id, presetId },
  } = combustionReducer;

  const addRulePreset = async () => {
    if (combustionNewPresetName.trim() === '') {
      dispatch(
        showMessage({
          variant: 'error',
          message: 'Preset name cannot be empty!',
        })
      );
    } else {
      const response = await dispatch(postCombustionNewPreset());
      if (response) {
        await dispatch(getCombustionRuleByID(id, presetId));
        await closeHandler();
        await dispatch(
          changeCombustion({
            combustionNewPresetName: '',
          })
        );
      }
    }
  };

  return (
    <Dialog fullWidth open={open} aria-labelledby="responsive-dialog-title">
      <DialogTitle>{title || 'New Preset'}</DialogTitle>
      <DialogContent>
        <Grid container className="space-y-4" spacing={1}>
          <Grid container alignItems="baseline" item xs={12}>
            <Grid item xs={3} className="text-14 text-light-blue-300">
              New preset name
            </Grid>
            <Grid item xs={9}>
              <Input
                onChange={(e) =>
                  dispatch(
                    changeCombustion({
                      combustionNewPresetName: e.target.value,
                    })
                  )
                }
                variant="outlined"
                fullWidth
                type="text"
                size="small"
                color="secondary"
              />
            </Grid>
          </Grid>
          <Grid container alignItems="baseline" item xs={12}>
            <Grid item xs={3} className="text-14 text-light-blue-300">
              Show Rule Preview
            </Grid>
            <Grid item xs={9} className="text-14">
              <Switch
                size="small"
                onClick={() => setShowPreview(!showPreview)}
              />
            </Grid>
          </Grid>
          {showPreview && (
            <Grid container alignItems="center" item xs={12} spacing={1}>
              {combustionRuleDetail?.length === 0 ? (
                <Grid item container alignItems="center">
                  <Grid item xs={12} className="text-14">
                    No recommendation's rule to show, because no rules added
                  </Grid>
                </Grid>
              ) : (
                <Grid item container>
                  <Grid item xs={12} className="text-14">
                    {combustionRuleDetail.map((item) => (
                      <pre key={item.sequence} className="mb-8">
                        <code>
                          {item.bracketOpen} {item.tagSensor}{' '}
                          {item.bracketClose}
                        </code>
                      </pre>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeHandler}
          disabled={loadingRuleUpdate}
          variant="outlined"
          size="small"
          className="text-12"
        >
          Cancel
        </Button>
        <Button
          disabled={loadingRuleUpdate}
          onClick={addRulePreset}
          variant="contained"
          size="small"
          className="text-12"
          color="secondary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewPreset.defaultProps = {
  open: false,
  title: 'Title',
  cancelHandler: () => console.log('Cancel handler...'),
};

export default NewPreset;
