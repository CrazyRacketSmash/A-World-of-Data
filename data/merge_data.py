import pandas as pd

# Load CSV files
co2 = pd.read_csv("co-emissions-per-capita.csv")
life = pd.read_csv("life-expectancy.csv")

# Rename columns for clarity
co2 = co2.rename(columns={
    "CO₂ emissions per capita": "co2_per_capita",
    "Year": "co2_year"
})

life = life.rename(columns={
    "Life expectancy": "life_expectancy",
    "Year": "life_year"
})

# Merge datasets on country code
merged = pd.merge(
    co2,
    life,
    on="Code",
    how="inner"
)

# Select and reorder useful columns
merged = merged[[
    "Entity_x",
    "Code",
    "co2_year",
    "co2_per_capita",
    "life_year",
    "life_expectancy"
]]

# Rename entity column
merged = merged.rename(columns={
    "Entity_x": "country"
})

# Drop rows with missing values (safety)
merged = merged.dropna()

# Save merged file
merged.to_csv("co2_life_expectancy.csv", index=False)

print("Merged dataset saved as co2_life_expectancy.csv")
