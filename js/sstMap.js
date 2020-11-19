// function to create sst map
function sstMap() {
  // color scale function
  const myColor = d3.scaleLinear().domain([-2, 32]).range(["white", "#001144"]);

  function chart(geographicData, sstData) {
    // create svg for later appending
    const svg = d3.select("#sstMap")
        .append('svg')
        .attr('width' , 940)
        .attr('height', 600)
        .attr('viewBox', [0, 0, 900, 500].join(' '))
        .classed('svg-content', true);

    // .on("click", reset);
    const g = svg.append("g").attr("id", "map");

    // create projection 
    //const projection = d3.geoMercator().center([0, 0]).rotate([180, 0, 0]);
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
    createLegend();

    // create legend
    function createLegend() {
      const legend = [{
            color: "white",
            value: -2
          },
          {
            color: "#001144",
            value: 32
          }
        ],
        extent = d3.extent(legend, d => d.value);

      const padding = 12,
        width = 240,
        height = 64,
        innerWidth = width - padding * 2,
        barHeight = 12;

      const g = svg.append("g").attr("id", "legend");
      g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", "1px");
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 3)
        .text("Sea Surface Temperature (°C)")
        .style("text-anchor", "middle")
        .style("font-size", "14px");

      const legendScale = d3
        .scaleLinear()
        .range([padding, innerWidth + padding])
        .domain(extent);

      const legendTicks = legend.map(d => d.value);

      const legendAxis = d3
        .axisBottom(legendScale)
        .tickSize(barHeight * 1.5)
        .tickValues(legendTicks);

      const defs = svg.append("defs");
      const linearGradient = defs
        .append("linearGradient")
        .attr("id", "myGradient");
      linearGradient
        .selectAll("stop")
        .data(legend)
        .enter()
        .append("stop")
        .attr(
          "offset",
          d => ((d.value - extent[0]) / (extent[1] - extent[0])) * 100 + "%"
        )
        .attr("stop-color", d => d.color);

      g.append("rect")
        .attr("x", padding)
        .attr("y", height / 2 - barHeight / 4)
        .attr("width", innerWidth)
        .attr("height", barHeight)
        .attr("border", "2px solid black")
        .style("fill", "url(#myGradient)");

      g.append("g")
        .call(legendAxis)
        .attr("transform", `translate(0,${height / 2 - barHeight / 4})`)
        .select(".domain")
        .remove();
    };

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
    const div = d3.select(".tooltip")
    rects
    .data(timeData)
    .on("click", function (event, d) {
      div.transition()
        .duration(20)
        .style("opacity", .9);
      div.html("Lat: " + d.latitude + "<br/>" + "Lon: " + d.longitude + "<br/>" + "SST: " + parseFloat(d.sst).toFixed(2))
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .transition().duration(750).attr("fill", d => myColor(d.sst))
  }

  return chart;
}