function drawChoropleth(svg, geoData, data, attribute, colorScheme, width, height) {
  let selectedCountries = new Set();
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

  const brush = d3.brush()
  .extent([[0, 0], [width, height]])
  .on("brush end", brushed);

  svg.append("g")
    .attr("class", "map-brush")
    .call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      updateMapViews();
      return;
    }

    const [[x0, y0], [x1, y1]] = selection;

    selectedCountries = new Set(
      geoData.features
        .filter(f => {
          const [cx, cy] = path.centroid(f);
          return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
        })
        .map(f => f.properties.name)
    );
    updateMapViews();
  }

  function updateMapViews() {
    d3.selectAll("path")
      .classed("selected", d => {
        const name = getCountryName(d);
          return name && selectedCountries.has(name);
      })
      .classed("faded", d => {
        const name = getCountryName(d);
          return selectedCountries.size > 0 && (!name || !selectedCountries.has(name));
      });
  }

  function getCountryName(country) {
    return country?.properties?.name ?? null;
  }
    
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
