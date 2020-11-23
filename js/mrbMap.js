// function to create map of MRB conditions (top right visualization) based on user selection
function mrbMap(condition, geographicData, precipData, soilmData) {

    // select appropriate data and title based on provided condition
    function chooseData(condition) {
        if (condition == 'precip') {
            return [precipData, 'Precipitation (cm)']
        } else if (condition == 'soilm') {
            return [soilmData, 'Soil Moisture (water / soil ratio)']
        }
    }

    // create tooltip div for details-on-demand
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // formatting parameters
    var width  = 650;
    var height = 225;
    var margin = {
        top: 50,
        bottom: 50,
        left: 0,
        right: 0
    };

    // create svg for later appending
    const svg = d3.select("#mrbMap")
        .append('svg')
        .attr('width' , width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', [0, 0, 1000, 500].join(' '))
        .classed('svg-content', true);

    // create group of points to differentiate from sst map 
    const mrbPts = svg.append("g").attr("id", "mrbPts");

    // create projection 
    const projection = d3.geoEquirectangular().scale(700).center([-98.57, 42]);

    // append path for global land projection
    const land = topojson.feature(geographicData, geographicData.objects.land);
    const path = d3.geoPath(projection)(land);
    mrbPts.append("path").attr("d", path);

    // draw map
    function drawMap(data, varName) {

        // get max and min of variable for scaling purposes
        const varMax = d3.max(data, d => d.var);
        const varMin = d3.min(data, d => d.var);
        console.log(varMin)
        console.log(varMax)

        // create and draw legend
        // based on conventions of ...)
        const myLegend =  legend({color: d3.scaleSequential([varMin, varMax], d3.interpolateRdBu),
            title: varName
        });
        d3.select("#legendDiv")
            .node()
            .appendChild(myLegend)
        
        // color scale function
        const myColor = d3.scaleSequential()
            .domain([varMin, varMax])
            .interpolator(d3.interpolateRdBu);

        // add squares to map and apply tooltip behavior
        mrbPts.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => projection([d.longitude, d.latitude])[0])
            .attr("y", d => projection([d.longitude, d.latitude])[1])
            .attr("width", 4)
            .attr("height", 4)
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

        // allow zooming and panning
        const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
        svg.call(zoom);

        function zoomed(event, d) {
            mrbPts.attr("transform", event.transform);
        }

        return [varMin, varMax]
    }

    // update the map as radio buttons are selected
    function updateMap(condition) {
        d3.select('#mrbPts').selectAll('rect').remove()
        d3.select("#legendDiv").remove()
        if (condition == 'discharge') {
            const dischargeMap = svg.append("g").attr("id", "disMap");
            dischargeMap.append("text")             
                .attr("transform",
                    "translate(" + (width/2 - margin.right + 220) + " ," + 
                    (height - margin.bottom + 80) + ")")
                .style("text-anchor", "middle")
                .attr("fill", "white")
                .text("No map data for river discharge");
        } else {
            d3.select('#disMap').selectAll('text').remove()
            output = chooseData(condition)
            data = output[0]
            varName = output[1]
            drawMap(data, varName)
        }
    }

    // update charts on radio button selection
    const buttons = d3.selectAll('input');
    buttons.on('change', function(d) {
        updateMap(this.value)
    });

    drawMap(precipData, 'Precipitation (cm)')
}