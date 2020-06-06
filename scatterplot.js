/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

//Pan+Drag: Hold the curser on a circle to pan-drag
//Both x-axis and y-axis are scaled automatically

//Zoom: Move your finger away on a circle to zoom in
//Scroll backward (or move your finger in) on a mouse to zoom out
//Both x-axis and y-axis are scaled automatically

//Country Name or Tooltip: Appears next to the country
//Moves automatically with pan-drag-zoom funtion. Attempted bonus points.

    //Define Margin
    var margin = {top: 50, right: 80, bottom: 50, left: 80}, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;
    
    //Define SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colors = ["#b02343", "#69bfb8", "#f29113", "#5d9879",
                    "#d9270d", "#831d38", "#6bda3c", "#a3a8b2", 
                    "#ebbbc3", "#bc9b80", "#2949e8", "#523606", 
                    "#897b82", "#ba94d6", "#d80d89"]

    //Define Scales   
    var xScale = d3.scaleLinear()
        .domain([0,16]) //Need to redefine this later after loading the data
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0,450]) //Need to redfine this later after loading the data
        .range([height, 0]);
    
    //Define Tooltip here
    
    //Define Axis.
    var xAxis = d3.axisBottom(xScale).tickPadding(5);
    var yAxis = d3.axisLeft(yScale).tickPadding(5);
    
    //Getting data from csv.
    // Define domain for xScale and yScale
    var data_array = [];
    var object_array = [];
    d3.csv("scatterdata.csv").then(function (data) {
        data.forEach(function (d) {
            var obj = {};
            for (var key in d) {
                if (key === 'country') {
                    obj.name = d.country; 
                    obj.country = d.country;
                }
                if (key === 'gdp') {
                    obj.gdp = Number(d.gdp);
                }
                if (key === 'population') {
                    obj.population = Number(d.population);
                }
                if (key === 'ecc') {
                    obj.epc = Number(d.ecc);
                }
                if (key === 'ec') {
                    obj.total = Number(d.ec);
                }
                data_array.push(obj)
            }
        }) 
        for(var i = 0; i < data_array.length; i++) {
            if (i == 0) {
                object_array.push(data_array[i]);
            }
            if (i%5 === 0 && i != 0) {
                object_array.push(data_array[i]);
            }
        }
//        console.log(object_array)

    //Redefining domain for x in accordance to data values.
    xScale
        .domain([0, d3.max(object_array, function(d) { return d.gdp + 2; })]);

    //Redefining domain for y in accordance to data values.
    yScale
        .domain([0, d3.max(object_array, function(d) { return d.epc + 60; })]);  
        
    // appending 
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);  
        
     // Clipping so text and circles dont appear outside axes upon zooming.
    svg.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height);
    const main = svg.append('g')
        .attr('class', 'main')
        .attr('clip-path', 'url(#clip)');
    
    // Function used to scale circle area later on so that it isnt too big.
    var sqrtScale = d3.scaleSqrt()
        .domain([0, 317])
        .range([0, 30]);
    // Initializing index to iterate through colors array.
    var index = 0;
    //Drawing Scatterplot.
    var view = main.selectAll(".dot")
        .data(object_array)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return sqrtScale(Math.sqrt((d.epc*d.population)))})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", () => {
            return colors[index++];
        })
        //Add .on("mouseover", .....
        //Add Tooltip.html with transition and style
        //Then Add .on("mouseout", ....
    
        //Tooltip appears when mouse over circle.
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(
                "<center>" + d.name + "</center>" + 
                "<div style='overflow: hidden;'>" +
                "<p style='float: left;'> Population</p>" + '&nbsp' +'&nbsp' + ":" + 
                "<p style='float: right;'>" + d.population + " Million</p>" + "<br>" +
                "<p style='float: left;'> GDP</p>" + '&nbsp'+ '&nbsp'+ '&nbsp'+ '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + " :" +
                "<p style='float: right;'> $" + d.gdp + " Trillion</p>" + "<br>" +
                "<p style='float: left;'> EPC</p>" + '&nbsp'+ '&nbsp'+ '&nbsp'+ '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + " :" + 
                "<p style='float: right;'>" + d.epc + " Million BTUs</p>" + "<br>" +
                "<p style='float: left;'> Total</p>" + '&nbsp'+ '&nbsp'+ '&nbsp'+ '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + " :" + 
                "<p style='float: right;'>" + d.total + " Trillion BTUs</p>" 
            )	
                //event listener to position tooltip.
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })	
        //Tooltip disappears when mouse not over circles.
        .on("mouseout", () => {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
    //Initializing zoom functionality with properties.
    var zoom = d3.zoom()
      .scaleExtent([0.5, 32])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);
        
    //Drawin Country Names on canvas and using main 
    //so text does not appear outside axes.
    var countries = main.selectAll(".text")
        .data(object_array)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.name; });
    
    var circles_array = [];
    var new_obj = {};
    for (var loop=0;loop<3;loop++){
        if (loop === 0) {
            //circle representation for 1 trillion BTUs.
            new_obj.total1 = sqrtScale(31.622776601683793)
        }
        if (loop === 1) {
             //circle representation for 10 trillion BTUs.
            new_obj.total2 = sqrtScale(100)
        }
        if (loop === 2) {
            //circle representation for 100 trillion BTUs.
            new_obj.total3 = sqrtScale(316.227766016837933)
        }
    }
    circles_array.push(new_obj);
    console.log(circles_array);
    
    // Adding legend to graph. Appended rectangle
    // background, circles and text to svg.
    svg.append('rect')
        .attr("class", "legend")
        .attr("x", xScale(11))
        .attr("y", yScale(180))
        .attr("height", 190)
        .attr("width", xScale(4))
        .style("fill", "#D3D3D3")
    svg.append("circle")
        .data(circles_array)
        .attr("cx",xScale(14))
        .attr("cy",yScale(150))
        .attr("r", function(d) {
           return d.total1})
        .style("fill", "white")
    svg.append("circle")
        .data(circles_array)
        .attr("cx",xScale(14))
        .attr("cy",yScale(120))
        .attr("r", function(d) {
           return d.total2})
        .style("fill", "white")
    svg.append("circle")
        .data(circles_array)
        .attr("cx",xScale(14))
        .attr("cy",yScale(70))
        .attr("r", function(d) {
           return d.total3})
        .style("fill", "white")
    svg.append("text")
        .attr("class", "label")
        .attr("y", yScale(150))
        .attr("x", xScale(11))
        .style("text-anchor", "left")
        .style("fill", "black")
        .attr("font-size", "12px")
        .text("1 Trillion BTUs")
    svg.append("text")
        .attr("class", "label")
        .attr("y", yScale(120))
        .attr("x", xScale(11))
        .style("text-anchor", "left")
        .style("fill", "black")
        .attr("font-size", "12px")
        .text("10 Trillion BTUs")
    svg.append("text")
        .attr("class", "label")
        .attr("y", yScale(70))
        .attr("x", xScale(11))
        .style("text-anchor", "left")
        .style("fill", "black")
        .attr("font-size", "12px")
        .text("100 Trillion BTUs")
    svg.append("text")
        .attr("class", "label")
        .attr("y", yScale(16))
        .attr("x", xScale(13))
        .style("text-anchor", "middle")
        .style("fill", "green")
        .attr("font-size", "12px")
        .text("Total Energy Consumption")
        
        
 //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.ticks(6))
      .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010")
          
    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "black")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
    
    //Calling to enable zoom function.
    svg.call(zoom)

   function zoomed() {
    // creating new scale ojects based on zoom events
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
    // updating axes and assigning scaled coordinates 
    // to text and circle on graph.
    svg.select(".x.axis").call(xAxis.scale(new_xScale));
    svg.select(".y.axis").call(yAxis.scale(new_yScale));
    view.data(object_array)
     .attr('cx', function(d) {return new_xScale(d.gdp)})
     .attr('cy', function(d) {return new_yScale(d.epc)});
   countries.data(object_array)
    .attr('x', function(d) {return new_xScale(d.gdp)})
    .attr('y', function(d) {return new_yScale(d.epc)});
   }

});    
    