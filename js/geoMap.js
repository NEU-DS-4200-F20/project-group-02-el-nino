import usa from "../data/usa.js";

function geoMap() {
  const projection = d3.geoEquirectangular();

  const geoGenerator = d3.geoPath().projection(projection);

  const svg = d3.select("#vis-svg-1");
  svg.append("g").attr("class", "map");
  // Join the FeatureCollection's features array to path elements
  const u = d3.select("#vis-svg-1 g.map").selectAll("path").data(usa.features);

  // Create path elements and update the d attribute using the geo generator
  u.enter().append("path").attr("d", geoGenerator);
}

export default geoMap;
