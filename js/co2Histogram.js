function drawCO2Histogram(svg, data, width, height, margin) {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.co2_per_capita))
    .nice()
    .range([margin.left, width - margin.right]);

  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(20)
    .value(d => d.co2_per_capita)(data);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", d => x(d.x0) + 1)
    .attr("y", d => y(d.length))
    .attr("width", d => x(d.x1) - x(d.x0) - 1)
    .attr("height", d => y(0) - y(d.length))
    .attr("fill", "#69b3a2");

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("CO2 emissions per capita");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Number of countries");
}