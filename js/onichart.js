function oni() {
    d3.csv("data/oni.csv").then(function (data) {

        let maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        let minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        let maxOni = d3.max(data, function(d){return parseFloat(d.oni)});
        let minOni = d3.min(data, function(d){return parseFloat(d.oni)});
    
        let width  = 940;
        let height = 400;
        let margin = {
            top: 50,
            bottom: 50,
            left: 100,
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
        
        //x axis label
        svg.append("text")             
        .attr("transform",
                "translate(" + ((width/2) - margin.right) + " ," + 
                (height - margin.bottom - 7) + ")")
        .style("text-anchor", "middle")
        .text("Date");
        
    
        let yAxis = d3.axisLeft(yScale);
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
            .text("Oceanic Niño Index (ONI)");

        //title
        svg.append("text")
            .attr("x", (width/2 - margin.right))             
            .attr("y", 0 - (margin.top / 2) + 5)
            .attr("text-anchor", "middle")  
            .style("font-size", "24px")   
            .text("ONI Chart");

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
        
        // blue path
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
    //return lineChart;
    
}