// @TODO: YOUR CODE HERE!

var svgWidth = 900
var svgHeight = 600;

var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Retrieve data from the CSV file and execute everything below


d3.csv("assets/data/data.csv").then(function(statesData){

    console.log(statesData);

    statesData.forEach(function(myData) {
        myData.poverty = +myData.poverty
        myData.healthcare = +myData.healthcare    
    })

    // xLinearScale 

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(statesData, d => d.poverty) - 1, d3.max(statesData, d => d.poverty)])
        .range([0, chartWidth])

    // yLinearScale

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(statesData, d => d.healthcare) - 1, d3.max(statesData, d => d.healthcare)])
        .range([chartHeight, 0])

    // Create initial axis functions

    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis

    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis

    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles

    var circlesGroup = chartGroup.selectAll("circle")

        .data(statesData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 13)
        .attr("fill", "#6495ED")
        .attr("opacity", ".5");

    // Append text to circles 

    var circlesGroup = chartGroup.selectAll()
        .data(statesData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "9px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    // Initialize tool tip

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .style("padding", "5px")
        .style("text-align", "center")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("font-size", "14px")
        .offset([100, -70])
        .html(function (d) {
            return (`${d.state}<br><br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
        });

    // Create tooltip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip

    circlesGroup

        // mouseover event

        .on("mouseover", function (myData) {
        toolTip.show(myData, this);

    })
        // mouseout event

        .on("mouseout", function (myData) {
        toolTip.hide(myData);

    });

    // Create axes labels

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("HealthCare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

});