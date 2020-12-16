import pandas as pd
import csv
import calendar

# read rki whole rki DE data
df = pd.read_csv("../data/rki/rki_DE-all.csv", dayfirst=True, parse_dates=True)
df["Meldedatum"] = pd.to_datetime(df.Meldedatum, format='%Y-%m-%d')

months = dict()
# do statistic of new cases for every month
for index, value in df.iterrows():
    if value["Meldedatum"].month in months:
        months[value["Meldedatum"].month] += value["NeuerFall"]
    else:
        months[value["Meldedatum"].month] = value["NeuerFall"]

# covert month number to string and save it as csv
out = pd.DataFrame(months.items())
out[0] = out[0].apply(lambda x: calendar.month_abbr[x])
out.to_csv("../data/rki/rki_DE-newcase.csv", index=False)
    

