import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Chart from './components/Chart';
import Slider from './components/Slider';

const axios = require('axios');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataPoints: [],
      sliders: [
        { text: "Gender", min: 0, max: 1, step: 1, value: 0, disabled: false },
        { text: "Age (years)", min: 35, max: 95, step: 1, value: 65, disabled: false },
        { text: "Weight (kg)", min: 40, max: 150, step: 0.1, value: 85, disabled: false },
        { text: "Height (cm)", min: 150, max: 210, step: 1, value: 175, disabled: false },
        { text: "APTT (s)", min: 30, max: 140, step: 1, value: 70, disabled: false },
        { text: "PT (INR)", min: 0.88, max: 4, step: 0.01, value: 1.36, disabled: false },
        { text: "Platelet Count (1e9/L)", min: 40, max: 1000, step: 1, value: 245, disabled: false },
        { text: "Hematocrit (%)", min: 19, max: 54, step: 1, value: 32, disabled: false },
        { text: "Hemoglobin (mmol/L)", min: 3.8, max: 11.4, step: 0.1, value: 6.7, disabled: false },
        { text: "Bilirubin (µmol/L)", min: 1, max: 200, step: 0.1, value: 14.9, disabled: false },
        { text: "Creatinine (µmol/L)", min: 16, max: 800, step: 0.1, value: 128.5, disabled: false },
        { text: "Heparin Bolus Injection (IU)", min: 0, max: 5000, step: 500, value: 0, disabled: true },
      ]
    };
  };

  handleSliderChange = (newVal, i) => {
    var newSliders = this.state.sliders.slice();
    newSliders[i].value = newVal;
    this.setState({sliders: newSliders});
  };

  handleInputChange = (event, i) => {
    var newVal = event.target.value === "" ? "" : Number(event.target.value);
    this.handleSliderChange(newVal, i);
  };

  generate_features() {
    var s = "?";
    s += "gender=" + this.state.sliders[0].value;
    s += "&";
    s += "age=" + this.state.sliders[1].value;
    s += "&";
    var weight = this.state.sliders[2].value;
    s += "weight=" + weight;
    s += "&";
    var height = this.state.sliders[3].value;
    s += "height=" + height;
    s += "&";
    s += "bmi=" + weight / Math.pow(height / 100, 2);
    s += "&";
    s += "apttPrev=" + this.state.sliders[4].value;
    s += "&";
    s += "apttInterval=360";
    s += "&";
    s += "pt=" + this.state.sliders[5].value;
    s += "&";
    s += "plateletCount=" + this.state.sliders[6].value;
    s += "&";
    s += "hematocrit=" + this.state.sliders[7].value / 100;
    s += "&";
    s += "hemoglobin=" + this.state.sliders[8].value;
    s += "&";
    s += "bilirubin=" + this.state.sliders[9].value;
    s += "&";
    s += "creatinine=" + this.state.sliders[10].value;
    return s;
  };

  handleUpdate = () => {
    var newSliders = this.state.sliders.slice();
    for (var slider of newSliders) {
      if (slider.value < slider.min) {
        slider.value = slider.min;
      }
      if (slider.value > slider.max) {
        slider.value = slider.max;
      }
    }
    var feature_request = this.generate_features();
    var self = this;
    axios.get("http://localhost:5000/t3" + feature_request)
      .then(function (response) {
        newSliders[11].value = response.data.t2;
        self.setState(
          {
            dataPoints: response.data.t3,
            sliders: newSliders
          }
        );
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
      });
  }

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            {
              this.state.sliders.map((item, idx) => (
                <Slider key={idx}
                  text={this.state.sliders[idx].text}
                  min={this.state.sliders[idx].min}
                  max={this.state.sliders[idx].max}
                  step={this.state.sliders[idx].step}
                  value={this.state.sliders[idx].value}
                  disabled={this.state.sliders[idx].disabled}
                  handleInputChange={(event) => this.handleInputChange(event, idx)}
                  handleSliderChange={(event, newVal) => this.handleSliderChange(newVal, idx)}
                />
              ))
            }
            <Button variant="contained" color="primary" onClick={() => this.handleUpdate()}>Update</Button>
          </Grid>
          <Grid item xs>
            <Chart title="Heparin Infusion Rate (IU/h)" dataPoints={this.state.dataPoints} />
          </Grid>
        </Grid>
      </div>
    );
  };

}

export default App;
