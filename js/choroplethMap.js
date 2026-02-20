function drawChoropleth(svg, geoData, data, attribute, colorScheme, width, height) {

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
    .attr("d", path)
    .attr("fill", d => {
      const value = valueMap.get(d.properties.name);
      return value ? color(value) : "#ccc";
    })
    .attr("stroke", "#fff");
}
