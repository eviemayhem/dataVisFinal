var data = d3.csv('data.csv'); //import data from csv file
data.then(function (data) {
  console.log(data);


  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 100, bottom: 160, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


  // Group the data by industry
  var industryGroup = d3.group(data, d => d.Industry);
  console.log("There are this many industries in the data set: " + industryGroup.size);

  // Calculate the average paid and unpaid maternity/paternity leave per industry
  var industryData = Array.from(industryGroup, ([industry, values]) => {
    return {
      industry: industry,
      paidMaternity: d3.mean(values, d => d.paidMaternityLeave),
      unpaidMaternity: d3.mean(values, d => d.unpaidMaternityLeave),
      paidPaternity: d3.mean(values, d => d.paidPaternityLeave),
      unpaidPaternity: d3.mean(values, d => d.unpaidPaternityLeave)
    };
  });


  //keep the 10 industries with the most data points
  industryData.sort(function (a, b) {
    return b.values - a.values;
  });

  industryData = industryData.slice(0, 20);

  console.log(industryData);

  var keys = ['paidMaternity', 'unpaidMaternity', 'paidPaternity', 'unpaidPaternity'];

  //create a data set with groups and values for paid maternity
  var paidMaternityData = Array.from(industryGroup, ([industry, values]) => {
    return {
      industry: industry,
      paidMaternity: d3.mean(values, d => d.paidMaternityLeave)
    };
  });

  //create a data set with groups and values for paid paternity
  var paidPaternityData = Array.from(industryGroup, ([industry, values]) => {
    return {
      industry: industry,
      paidPaternity: d3.mean(values, d => d.paidPaternityLeave)
    };
  });


    var svg = d3.select("#paidVsUnpaid")
      .append("svg")
      .attr("width", width + margin.left + margin.right + 30)
      .attr("height", height + margin.top + margin.bottom + 40)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(industryData.map(function (d) { return d.industry; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font", "Raleway")
      .attr("transform", "translate(-10,0)rotate(-60)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 50])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(["#6e40aa", "#a05195", "#d45087", "#f95d6a"]);

    //stack the data
    var stackedData = d3.stack()
      .keys(keys)
      (industryData);


    // Show the bars
    svg.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function (d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("x", function (d) { return x(d.data.industry); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

    //add legend to unpaidVsPaidLegend div to the right of the chart
    var legend = svg.append("g")
      .attr("transform", "translate(" + (width + 10) + "," + 20 + ")")
      .selectAll("g")
      .data(keys.slice().reverse())
      .attr("font", "Raleway")
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 15 + ")"; });

    legend.append("rect")
      .attr("x", -19)
      .attr("width", 20)
      .attr("height", 19)
      .attr("fill", color);

    legend.append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });

      // Create a tooltip
var tooltip = d3.select("#paidVsUnpaid")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")






//add title to chart
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .attr("font", "Raleway")
  .style("text-decoration", "underline")
  .text("Paid vs Unpaid Leave by Industry");

//add x axis label
svg.append("text")
  .attr("transform",
    "translate(" + (width / 2) + " ," +
    (height + margin.top + 160) + ")")
  .style("text-anchor", "middle")
  .attr("font", "Raleway")
  .text("Industry");

//add y axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 10)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .attr("font", "Raleway", "semi-bold")
  .text("Average Weeks of Leave");

//add title to legend
svg.append("text")
  .attr("x", width + 10)
  .attr("y", 10)
  .attr("dy", "0.32em")
  .style("font-size", "12px")
  .style("font-weight", "bold")
  .text("Legend");

  








function differenceChart(){

  var paidPaternityLeaveAverage = d3.mean(data, d => d.paidPaternityLeave);
  var paidMaternityLeaveAverage = d3.mean(data, d => d.paidMaternityLeave);
  var unpaidMaternityAverage = d3.mean(data, d => d.unpaidMaternityLeave);
  var unpaidPaternityAverage = d3.mean(data, d => d.unpaidPaternityLeave);

  var paidLeaveDifferenceData = [
    { type: 'Paid Maternity Leave', average: paidMaternityLeaveAverage },
    { type: 'Paid Paternity Leave', average: paidPaternityLeaveAverage }
  ];

  // append the svg object to the body of the page
  var svg = d3.select("#paidLeaveDifference")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // X axis 
  var x = d3.scaleBand()
    .range([0, width])
    .domain(paidLeaveDifferenceData.map(function (d) { return d.type; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(paidLeaveDifferenceData)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.type); })
    .attr("y", function (d) { return y(d.average); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.average); })
    .attr("fill", "#69b3a2")

  // text label for the x axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Type of Leave");

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("# of Weeks");

  //add title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2) + 10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Paid Leave Difference");

}

// differenceChart();

//define update











  //create table of paid paternity and unpaid paternity by industry















});












