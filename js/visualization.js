// Immediately Invoked Function Expression to limit access to our
// variables and prevent
(async () => {

  // load data
  const [geometricLandData, rawSSTData, rawPrecipData] = await Promise.all([d3.json("data/land-50m.json"), d3.csv("data/sst.csv"), d3.csv("data/precip.csv")])

  // format data
  const sstData = d3.group(rawSSTData, d => d.date);
  const precipData = d3.group(rawPrecipData, d => d.date);

  // current data variable controlled by slider
  // initialize to beginning date of data
  let currentSSTData = sstData.get("2018-01");
  let currentPrecipData = precipData.get("2018-01")

  // time-series time change
  const dispatchString = "timeChange";

  // create/update charts
  const timeSeriesSlider = timeSlider().timeDispatcher(d3.dispatch(dispatchString))();
  const sstMapChart = sstMap()(geometricLandData, currentSSTData);
  const oniLineChart = oni();
  const mrbViz = mrbMap("precip", geometricLandData, currentPrecipData, null);
  //const mrbLineChart = lineChart();

  /*
  // update charts on radio button selection
  buttons.on('change', function(d) {
    const mrbViz = mrbMap(this.value, geometricLandData, currentPrecipData, null);
    const mrbLineChart = lineChart(this.value);
    console.log('button changed to ' + this.value);
  });
  */

  // dispatch time chage events
  timeSeriesSlider.timeDispatcher().on(dispatchString, timeValue => {
    const newDate = valueToDate(timeValue);
    currentSSTData = sstData.get(newDate);
    sstMapChart.updateTime(currentSSTData);
  })
})();