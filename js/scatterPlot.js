function drawScatterPlot({
    svg,
    data,
    width,
    height,
    margin,
    xAttr,
    yAttr,
    colorAttr = null,
    colorScheme = null
}) {
  // // Clear previous render
  svg.selectAll("*").remove();

  // Scales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d[xAttr]))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d[yAttr]))
    .range([height - margin.bottom, margin.top]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // Points
  svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d[xAttr]))
    .attr("cy", d => y(d[yAttr]))
    .attr("r", 4)
    .attr("fill", d =>
      colorAttr && colorScheme ? colorScheme(d[colorAttr]) : "#4682b4"
    )
    .attr("opacity", 0.7);

  // X-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text(xAttr);

  // Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text(yAttr.replaceAll("_", " "));

    console.log(data[0][xAttr]);
}
