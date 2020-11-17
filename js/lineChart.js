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
    d3.csv("data/precip.csv").then(function (data) {

        var maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        var minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        var maxVar = d3.max(data, function(d){return parseFloat(d.precip)});
    
        var width  = 1200;
        var height = 600;
        var margin = {
            top: 30,
            bottom: 30,
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
    
        var yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis);
    
    
       svg.append('path')
        .datum(data)
        .attr('class', 'dateLine')
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
          .attr('d', d3.line()
          .x(function(d){return xScale(Date.parse(d.date));})
          .y(function(d){return yScale(d.precip);})
        );
    
    // Add the points
    let points = svg.append('g')
      .selectAll('.linePoint')
        .data(data);
    
    
    });
        return lineChart;
    
}

function soil() {
    d3.csv("data/soilm.csv").then(function (data) {

        var maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        var minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        var maxVar = d3.max(data, function(d){return parseFloat(d.soilm)});
        console.log(maxDate, minDate, maxVar);
    
        var width  = 1200;
        var height = 600;
        var margin = {
            top: 30,
            bottom: 30,
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
    
        var yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis);
    
    
       svg.append('path')
        .datum(data)
        .attr('class', 'dateLine')
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
          .attr('d', d3.line()
          .x(function(d){return xScale(Date.parse(d.date));})
          .y(function(d){return yScale(d.soilm);})
        );
    
    // Add the points
    let points = svg.append('g')
      .selectAll('.linePoint')
        .data(data);
    
    
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
        top: 30,
        bottom: 30,
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
        .domain([0, maxDischarge])
        .range([height - margin.bottom - margin.top, 0]);

    var xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis);


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

