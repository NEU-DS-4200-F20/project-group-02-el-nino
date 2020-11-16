function mrbMap(condition, date) {

    // create svg for later appending
    const svg = d3.select("#mrbMap")
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', [0, 0, 1000, 500].join(' '))
        .classed('svg-content', true);;
    const g = svg.append("g").attr("id", "map");

    // create projection 
    const projection = d3.geoEquirectangular().scale(700).center([-98.57,42]);//.rotate([180, 0, 0]);

    // create tooltip div
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // set file, variable name, and square size depending on input
    if (condition == "precip") {
        var file = "data/precip.csv"
        var varName = "Precipitation"
        var sqSize = 5.5
    } else if (condition == "soilm") {
        var file = "data/soilm_small.csv"
        var varName = "Soil Moisture"
        var sqSize = 4
    }
    
    // append path for global land projection
    d3.json("../data/land-50m.json").then(topology => {
        const land = topojson.feature(topology, topology.objects.land);
        const path = d3.geoPath(projection)(land);
        g.append("path").attr("d", path);
        createLegend();
    });
    
    // append lat-long points w/ linear gradient color channel for var val based on projection
    d3.csv(file).then(function (data) {

        data.filter(function(d) {return d.date == date})

        // get max and min of variable for scaling purposes
        varMax = d3.max(data, d => d.var);
        varMin = d3.min(data, d => d.var);
        console.log(varMax)
        console.log(varMin)

        // color scale function
        const myColor = d3.scaleLinear().domain([varMin, varMax]).range(["white", "blue"]);

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
            .on("click", function(event, d) {
                d3.select(this).style("fill", 'red')
                div.transition()
                    .duration(20)
                    .style("opacity", .9);
                div.html("Lat: " + d.latitude + "<br/>" + "Lon: " + d.longitude + "<br/>" + varName + ": " + parseFloat(d.var).toFixed(2))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            });
    });

    // create legend
    const createLegend = () => {
        const legend = [
            {color: "white", value: varMin},
            {color: "blue", value: varMax}
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