import usa from "../data/usa.js";

function geoMap() {
  const projection = d3.geoEquirectangular()
    //.scale(1000)
    .center([-70, 42.313]);

  const geoGenerator = d3.geoPath().projection(projection);

  const svg = d3.select("#vis-svg-1");
  svg.append("g").attr("class", "map");
  // Join the FeatureCollection's features array to path elements
  const u = d3.select("#vis-svg-1 g.map").selectAll("path").data(usa.features);

  // Create path elements and update the d attribute using the geo generator
  u.enter().append("path").attr("d", geoGenerator);

  var myColor = d3.scaleLinear().domain([-2,32])
    .range(["white", "blue"])

  d3.csv("data/sst_small.csv").then(function(data) {
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
               return projection([d.longitude, d.latitude])[0];
       })
       .attr("cy", function(d) {
               return projection([d.longitude, d.latitude])[1];
       })
       .attr("r", 5)
       .attr("fill", function(d) {
         return myColor(d.sst) 
       });
  });

}

export default geoMap;
