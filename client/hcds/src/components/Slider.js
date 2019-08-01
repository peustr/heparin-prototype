import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


class CSlider extends Component {

  render() {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography id="cslider" gutterBottom>
              {this.props.text}
            </Typography>
          </Grid>
          <Grid item xs>
            <Input
              id="cinput"
              margin="dense"
              value={this.props.value}
              disabled={this.props.disabled}
              onChange={this.props.handleInputChange}
              inputProps={{
                'aria-labelledby': 'cslider',
                type: 'number',
                step: this.props.step,
                min: this.props.min,
                max: this.props.max,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs>
            <Slider
              aria-labelledby="cslider"
              value={this.props.value}
              min={this.props.min}
              max={this.props.max}
              step={this.props.step}
              disabled={this.props.disabled}
              onChange={this.props.handleSliderChange}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

}

export default CSlider;
