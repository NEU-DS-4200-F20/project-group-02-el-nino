function oni() {
    d3.csv("data/oni.csv").then(function (data) {

        let maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        let minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        let maxOni = d3.max(data, function(d){return parseFloat(d.oni)});
        let minOni = d3.min(data, function(d){return parseFloat(d.oni)});
    
        let width  = 1200;
        let height = 600;
        let margin = {
            top: 30,
            bottom: 30,
            left: 70,
            right: 100
        };
        let ourBrush = null,
        selectableElements = d3.select(null),
        dispatcher;
    
        let svg = d3.select('#onichart')
            .append('svg')
                .attr('width' , width)
                .attr('height', height)
                .style('background', '#efefef')
            .append('g')
                .attr('transform','translate(' + margin.left +',' + margin.top + ')');
    
        let xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width - margin.left - margin.right]);
    
        let yScale = d3.scaleLinear()
            .domain([minOni, maxOni])
            .range([height - margin.bottom - margin.top, 0]);
    
        let xAxis = d3.axisBottom(xScale);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
            .call(xAxis);
    
        let yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(0, 0)')
            .call(yAxis);

        let	area = d3.area()	
            .x(d => xScale(Date.parse(d.date)))
            .y0(yScale(0.0))
            .y1(d =>  yScale(parseFloat(d.oni)))

        svg.append("linearGradient")				
            .attr("id", "area-gradient")			
            .attr("gradientUnits", "userSpaceOnUse")	
            .attr("x1", 0).attr("y1", yScale(-2.0))
            .attr("x2", 0).attr("y2", yScale(2.0))		
        .selectAll("stop")						
            .data([								
                {offset: "0%", color: "blue"},
                {offset: "50%", color: "blue"},	
                {offset: "50%", color: "red"},				
                {offset: "100%", color: "red"}	
                ])						
        .enter().append("stop")			
            .attr("offset", function(d) { return d.offset; })	
            .attr("stop-color", function(d) { return d.color; });
        
        //blue path
        svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr("d", area);
    
    // Add the points
    svg.selectAll("myCircles")
    .data(data)
    .enter()
    .append("circle")
      .attr("fill", "black")
      .attr("stroke", "none")
      .attr("cx", function(d) { return xScale(Date.parse(d.date)) })
      .attr("cy", function(d) { return yScale(parseFloat(d.oni)) })
      .attr("r", 2)

      

    
    });



        return lineChart;
    
}