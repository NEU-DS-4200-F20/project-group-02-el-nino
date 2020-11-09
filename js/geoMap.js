function geoMap() {
  const svg = d3.select("#vis-svg-1");
  // .on("click", reset);
  const g = svg.append("g").attr("id", "map");

  const projection = d3.geoMercator().center([0, 0]).rotate([180, 0, 0]);

  // append lat-long points w/ linear gradient colot channel for sst val based on projection
  d3.csv("data/sst_small.csv").then(function (data) {
    const myColor = d3.scaleLinear().domain([-2, 32]).range(["white", "blue"]);
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", 5)
      .attr("fill", d => myColor(d.sst));
    // append path for global land
    d3.json("../data/land-50m.json").then(topology => {
      const land = topojson.feature(topology, topology.objects.land);
      const path = d3.geoPath(projection)(land);
      g.append("path").attr("d", path);
      createLegend();
    });
  });

  const createLegend = () => {
    const legend = [
        { color: "white", value: -2 },
        { color: "blue", value: 32 }
      ],
      extent = d3.extent(legend, d => d.value);

    const padding = 12,
      width = 240,
      height = 64,
      innerWidth = width - padding * 2,
      barHeight = 12;

    const g = svg.append("g");
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
}
