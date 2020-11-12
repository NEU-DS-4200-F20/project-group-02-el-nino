var parseDate = d3.timeParse('%m/%d/%Y');

d3.csv('data/discharge.csv').then(lineChart);

function lineChart(data){
    console.log(data);

    var maxDate  = d3.max(data, function(d){return d.date; });
    var minDate  = d3.min(data, function(d){return d.date; });
    var maxDischarge = d3.max(data, function(d){return d.discharge;});
    console.log(maxDate, minDate, maxDischarge);

    var width  = 600;
    var height = 500;
    var margin = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    };

    var svg = d3.select('#vis-svg-1')
        .append('svg')
            .attr('width' , width)
            .attr('height', height)
            .style('background', '#efefef');

    var chartGroup = svg
        .append('g')
            .attr('transform','translate(' + margin.left +',' + margin.top + ')');

    var xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, maxDischarge])
        .range([height - margin.bottom - margin.top, 0]);

    var xAxis = d3.axisBottom(xScale);
    chartGroup.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    chartGroup.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis);

    var line = d3.line()
    .x(function(d){return xScale(d.date);})    
    .y(function(d){return yScale(d.discharge);})

    chartGroup.append('path')
        .attr('d', line(data))
        .attr('class', 'dataLine');
}
