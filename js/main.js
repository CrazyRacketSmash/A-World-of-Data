const width = 600;
const height = 400;
const margin = { top: 30, right: 30, bottom: 50, left: 60 };

const co2Svg = d3
  .select("#co2-histogram")
  .attr("width", width)
  .attr("height", height);

const lifeExpectancySvg = d3
  .select("#life-expectancy-histogram")
  .attr("width", width)
  .attr("height", height);

const scatterPlotSvg = d3
  .select("#scatter-plot")
  .attr("width", width)
  .attr("height", height);

const co2MapSvg = d3
  .select("#co2-map")
  .attr("width", width)
  .attr("height", height);

const lifeMapSvg = d3
  .select("#life-map")
  .attr("width", width)
  .attr("height", height);

Promise.all([
  d3.csv("data/co2_life_expectancy.csv"),
  d3.json("data/world.geojson")
]).then(([data, geoData]) => {

    data.forEach(d => {
      d.co2_per_capita = +d.co2_per_capita;
      d.life_expectancy = +d.life_expectancy;
    });

    drawCO2Histogram(co2Svg, data, width, height, margin);
    drawLifeExpectancyHistogram(lifeExpectancySvg, data, width, height, margin);
    drawScatterPlot(scatterPlotSvg, data, width, height, margin);
    drawChoropleth(co2MapSvg, geoData, data, "co2_per_capita", d3.interpolateBlues, width, height);
    drawChoropleth(lifeMapSvg, geoData, data, "life_expectancy", d3.interpolateGreens, width, height);
});
