// Immediately Invoked Function Expression to limit access to our
// variables and prevent
(() => {

  let mrbViz = mrbMap("precip", "2018-01");
  let sstViz = sstMap();
  let mrbLineChart = lineChart("discharge");
  let oniLineChart = oni();
  //lineChart("soil");
  //lineChart("precip");

})();
