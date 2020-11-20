function mrbMap(condition, geographicData, precipData, soilmData) {
    // initialize variables
    let data, varName, sqSize;

    // select appropriate data
    function chooseData(condition) {
        if (condition == 'precip') {
            return precipData
        } else if (condition == 'soilm') {
            return soilmData
        }
    }

    // formatting parameters
    var margin = {top: 30, right: 30, bottom: 30, left: 70},
        width = 940 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // create svg for later appending
    const svg = d3.select("#mrbMap")
        .append('svg')
        .attr('width' , 940)
        .attr('height', 400)
        .attr('viewBox', [0, 0, 1000, 500].join(' '))
        .classed('svg-content', true);
    const g = svg.append("g").attr("id", "map");

    // create projection 
    const projection = d3.geoEquirectangular().scale(700).center([-98.57, 42]);

    // append path for global land projection
    const land = topojson.feature(geographicData, geographicData.objects.land);
    const path = d3.geoPath(projection)(land);
    g.append("path").attr("d", path);

    // draw map
    function drawMap(data, sqSize) {
        // get max and min of variable for scaling purposes
        const varMax = d3.max(data, d => d.var);
        const varMin = d3.min(data, d => d.var);
        //createLegend(varMin, varMax);

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
    }

    
    function updateMap(condition) {
        d3.selectAll("rect").remove()
        data = chooseData(condition)
        drawMap(data, 4)
    }

    // update charts on radio button selection
    const buttons = d3.selectAll('input');
    buttons.on('change', function(d) {
        console.log('button changed to ' + this.value);
        updateMap(this.value)
        
    });

    drawMap(precipData, 5.5)
}