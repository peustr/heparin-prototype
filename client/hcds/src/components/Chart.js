import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends Component {

  therapeuticRangeDataPoints() {
    var data = []
    data.push({x:300, y:[80, 60]})
    data.push({x:3000, y:[80, 60]})
    return data;
  };

  render() {
    const options = {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      height: 500,
      axisX: {
        minimum: 300,
        maximum: 3000,
        titleFontFamily: "sans-serif",
        titleFontColor: "black",
        titleFontSize: 20,
        labelFontFamily: "sans-serif",
        labelFontColor: "black",
        labelFontSize: 12,
        title: this.props.title,
      },
      axisY: {
        minimum: 40,
        maximum: 140,
        titleFontFamily: "sans-serif",
        titleFontColor: "black",
        titleFontSize: 20,
        labelFontFamily: "sans-serif",
        labelFontColor: "black",
        labelFontSize: 12,
        title: "APTT (s)"
      },
      toolTip:{
        fontFamily: "sans-serif",
      },
      legend:{
        fontFamily: "sans-serif",
      },
      data: [
        {
          type: "area",
          markerSize: 1,
          dataPoints: this.props.dataPoints,
        },
        {
          type: "rangeArea",
          markerSize: 0,
          dataPoints: this.therapeuticRangeDataPoints(),
          showInLegend: true,
          legendText: "Therapeutic Range",
        }
      ]
    }

    return (
      <div>
        <CanvasJSChart options = {options} />
      </div>
    );
  };
}

export default Chart;
