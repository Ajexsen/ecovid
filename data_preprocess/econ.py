import pandas as pd

data = pd.read_csv("..//data//econ//raw_data//foreign-trade-total.csv", sep=";")
data['Year'] = pd.DatetimeIndex(data['Monat']).year
data['Monat'] = pd.DatetimeIndex(data['Monat']).month

start_year = data['Year'].min()
end_year = data['Year'].max()

# split import/export data
data_import = data.drop(columns=["Export"])
data_export = data.drop(columns=["Import"])

path = "..//data//econ//"

for i in range(start_year, end_year+1):
    df_import = data_import[data_import["Year"] == i]
    df_export = data_export[data_export["Year"] == i]
    df_import.to_csv("{}{}{}.csv".format(path, "import//im_", i), index=False)
    df_export.to_csv("{}{}{}.csv".format(path, "export//ex_", i), index=False)