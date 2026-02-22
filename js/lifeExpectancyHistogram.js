function drawLifeExpectancyHistogram(svg, data, width, height, margin) {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.life_expectancy))
    .nice()
    .range([margin.left, width - margin.right]);

  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(20)
    .value(d => d.life_expectancy)(data);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const brush = d3.brushX()
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
    .on("brush end", brushed);

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      return;
    }

    const [x0, x1] = selection.map(x.invert);

    selectedCountries = new Set(
      data
        .filter(d => d.co2_per_capita >= x0 && d.co2_per_capita <= x1)
        .map(d => d.country)
    );
  }
  
  svg.append("g")
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .on("mouseover", function (event, d) {
        d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>Range:</strong> ${d.x0.toFixed(1)} – ${d.x1.toFixed(1)}<br/>
            <strong>Countries:</strong> ${d.length}
          `);
      })
      .on("mousemove", event => {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "none");
        tooltip.style("opacity", 0);
      })
    .attr("x", d => x(d.x0) + 1)
    .attr("y", d => y(d.length))
    .attr("width", d => x(d.x1) - x(d.x0) - 1)
    .attr("height", d => y(0) - y(d.length))
    .attr("fill", "#8da0cb");

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
    .text("Life expectancy (years)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Number of countries");
}
