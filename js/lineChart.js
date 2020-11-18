var formatTime = d3.timeFormat("%Y - %m");



function lineChart(condition) {

    switch (condition) {
        case ("precip") :
            precip();
            break;
        case ("soil") :
            soil();
            break;
        case ("discharge") :
            discharge();
            break;
        default :
            discharge();
            break;
    }
}

function precip() {
    d3.csv("data/precipLine.csv").then(function (data) {

        var maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        var minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        var maxVar = d3.max(data, function(d){return parseFloat(d.precip)});
    
        var width  = 1200;
        var height = 600;
        var margin = {
            top: 50,
            bottom: 50,
            left: 70,
            right: 100
        };
    
        var svg = d3.select('#linechart')
            .append('svg')
                .attr('width' , width)
                .attr('height', height)
                .style('background', '#efefef')
            .append('g')
                .attr('transform','translate(' + margin.left +',' + margin.top + ')');
    
        var xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width - margin.left - margin.right]);
    
        var yScale = d3.scaleLinear()
            .domain([0, maxVar])
            .range([height - margin.bottom - margin.top, 0]);
    
        var xAxis = d3.axisBottom(xScale);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
            .call(xAxis);

        //x axis label
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2 - margin.right) + " ," + 
                (height - margin.bottom - 10) + ")")
        .style("text-anchor", "middle")
        .text("Date");
    
        var yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis);

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Height (cm)"); 
        
        //title
        svg.append("text")
            .attr("x", (width/2 - margin.right))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "24px")   
            .text("Precipitation Chart");
    
        //line
        svg.append('path')
            .datum(data)
            .attr('class', 'dateLine')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr('d', d3.line()
                .x(function(d){return xScale(Date.parse(d.date));})
                .y(function(d){return yScale(parseFloat(d.precip));})
        );
    
    // Add the points
    svg.selectAll("myCircles")
    .data(data)
        .enter()
        .append("circle")
        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("cx", function(d) { return xScale(Date.parse(d.date)) })
        .attr("cy", function(d) { return yScale(parseFloat(d.precip)) })
        .attr("r", 2)
    
    
    });
        return lineChart;
    
}

function soil() {
    d3.csv("data/soilmLine.csv").then(function (data) {

        var maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        var minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        var maxVar = d3.max(data, function(d){return parseFloat(d.soilm)});
        console.log(maxDate, minDate, maxVar);

    
        var width  = 1200;
        var height = 600;
        var margin = {
            top: 30,
            bottom: 50,
            left: 70,
            right: 70
        };
    
        var svg = d3.select('#linechart')
            .append('svg')
                .attr('width' , width)
                .attr('height', height)
                .style('background', '#efefef')
            .append('g')
                .attr('transform','translate(' + margin.left +',' + margin.top + ')');
    
        var xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width - margin.left - margin.right]);
    
        var yScale = d3.scaleLinear()
            .domain([0, maxVar + 0.03])
            .range([height - margin.bottom - margin.top, 0]);
    
        var xAxis = d3.axisBottom(xScale);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
            .call(xAxis);

        //x axis label
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2 - margin.right) + " ," + 
                (height - margin.bottom + 5) + ")")
        .style("text-anchor", "middle")
        .text("Date");
    
        var yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis);

        
        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Surface Soil Wetness (soil moisture / max)");
            
        //title
        svg.append("text")
            .attr("x", (width/2 - margin.right))             
            .attr("y", 0 - (margin.top / 2) + 15)
            .attr("text-anchor", "middle")  
            .style("font-size", "24px")   
            .text("Soil Moisture in the MRB");
    
        //line 
        svg.append('path')
            .datum(data)
            .attr('class', 'dateLine')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr('d', d3.line()
            .x(function(d){return xScale(Date.parse(d.date));})
            .y(function(d){return yScale(parseFloat(d.soilm));})
        );
    
        // Add the points
        svg.selectAll("myCircles")
        .data(data)
            .enter()
            .append("circle")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function(d) { return xScale(Date.parse(d.date)) })
            .attr("cy", function(d) { return yScale(parseFloat(d.soilm)) })
            .attr("r", 2)
    
    
    });
        return lineChart;
    
    }


function discharge() {
    d3.csv("data/discharge.csv").then(function (data) {

    var maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
    var minDate  = d3.min(data, function(d){return Date.parse(d.date); });
    var maxDischarge = d3.max(data, function(d){return parseInt(d.discharge)});

    var width  = 1200;
    var height = 600;
    var margin = {
        top: 50,
        bottom: 50,
        left: 100,
        right: 100
    };

    var svg = d3.select('#linechart')
        .append('svg')
            .attr('width' , width)
            .attr('height', height)
            .style('background', '#efefef')
        .append('g')
            .attr('transform','translate(' + margin.left +',' + margin.top + ')');

    var xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width - margin.left - margin.right]);

    var yScale = d3.scaleLinear()
        .domain([0, maxDischarge])
        .range([height - margin.bottom - margin.top, 0]);

    var xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
        .call(xAxis);

    //x axis label
    svg.append("text")             
    .attr("transform",
            "translate(" + ((width/2) - margin.right) + " ," + 
            (height - margin.bottom -7) + ")")
    .style("text-anchor", "middle")
    .text("Date");

    var yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis);

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Discharge (ft^3/s)");
        
    //title
    svg.append("text")
        .attr("x", (width/2 - margin.right))             
        .attr("y", 0 - (margin.top / 2) + 5)
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")   
        .text("Mississippi River Discharge");


   svg.append('path')
    .datum(data)
    .attr('class', 'dateLine')
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
      .attr('d', d3.line()
      .x(function(d){return xScale(Date.parse(d.date));})
      .y(function(d){return yScale(d.discharge);})
    );

    // Add the points
    svg.selectAll("myCircles")
    .data(data)
    .enter()
    .append("circle")
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("cx", function(d) { return xScale(Date.parse(d.date)) })
      .attr("cy", function(d) { return yScale(d.discharge) })
      .attr("r", 2)


});
    return lineChart;

}

