import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  Switch,
} from '@material-ui/core';
import {
  changeSootblow,
  getRuleByID,
  postSootblowNewPreset,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NewPreset = ({ open, title, cancelHandler }) => {
  const dispatch = useDispatch();
  const sootblowReducer = useSelector((state) => state.sootblowReducer);
  const [showPreview, setShowPreview] = useState(false);

  const closeHandler = () => {
    cancelHandler();
    setShowPreview(false);
  };

  const {
    sootblowDetailRule,
    sootblowNewPresetName,
    loadingRuleUpdate,
    sootblowRuleDetailData: { id, presetId },
  } = sootblowReducer;

  const addRulePreset = async () => {
    if (sootblowNewPresetName.trim() === '') {
      dispatch(
        showMessage({
          variant: 'error',
          message: 'Present name cannot be empty!',
        })
      );
    } else {
      await dispatch(postSootblowNewPreset());
      await dispatch(getRuleByID(id, presetId));
      await closeHandler();
      await dispatch(
        changeSootblow({
          sootblowNewPresetName: '',
        })
      );
    }
  };

  return (
    <Dialog fullWidth open={open} aria-labelledby="responsive-dialog-title">
      <DialogTitle>{title || 'New Preset'}</DialogTitle>
      <DialogContent>
        <Grid container className="space-y-4" spacing={1}>
          <Grid container alignItems="baseline" item xs={12}>
            <Grid item xs={12} md={3} className="text-14 text-light-blue-300">
              New preset name
            </Grid>
            <Grid item xs={12} md={9}>
              <Input
                onChange={(e) =>
                  dispatch(
                    changeSootblow({
                      sootblowNewPresetName: e.target.value,
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
            <Grid item xs={12} md={3} className="text-14 text-light-blue-300">
              Show Rule Preview
            </Grid>
            <Grid item xs={12} md={9} className="text-14">
              <Switch
                size="small"
                onClick={() => setShowPreview(!showPreview)}
              />
            </Grid>
          </Grid>
          {showPreview && (
            <Grid container alignItems="baseline" item xs={12} spacing={1}>
              {sootblowDetailRule?.length === 0 ? (
                <Grid item container alignItems="center">
                  <Grid item xs={12} className="text-14">
                    Sorry, there is no recommendation's rule to show
                  </Grid>
                </Grid>
              ) : (
                <Grid item container>
                  <Grid item xs={12} className="text-14">
                    {sootblowDetailRule.map((item) => (
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
