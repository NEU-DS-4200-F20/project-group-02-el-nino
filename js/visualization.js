// Immediately Invoked Function Expression to limit access to our
// variables and prevent
(async () => {

  // load data
  const [geometricLandData, rawSSTData] = await Promise.all([d3.json("data/land-50m.json"), d3.csv("data/sst.csv")])

  // format data
  const sstData = d3.group(rawSSTData, d => d.date);

  // current data variable controlled by slider
  // initialize to beginning date of data
  let currentSSTData = sstData.get("2018-01");

  // time-series time change
  const dispatchString = "timeChange";

  // create charts
  const sstMapChart = sstMap()(geometricLandData, currentSSTData);
  const timeSeriesSlider = await timeSlider().timeDispatcher(d3.dispatch(dispatchString))();

  // dispatch time chage events
  timeSeriesSlider.timeDispatcher().on(dispatchString, timeValue => {
    const newDate = valueToDate(timeValue);
    currentSSTData = sstData.get(newDate);
    sstMapChart.updateTime(currentSSTData);
  })
})();