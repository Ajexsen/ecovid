import pandas as pd
import datetime


STATE_ID_NAME_MAP = {
       1: "Schleswig-Holstein", 
       2: "Hamburg", 
       3: "Niedersachsen", 
       4: "Bremen", 
       5: "Nordrhein-Westfalen", 
       6: "Hessen", 
       7: "Rheinland-Pfalz", 
       8: "Baden-Württemberg", 
       9: "Bayern", 
       10: "Saarland", 
       11: "Berlin", 
       12: "Brandenburg", 
       13: "Mecklenburg-Vorpommern", 
       14: "Sachsen", 
       15: "Sachsen-Anhalt", 
       16: "Thüringen",
       17: "Deutschland"
}

STATE_ID_ISONAME_MAP = {
       1: "DE-SH", 
       2: "DE-HH", 
       3: "DE-NI", 
       4: "DE-HB", 
       5: "DE-NW", 
       6: "DE-HE", 
       7: "DE-RP", 
       8: "DE-BW", 
       9: "DE-BY", 
       10: "DE-SL", 
       11: "DE-BE", 
       12: "DE-BB", 
       13: "DE-MV", 
       14: "DE-SN", 
       15: "DE-ST", 
       16: "DE-TH",
       0: "DE-all"
}

def get_csv_bundesland(df, pop, bundesland_id, path):
    file_name = "rki_.csv"
    
    # fill 2020/01/01 with zeros
    first_day_fill = (pd.to_datetime("2020/01/01".strip(), format='%Y/%m/%d')).date()
    # df.loc[first_day_fill] = 0
    
    # date index: from first date (min) to last date (max) in data
    # data_start_date = df['Meldedatum'].min()
    data_start_date = first_day_fill
    data_end_date = df['Meldedatum'].max()
    indices = pd.date_range(start=data_start_date, end=data_end_date).date
    del data_start_date, data_end_date
    
    # if bundesland id exist, filter out for given id
    # else nation-wide (no filtering)
    if 1 <= bundesland_id <= 16:
        df = df[df["IdBundesland"] == bundesland_id]
        file_name = "bundesland//rki_{}.csv".format(STATE_ID_ISONAME_MAP[bundesland_id])
    else:
        file_name = "rki_DE-all.csv"
    
    # group data by age, gender and province
    data_total = df.drop(columns=['IdBundesland']).groupby(by=['Meldedatum']).sum()
    data_gender_age = df.drop(columns=['IdBundesland']).groupby(by=['Meldedatum', 'gender_age']).sum()
    
    # --- prepare data table
    
    col_name_general = ['AnzahlFall', 'AnzahlTodesfall']
    
    col_name_M_c = ['M_A00-A04_c', 'M_A05-A14_c', 'M_A15-A34_c', 'M_A35-A59_c', 'M_A60-A79_c', 'M_A80+_c', 'M_unbekannt_c']
    col_name_M_d = ['M_A00-A04_d', 'M_A05-A14_d', 'M_A15-A34_d', 'M_A35-A59_d', 'M_A60-A79_d', 'M_A80+_d', 'M_unbekannt_d']
    
    col_name_W_c = ['W_A00-A04_c', 'W_A05-A14_c', 'W_A15-A34_c', 'W_A35-A59_c', 'W_A60-A79_c', 'W_A80+_c', 'W_unbekannt_c']
    col_name_W_d = ['W_A00-A04_d', 'W_A05-A14_d', 'W_A15-A34_d', 'W_A35-A59_d', 'W_A60-A79_d', 'W_A80+_d', 'W_unbekannt_d']
    
    col_name_un_c = ['unbekannt_A00-A04_c', 'unbekannt_A05-A14_c', 'unbekannt_A15-A34_c', 'unbekannt_A35-A59_c', 'unbekannt_A60-A79_c', 'unbekannt_A80+_c', 'unbekannt_unbekannt_c']
    col_name_un_d = ['unbekannt_A00-A04_d', 'unbekannt_A05-A14_d', 'unbekannt_A15-A34_d', 'unbekannt_A35-A59_d', 'unbekannt_A60-A79_d', 'unbekannt_A80+_d', 'unbekannt_unbekannt_d']
    
    column_names = col_name_general + col_name_M_c + col_name_M_d + col_name_W_c + col_name_W_d + col_name_un_c + col_name_un_d
    del col_name_general, col_name_M_c, col_name_M_d, col_name_W_c, col_name_W_d, col_name_un_c, col_name_un_d
    
    # generate empty DataFrame with all cells 0 zero
    df = pd.DataFrame(index=indices, columns=column_names)
    df.index.name='Meldedatum'
    del indices, column_names
    df = df.fillna(0)
    
    # --- 
    
    # fill group data into table
    for _, row in data_total.iterrows():
        index = row.name
        df.loc[index]['AnzahlFall'] += row['AnzahlFall']
        df.loc[index]['AnzahlTodesfall'] += row['AnzahlTodesfall']
        
    for _, row in data_gender_age.iterrows():
        index = row.name[0]
        gender_age = row.name[1]
        df.loc[index][gender_age + "_c"] += row['AnzahlFall']
        df.loc[index][gender_age + "_d"] += row['AnzahlTodesfall']
    
    # cumulative cases & death, death rate
    new_case = df['AnzahlFall']
    new_death = df['AnzahlTodesfall']
    df = df.cumsum()
    df['NeuerFall'] = new_case
    df['NeuerTodesfall'] = new_death
    df['7d_Fall'] = df['NeuerFall'].rolling(7, min_periods=1).sum()
    df['7d_inzidenz'] = round(df['7d_Fall'] / pop, 1)
    
    # df['Todesrate'] = (df['AnzahlTodesfall']/df['AnzahlFall'])*100
    df.to_csv("{}{}".format(path, file_name))
    print("{} saved in path: {}".format(file_name, path))
    return df

