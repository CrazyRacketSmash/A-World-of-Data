function drawChoropleth(svg, geoData, data, attribute, colorScheme, width, height) {
  const dataByCountry = new Map(
    data.map(d => [d.country, d])
  );
  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], geoData);

  const path = d3.geoPath().projection(projection);

  const valueMap = new Map();
  data.forEach(d => {
    valueMap.set(d.country, d[attribute]);
  });

  const values = data.map(d => d[attribute]);

  const color = d3.scaleSequential()
    .domain(d3.extent(values))
    .interpolator(colorScheme);

  svg.selectAll("path")
    .data(geoData.features)
    .join("path")
      .on("mouseover", function (event, d) {
        const countryName = d.properties.name;
        const countryData = dataByCountry.get(countryName);

        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 1.5);

        if (countryData) {
          tooltip
            .style("opacity", 1)
            .html(`
              <strong>${countryName}</strong><br/>
              ${attribute}: ${countryData[attribute].toFixed(2)}
            `);
        } else {
          tooltip
            .style("opacity", 1)
            .html(`
              <strong>${countryName}</strong><br/>
              No data
            `);
        }
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
    .attr("d", path)
    .attr("fill", d => {
      const value = valueMap.get(d.properties.name);
      return value ? color(value) : "#ccc";
    })
    .attr("stroke", "#fff");
}
