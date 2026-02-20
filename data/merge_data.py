import pandas as pd

co2 = pd.read_csv("co-emissions-per-capita.csv")
life = pd.read_csv("life-expectancy.csv")
gdp = pd.read_csv("gdp-per-capita-maddison-project-database.csv")
energy = pd.read_csv("per-capita-energy-use.csv")

# Rename indicator columns only
co2 = co2.rename(columns={
    "CO₂ emissions per capita": "co2_per_capita"
})

life = life.rename(columns={
    "Life expectancy": "life_expectancy"
})

gdp = gdp.rename(columns={
    "GDP per capita": "gdp_per_capita"
})

energy = energy.rename(columns={
    "Per capita energy consumption": "energy_per_capita"
})

# Keep needed columns
co2 = co2[["Entity", "Code", "Year", "co2_per_capita"]]
life = life[["Entity", "Code", "Year", "life_expectancy"]]
gdp = gdp[["Entity", "Code", "Year", "gdp_per_capita"]]
energy = energy[["Entity", "Code", "Year", "energy_per_capita"]]

# Merge step-by-step on Entity + Code + Year
merged = co2.merge(life, on=["Entity", "Code", "Year"], how="inner")
merged = merged.merge(gdp, on=["Entity", "Code", "Year"], how="inner")
merged = merged.merge(energy, on=["Entity", "Code", "Year"], how="inner")

# Rename Entity to country
merged = merged.rename(columns={"Entity": "country"})

# Drop missing values
merged = merged.dropna()

# Save
merged.to_csv("world_indicators.csv", index=False)

print("Rows:", merged.shape[0])
print("Saved world_indicators.csv")
print("CO2 max year:", co2["Year"].max())
print("Life max year:", life["Year"].max())
print("GDP max year:", gdp["Year"].max())
print("Energy max year:", energy["Year"].max())
