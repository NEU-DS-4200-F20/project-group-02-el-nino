function mrbMap(condition, geographicData, precipData, soilmData) {

    // initialize variables
    let data, varName, sqSize;

    // set file, variable name, and square size depending on input
    if (condition == "precip") {
        data = precipData
        varName = "Precipitation"
        sqSize = 5.5
    } else if (condition == "soilm") {
        data = soilmData
        varName = "Soil Moisture"
        sqSize = 4
    }

    // create svg for later appending
    const svg = d3.select("#mrbMap")
        .append('svg')
        .attr('width' , 300)
        .attr('height', 400)
        .attr('viewBox', [0, 0, 1000, 500].join(' '))
        .classed('svg-content', true);
    const g = svg.append("g").attr("id", "map");

    // create projection 
    const projection = d3.geoEquirectangular().scale(700).center([-98.57, 42]); //.rotate([180, 0, 0]);

    // create tooltip div
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // append path for global land projection
    const land = topojson.feature(geographicData, geographicData.objects.land);
    const path = d3.geoPath(projection)(land);
    g.append("path").attr("d", path);

    // get max and min of variable for scaling purposes
    const varMax = d3.max(data, d => d.var);
    const varMin = d3.min(data, d => d.var);
    createLegend(varMin, varMax);

    // color scale function
    const myColor = d3.scaleLinear().domain([varMin, varMax]).range(["white", "#001144"]);

    // add squares to map and apply tooltip behavior
    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => projection([d.longitude, d.latitude])[0])
        .attr("y", d => projection([d.longitude, d.latitude])[1])
        .attr("width", sqSize)
        .attr("height", sqSize)
        .attr("fill", d => myColor(d.var))
        .on("click", function (event, d) {
            d3.select(this).style("fill", 'red')
            div.transition()
                .duration(20)
                .style("opacity", .9);
            div.html("Lat: " + d.latitude + "<br/>" + "Lon: " + d.longitude + "<br/>" + varName + ": " + parseFloat(d.var).toFixed(2))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        });

    // create legend
    function createLegend(varMin, varMax) {
        const legend = [{
                    color: "white",
                    value: varMin
                },
                {
                    color: "#001144",
                    value: varMax
                }
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
            .text(varName)
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