import pandas as pd

path = 'data/transport/'

data = pd.read_csv('{}{}.csv'.format(path, 'raw_data/transport_indices'), sep=";")
data['Year'] = pd.DatetimeIndex(data['Monat']).year
data['Monat'] = pd.DatetimeIndex(data['Monat']).month

start_year = data['Year'].min()
end_year = data['Year'].max()

# split road/rail/waterways/air data
data_road = data[['Year', 'Monat', 'Road transport']]
data_rail = data[['Year', 'Monat', 'Rail transport']]
data_water = data[['Year', 'Monat', 'Inland waterways transport']]
data_air = data[['Year', 'Monat', 'Air transport']]

for i in range(start_year, end_year+1):
    df_road = data_road[data_road["Year"] == i]
    df_road.to_csv("{}{}{}.csv".format(path, "road/road_", i), index=False)

    df_rail = data_rail[data_rail["Year"] == i]   
    df_rail.to_csv("{}{}{}.csv".format(path, "rail//rail_", i), index=False)

    df_water = data_water[data_water['Year'] == i]
    df_water.to_csv('{}{}{}.csv'.format(path, 'waterway/water_', i), index=False)

    df_air = data_air[data_air['Year'] == i]
    df_air.to_csv('{}{}{}.csv'.format(path, 'air/air_', i), index=False)

