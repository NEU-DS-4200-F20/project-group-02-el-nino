// function to create map of MRB conditions (top right visualization) based on user selection
function mrbMap() {

    let currentVar = 'precip';

    // color scale function
    const precipColor = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateBlues);
    const soilmColor = d3.scaleSequential()
        .domain([0, 0.5])
        .interpolator(d3.interpolateOranges);

    // create projection 
    const projection = d3.geoEquirectangular().scale(700).center([-98.57, 42]);

    function chart(geographicData, precipData, soilmData) {

        // create tooltip div for details-on-demand
        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // dimensions
        const width = 650, height = 225;
        const margin = {
            top: 50,
            bottom: 0,
            left: 0,
            right: 0
        };

        // create svg
        const svg = d3.select("#mrbMap")
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', [0, 0, 1000, 500].join(' '))
            .classed('svg-content', true);

        // create groups
        const g = svg.append("g").attr("id", "mrbG");
        const mapG = g.append("g").attr("id", "map2");
        const precipPts = g.append("g").attr("id", "precipPts");
        const soilmPts = g.append("g").attr("id", "soilmPts").attr("visibility", "hidden");
        const txtG = svg.append("g").attr("id", "disTxtG").attr("visibility", "hidden");
        txtG.append("text")
            .attr("transform",
                "translate(" + (width / 2 - margin.right + 220) + " ," +
                (height - margin.bottom + 80) + ")")
            .style("text-anchor", "middle")
            .text("No map data for river discharge");

        // append path for global land projection
        const land = topojson.feature(geographicData, geographicData.objects.land);
        const path = d3.geoPath(projection)(land);
        mapG.append("path").attr("d", path);

        // create and draw legend
        // based on conventions of ..............
        const precipLegend = legend({
            color: d3.scaleSequential([0, 100], d3.interpolateBlues),
            title: 'Precipitation (cm)'
        });
        const soilmLegend = legend({
            color: d3.scaleSequential([0, 0.5], d3.interpolateOranges),
            title: 'Soil Moisture (water/soil ratio)'
        });

        d3.select("#legendDiv_precip")
            .node()
            .appendChild(precipLegend)

        d3.select("#legendDiv_soilm")
            .node()
            .appendChild(soilmLegend)

        // add squares to map and apply tooltip behavior
        precipPts.selectAll("rect")
            .data(precipData)
            .enter()
            .append("rect")
            .attr("x", d => projection([d.longitude, d.latitude])[0])
            .attr("y", d => projection([d.longitude, d.latitude])[1])
            .attr("width", 4)
            .attr("height", 4)
            .attr("fill", d => precipColor(d.var))
            .on("click", function (event, d) {
                d3.select(this).style("fill", 'red')
                div.transition()
                    .duration(20)
                    .style("opacity", .9);
                div.html("Lat: " + d.latitude + "<br/>" + "Lon: " + d.longitude + "<br/>" + varName + ": " + parseFloat(d.var).toFixed(2))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            });
        soilmPts.selectAll("rect")
            .data(soilmData)
            .enter()
            .append("rect")
            .attr("x", d => projection([d.longitude, d.latitude])[0])
            .attr("y", d => projection([d.longitude, d.latitude])[1])
            .attr("width", 4)
            .attr("height", 4)
            .attr("fill", d => soilmColor(d.var))
            .on("click", function (event, d) {
                d3.select(this).style("fill", 'red')
                div.transition()
                    .duration(20)
                    .style("opacity", .9);
                div.html("Lat: " + d.latitude + "<br/>" + "Lon: " + d.longitude + "<br/>" + varName + ": " + parseFloat(d.var).toFixed(2))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            });

        // update the map as radio buttons are selected
        function updateMap(condition) {
            const mapVars = {
                "precip": "#precipPts",
                "soilm": "#soilmPts"
            };

            if (currentVar === 'discharge') {
                d3.select('#mrbG').attr("visibility", "visible");
                d3.select('#disTxtG').attr("visibility", "hidden");
            } else {
                d3.select(mapVars[currentVar]).attr("visibility", "hidden");
            }
            if (condition === 'discharge') {
                d3.select('#mrbG').attr("visibility", "hidden");
                div.style("opacity", "0");
                d3.select('#disTxtG').attr("visibility", "visible");
            } else {
                d3.select(mapVars[condition]).attr("visibility", "visible");
            }

            currentVar = condition;
        }

        // update charts on radio button selection
        const buttons = d3.selectAll('input');
        buttons.on('change', function (d) {
            updateMap(this.value);
        });

        return chart;
    }

    chart.updateTime = function (timePrecipData, timeSoilmData) {
        if (!arguments.length) return;
        
        const precipRects = d3.select('#precipPts').selectAll('rect');
        precipRects
            .data(timePrecipData)
            .transition().duration(750).attr("fill", d => precipColor(d.var))

        const soilmRects = d3.select('#soilmPts').selectAll('rect')
        soilmRects.data
            (timeSoilmData).exit().remove();
        soilmRects.transition().duration(100).attr("fill", d => soilmColor(d.var))
    }

    return chart;
}