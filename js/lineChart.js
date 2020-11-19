//var formatTime = d3.timeFormat("%Y - %m");

// create line chart of MRB variable, depending on user selection of radio button
function lineChart(condition) {

    // select appropriate data depending on input value
    if (condition == "precip") {
        file = "data/precipLine.csv"
        varName = "Precipitation"
    } else if (condition == "soilm") {
        file = "data/soilmLine.csv"
        varName = "Soil Moisture"
    } else if (condition == "discharge") {
        file = "data/discharge.csv"
        varName = "River Discharge"
    }

    // read data and create line chart
    d3.csv(file).then(function (data) {
        console.log(data)

        // extremes for legends/math
        var maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        var minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        var maxVar = d3.max(data, function(d){return parseFloat(d.var)});
    
        // formatting parameters
        var width  = 940;
        var height = 600;
        var margin = {
            top: 50,
            bottom: 50,
            left: 70,
            right: 100
        };

        // visualization body
        var svg = d3.select("#linechart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style('background', '#efefef')
	        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // x-axis scale
        var xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width - margin.left - margin.right]);

        // y-axis scale
        var yScale = d3.scaleLinear()
            .domain([0, maxVar])
            .range([height - margin.bottom - margin.top, 0]);

        // x-axis
        var xAxis = d3.axisBottom(xScale);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
            .call(xAxis);

        // x-axis label
        svg.append("text")             
            .attr("transform",
                "translate(" + (width/2 - margin.right) + " ," + 
                (height - margin.bottom - 10) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        // y-axis
        var yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis);

        // y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Height (cm)"); 

        // title
        svg.append("text")
            .attr("x", (width/2 - margin.right))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "24px")   
            .text("Precipitation Chart");

        // line
        svg.append('path')
            .datum(data)
            .attr('class', 'dateLine')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr('d', d3.line()
                .x(function(d){return xScale(Date.parse(d.date));})
                .y(function(d){return yScale(parseFloat(d.var));})
            );

        // add points
        svg.selectAll("myCircles")
        .data(data)
            .enter()
            .append("circle")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function(d) { return xScale(Date.parse(d.date)) })
            .attr("cy", function(d) { return yScale(parseFloat(d.var)) })
            .attr("r", 2)

    })
}