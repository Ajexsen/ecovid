import pandas as pd
import csv
import calendar

# read rki whole rki DE data
df = pd.read_csv("../data/rki/rki_DE-all.csv", dayfirst=True, parse_dates=True)
df["Meldedatum"] = pd.to_datetime(df.Meldedatum, format='%Y-%m-%d')

# only 2020     
df = df[df['Meldedatum'].dt.year == 2020]

months = dict()
# do statistic of new cases for every month
for index, value in df.iterrows():
    if value["Meldedatum"].month in months:
        months[value["Meldedatum"].month] += value["NeuerFall"]
    else:
        months[value["Meldedatum"].month] = value["NeuerFall"]

# covert month number to string and save it as csv
test = months.items()
out = pd.DataFrame(months.items(), columns=['month','new_case'])
out['month'] = out['month'].apply(lambda x: calendar.month_abbr[x])
out.to_csv("../data/rki/rki_DE-newcase.csv", index=False)
    

