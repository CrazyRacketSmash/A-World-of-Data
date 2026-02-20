const width = 600;
const height = 400;
const margin = { top: 30, right: 30, bottom: 50, left: 60 };

const attributeOptions = {
  co2_per_capita: {
    label: "CO2 per Capita",
    colorScheme: d3.interpolateReds
  },
  life_expectancy: {
    label: "Life Expectancy",
    colorScheme: d3.interpolateGreens
  },
  gdp_per_capita: {
    label: "GDP per Capita",
    colorScheme: d3.interpolatePurples
  },
  energy_per_capita: {
    label: "Energy Use per Capita",
    colorScheme: d3.interpolateBlues
  }
};

let selectedAttribute = "co2_per_capita";
let data;

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
  d3.csv("data/world_indicators.csv"), d3.json("data/world.geojson")]).then(([loadedData, geoData]) => {
  data = loadedData;

  data.forEach(d => {
    d.co2_per_capita = +d.co2_per_capita;
    d.life_expectancy = +d.life_expectancy;
    d.gdp_per_capita = +d.gdp_per_capita;
    d.energy_per_capita = +d.energy_per_capita;
  });

  drawCO2Histogram(co2Svg, data, width, height, margin);
  drawLifeExpectancyHistogram(lifeExpectancySvg, data, width, height, margin);
  drawChoropleth(co2MapSvg, geoData, data, "co2_per_capita", d3.interpolateBlues, width, height);
  drawChoropleth(lifeMapSvg, geoData, data, "life_expectancy", d3.interpolateGreens, width, height);
  
  attributeSelect(updateVisualizations);
  updateVisualizations(selectedAttribute);
});
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.8)")
  .style("color", "white")
  .style("padding", "6px 8px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none")
  .style("opacity", 0);

function updateVisualizations(attributeKey) {
  selectedAttribute = attributeKey;

  drawScatterPlot({
    svg: scatterPlotSvg,
    data,
    width,
    height,
    margin,
    xAttr: selectedAttribute,
    yAttr: "life_expectancy",
    colorAttr: selectedAttribute,
    colorScheme: attributeOptions[selectedAttribute].colorScheme
  });

  drawChoropleth(
    co2MapSvg,
    geoData,
    data,
    attributeKey,
    attributeOptions[attributeKey].colorScheme,
    width,
    height
  );
}

function attributeSelect(onChange) {
    const select = d3.select("#attributeSelect");

    select.selectAll("option")
        .data(Object.entries(attributeOptions))
        .enter()
        .append("option")
        .attr("value", d => d[0])
        .text(d => d[1].label);

    select.on("change", function() {
        onChange(this.value);
    });
}