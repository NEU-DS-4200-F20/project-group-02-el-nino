// formatting parameters
var width  = 550;
var height = 250;
var margin = {
    top: 50,
    bottom: 50,
    left: 80,
    right: 10
};

// append the svg object to the body of the page
var svg = d3.select("#linechart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// initialize and append x-axis
var x = d3.scaleTime()
    .range([0, width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
    .attr("class","myXaxis")
    .attr("transform", "translate(0," + height + ")")

// x-axis label
svg.append("text")             
    .attr("transform",
        "translate(" + (width/2 - margin.right) + " ," + 
        (height + 40) + ")")
    .style("text-anchor", "middle")
    .text("Date");

// initialize and append y-axis
var y = d3.scaleLinear()
    .range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
    .attr("class","myYaxis")

// create group of points to differentiate from sst map 
const lcYlabel = svg.append("g").attr("id", "lcYlabel");

// Create a function that takes a dataset as input and update the plot:
function updateLC(data, condition) {

    d3.select('#lcYlabel').selectAll('text').remove()

    if (condition == 'precip') {
        varName = 'Precipitation (cm)'
    } else if (condition == 'soilm') {
        varName = 'Soil Moisture (water / soil ratio)'
    } else if (condition == 'discharge') {
        varName = 'River Discharge (ft^3 / s)'
    }

    // y-axis label
    lcYlabel.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average MRB " + varName);

    // set x-axis domain and transition
    x.domain([d3.min(data, function(d) { return d.date }), d3.max(data, function(d) { return d.date }) ]);
    svg.selectAll(".myXaxis").transition()
        .duration(1000)
        .call(xAxis);

    // create the Y axis
    y.domain([d3.min(data, function(d) { return d.var  }), d3.max(data, function(d) { return d.var  }) ]);
    svg.selectAll(".myYaxis")
        .transition()
        .duration(1000)
        .call(yAxis);

    // Create a update selection: bind to the new data
    var u = svg.selectAll(".lineTest")
        .data([data], function(d){ return d.date });

    // Updata the line
    u.enter()
        .append("path")
        .attr("class","lineTest")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.var); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
}

// At the beginning, I run the update function on the first dataset:
updateLC(precipLCData, 'precip')