def d7_df():
    df_all = pd.read_csv(save_path + 'rki_DE-all.csv')
    file_name = "rki_7d_DE-all.csv"
    
    column_names = ['Meldedatum'].append(list(STATE_ID_ISONAME_MAP.values()))
    df = pd.DataFrame(columns=column_names)
    df['Meldedatum'] = df_all['Meldedatum']
    df = df.fillna(0)
    
    for i in range(17):
        land_name = STATE_ID_ISONAME_MAP[i]
        if i == 0:
            df[land_name] = df_all['7d_inzidenz'].copy()
            # print(df_all['7d_inzidenz'])
        else:
            df_land = pd.read_csv("{}bundesland//rki_{}.csv".format(save_path, land_name))
            df_land.index.name='Meldedatum'
            df[land_name] = df_land['7d_inzidenz'].copy()
    df.to_csv("{}{}".format(save_path, file_name), index = False)
    print("{} saved in path: {}".format(file_name, save_path))

# TODO: download & update data (once per day)
# https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.csv

# load data: don't upload full csv
population_data = pd.read_csv("rki_bundesland_einwohner.csv")
data = pd.read_csv("RKI_COVID19.csv")
save_path = '..//data//rki//'

# remove unnecessary column
data = data.drop(columns=['Landkreis', 'ObjectId', 'IdLandkreis', 
                          'Datenstand', 'Refdatum', 
                          'Altersgruppe2'])
data = data.drop(columns=['NeuGenesen', 'AnzahlGenesen', 'IstErkrankungsbeginn'])

# date formating
data['Meldedatum'] = (pd.to_datetime(data['Meldedatum'].str.strip(), format='%Y/%m/%d %H:%M')).dt.date

# Data Beschreibung:
# --- Anzahl Fälle der aktuellen Publikation als Summe(AnzahlFall), wenn NeuerFall in (0,1)
# --- Anzahl Todesfälle der aktuellen Publikation als Summe(AnzahlTodesfall) wenn NeuerTodesfall in (0,1)
data['AnzahlFall'] = data['AnzahlFall'] * (0 <= data['NeuerFall'])
data['AnzahlTodesfall'] = data['AnzahlTodesfall'] * (0 <= data['NeuerTodesfall'])
data = data.drop(columns=['NeuerFall', 'NeuerTodesfall'])

# merge gender and age index
data['gender_age'] = data['Geschlecht'] + "_" + data['Altersgruppe']
data = data.drop(columns=['Geschlecht', 'Altersgruppe'])

# generate csv for all states (include DE_all)
for i in range(17):
    pop = float(population_data[population_data['bundesland_ab'] == STATE_ID_ISONAME_MAP[i]]['einwohner'])
    kk = get_csv_bundesland(data, pop, i, save_path)

# generate nation-wide csv (DE_all)
# df = get_csv_bundesland(data, 0, save_path)

# generate 7d everyday per bundesland
d7_df()
    
        

    