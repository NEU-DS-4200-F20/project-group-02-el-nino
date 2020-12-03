function oni() {
    d3.csv("data/oni.csv").then(function (data) {

        let maxDate  = d3.max(data, function(d){return Date.parse(d.date); });
        let minDate  = d3.min(data, function(d){return Date.parse(d.date); });
        let maxOni = d3.max(data, function(d){return parseFloat(d.oni)});
        let minOni = d3.min(data, function(d){return parseFloat(d.oni)});
    
        var width  = 550;
        var height = 310;
        var margin = {
            top: 10,
            bottom: 80,
            left: 80,
            right: 30
        };
    
        let svg = d3.select('#onichart')
            .append('svg')
                .attr('width' , width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append('g')
                .attr('transform','translate(' + margin.left +',' + margin.top + ')');
    
        let xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);
    
        let yScale = d3.scaleLinear()
            .domain([minOni, maxOni])
            .range([height - margin.bottom - margin.top, 0]);
    
        let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%m/%Y"))
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
            .call(xAxis);
        
        // x-axis label
        svg.append("text")             
        .attr("transform",
                "translate(" + ((width/2) - margin.right + 22) + " ," + 
                (height - margin.bottom + 30) + ")")
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
            .attr("x",0 - (height / 2) + 45)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Oceanic Niño Index (ONI)");

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
                {offset: "0%", color: "#5597E1"},
                {offset: "50%", color: "#5597E1"},	
                {offset: "50%", color: "#E15555"},				
                {offset: "100%", color: "#E15555"}	
                ])						
        .enter().append("stop")			
            .attr("offset", function(d) { return d.offset; })	
            .attr("stop-color", function(d) { return d.color; });
        
        // blue path
        svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr("d", area);

        //adding text to show el nino 
        svg.append("text")
            .attr('font-size', '0.8em')
            .attr('y', 80)
            .attr('x', 255)
            .attr('fill', "white")
            .text("El Niño");

        //adding text to show la nina
        svg.append("text")
            .attr('font-size', '0.8em')
            .attr('y', 150)
            .attr('x', 8)
            .attr('fill', "white")
            .text("La Niña");

        // create tooltip div
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("border-width", "5px")
            .style("border-radius", "7px")
            
        //months to use in tool tip
        var months = ["February","March","April","May","June","July","August","September","October","November","December", "January"];

        function oniCheck(d) {
            if (d.oni  > 0) {
                return "El Niño"
            }
            else {
                return "La Niña";
            }
        }

        // Add the points
        svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function(d) { return xScale(Date.parse(d.date)) })
            .attr("cy", function(d) { return yScale(parseFloat(d.oni)) })
            .attr("r", 3.5)
            .on("click", function (event, d) {
                div.transition()
                  .duration(20)
                  .style("opacity", .9);
                div.html(months[new Date(d.date).getMonth()] + " " 
                    + d.date.substring(0,4) + "<br/>" +"ONI Value: " + 
                    parseFloat(d.oni) + "<br/>" + oniCheck(d))
                  .style("left", (event.pageX) + "px")
                  .style("top", (event.pageY - 20) + "px");
              });
    
    });
    
}