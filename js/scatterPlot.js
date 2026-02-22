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

  const brush = d3.brush()
    .extent([[margin.left - 5,0], [width - margin.right + 5, height - margin.bottom]])
    .on("brush end", brushed);

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      updateScatterplot();
      return;
    }

    const [[x0, y0], [x1, y1]] = selection;

    selectedCountries = new Set();

    svg.selectAll("circle")
      .each(function (d) {
        const cx = x(d[xAttr]);
        const cy = y(d[yAttr]);

        if (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) {
          selectedCountries.add(d.country);
        }
      });
    updateScatterplot();
  }
  function updateScatterplot() {
    svg.selectAll("circle")
      .classed("selected", d =>
          selectedCountries.size > 0 && selectedCountries.has(d.country)
        )
      .classed("faded", d =>
        selectedCountries.size > 0 && !selectedCountries.has(d.country)
      );
  }
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
    .attr("opacity", 0.7)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 10);
      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d.country}</strong><br/>
          ${xAttr}: ${d[xAttr].toFixed(2)}<br/>
          ${yAttr}: ${d[yAttr].toFixed(2)}
        `);
    })
    .on("mousemove", event => {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 4);
      tooltip.style("opacity", 0);
    });

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
}
