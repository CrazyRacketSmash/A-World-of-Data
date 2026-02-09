function drawScatterPlot(svg, data, width, height, margin) {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.co2_per_capita))
    .nice()
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.life_expectancy))
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.co2_per_capita))
    .attr("cy", d => y(d.life_expectancy))
    .attr("r", 4)
    .attr("fill", "#fc8d62")
    .attr("opacity", 0.7);

  // X-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("CO₂ emissions per capita");

  // Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Life expectancy (years)");
}
