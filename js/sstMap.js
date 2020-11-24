// function to create sst map
function sstMap() {

  const width = 480, height = 250;
  const margin = {
    top: 50,
    bottom: 50,
    left: 200,
    right: 0
  };

  // color scale function
  const myColor = d3.scaleSequential()
    .domain([-2, 32])
    .interpolator(d3.interpolateBlues);

  function chart(geographicData, sstData) {
    // create svg for later appending
    const svg = d3.select("#sstMap")
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', [0, 0, 900, 500].join(' '))
      .classed('svg-content', true);

    // .on("click", reset);
    const g = svg.append("g").attr("id", "map");

    // create projection 
    const projection = d3.geoEquirectangular().rotate([180, 0, 0]);

    // create tooltip div
    const div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const sstPts = g.append("g").attr("id", "sstPts");
    // add squares to map and apply tooltip behavior
    sstPts.selectAll("rect")
      .data(sstData)
      .enter()
      .append("rect")
      .attr("x", d => projection([d.longitude, d.latitude])[0])
      .attr("y", d => projection([d.longitude, d.latitude])[1])
      .attr("width", 5.6)
      .attr("height", 5.6)
      .attr("fill", d => myColor(d.sst))
      .on("click", function (event, d) {
        div.transition()
          .duration(20)
          .style("opacity", .9);
        div.html("Lat: " + d.latitude + "<br/>" + "Lon: " + d.longitude + "<br/>" + "SST: " + parseFloat(d.sst).toFixed(2))
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

    const geoPts = g.append("g").attr("id", "geoPts");

    // append path for global land projection
    const land = topojson.feature(geographicData, geographicData.objects.land);
    const path = d3.geoPath(projection)(land);
    geoPts.append("path").attr("d", path);

    // create and draw legend
    // based on conventions of ...
    const myLegend = legend({
      color: d3.scaleSequential([-2, 32], d3.interpolateBlues),
      title: "Sea Surface Temperature (°C)"
    });
    d3.select("#legendDiv2")
      .node()
      .appendChild(myLegend)

    // allow zooming and panning
    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
    svg.call(zoom);

    function zoomed(event, d) {
      g.attr("transform", event.transform);
    }

    return chart;
  }

  chart.updateTime = function (timeData) {
    if (!arguments.length) return;
    const rects = d3.select('#sstPts').selectAll('rect');
    rects
      .data(timeData)
      .transition().duration(750).attr("fill", d => myColor(d.sst))
  }

  return chart;
}