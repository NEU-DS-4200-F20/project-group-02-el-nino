// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 70},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#linechart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Initialise a X axis:
var x = d3.scaleTime().range([0,width]);
var xAxis = d3.axisBottom().scale(x);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class","myXaxis")

// Initialize an Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
    .attr("class","myYaxis")

// Create a function that takes a dataset as input and update the plot:
function updateLC(data) {

    // Create the X axis:
    x.domain([d3.min(data, function(d) { return d.date }), d3.max(data, function(d) { return d.date }) ]);
    svg.selectAll(".myXaxis").transition()
        .duration(1000)
        .call(xAxis);

    // create the Y axis
    y.domain([0, d3.max(data, function(d) { return d.var  }) ]);
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
updateLC(precipData)