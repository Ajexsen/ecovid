import pandas as pd
import datetime

# download & update data (once per day)
# TODO

# load data
save_path = '..//data//rki//'
data = pd.read_csv(save_path + 'RKI_COVID19.csv')

# remove unnecessary column
data = data.drop(columns=['Landkreis', 'ObjectId', 'IdLandkreis', 
                          'Datenstand', 'Refdatum', 
                          'Altersgruppe2'])
data = data.drop(columns=['NeuGenesen', 'AnzahlGenesen', 'IstErkrankungsbeginn'])

# merge gender and age index
data['gender_age'] = data['Geschlecht'] + "_" + data['Altersgruppe']
data = data.drop(columns=['Geschlecht', 'Altersgruppe'])

# group data by age, gender and province
data_de_total = data.drop(columns=['IdBundesland']).groupby(by=['Meldedatum']).sum()
data_de_gender = data.drop(columns=['IdBundesland']).groupby(by=['Meldedatum', 'gender_age']).sum().drop(columns=['NeuerFall', 'NeuerTodesfall'])


# data_land = data.groupby(by=['Meldedatum', 'IdBundesland', 'gender_age']).sum()
# test1 = data_de.groupby('Meldedatum').agg('sum', axis='columns')
# accumulate data (by date)?


# prepare data table

data_start_date = '01/02/2020'
data_end_date = '12/07/2020'
indices = pd.date_range(start=data_start_date, end=data_end_date)
del data_start_date, data_end_date

col_name_general = ['AnzahlFall', 'AnzahlTodesfall', 'NeuerFall', 'NeuerTodesfall']

col_name_M_c = ['M_A00-A04_c', 'M_A05-A14_c', 'M_A15-A34_c', 'M_A35-A59_c', 'M_A60-A79_c', 'M_A80+_c', 'M_un_c']
col_name_M_d = ['M_A00-A04_d', 'M_A05-A14_d', 'M_A15-A34_d', 'M_A35-A59_d', 'M_A60-A79_d', 'M_A80+_d', 'M_un_d']

col_name_W_c = ['W_A00-A04_c', 'W_A05-A14_c', 'W_A15-A34_c', 'W_A35-A59_c', 'W_A60-A79_c', 'W_A80+_c', 'W_un_c']
col_name_W_d = ['W_A00-A04_d', 'W_A05-A14_d', 'W_A15-A34_d', 'W_A35-A59_d', 'W_A60-A79_d', 'W_A80+_d', 'W_un_d']

col_name_un_c = ['un_A00-A04_c', 'un_A05-A14_c', 'un_A15-A34_c', 'un_A35-A59_c', 'un_A60-A79_c', 'un_A80+_c', 'un_un_c']
col_name_un_d = ['un_A00-A04_d', 'un_A05-A14_d', 'un_A15-A34_d', 'un_A35-A59_d', 'un_A60-A79_d', 'un_A80+_d', 'un_un_d']

column_names = col_name_general + col_name_M_c + col_name_M_d + col_name_W_c + col_name_W_d + col_name_un_c + col_name_un_d
del col_name_general, col_name_M_c, col_name_M_d, col_name_W_c, col_name_W_d, col_name_un_c, col_name_un_d

df = pd.DataFrame(index=indices, columns=column_names)
del indices, column_names
df = df.fillna(0)

# ----------