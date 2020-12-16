# data source: 
# https://www.opengov-muenchen.de/dataset?tags=Raddauerzählstellen&page=1
# Column names: ['datum' 'uhrzeit_start' 'uhrzeit_ende' 'zaehlstelle' 'richtung_1' 'richtung_2' 
#                'gesamt' 'min-temp' 'max-temp' 'niederschlag' 'bewoelkung' 'sonnenstunden']


import pandas as pd
import csv
import numpy as np

MONTH = {'month': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']}
PATH = 'data/transport/bicycle/'
COLUMNS =  ['datum', 'uhrzeit_start', 'uhrzeit_ende', 'zaehlstelle', 'richtung_1', 'richtung_2', 
            'gesamt', 'min-temp', 'max-temp', 'niederschlag', 'bewoelkung', 'sonnenstunden']


def create_data(year):
    """
    Create monthly bicycle transport in a year.
    """

    df = pd.DataFrame(MONTH)
    count = []
    missing = 0

    for m in MONTH['month']:
        try:
            current_path = ''.join([PATH, 'raw_data/', year, '/rad', year, m, 'tage.csv'])
            current = pd.read_csv(current_path)['gesamt'].sum()
            count.append(current)
        except FileNotFoundError:
            missing += 1
            print(' '.join([current_path, 'does not exist']))

    if missing:
        count.extend([''] * missing)

    df['count'] = count
    df.to_csv(''.join([PATH, '/b_', year, '.csv']))

if __name__ == "__main__":
    # Implementation Example

    create_data('2017')
    data = pd.read_csv(''.join([PATH, '/b_2017.csv']))
    print(data.info())

    # For 2020 April raw data: sep in original data is ';'
    # data = pd.read_csv(''.join([PATH, '/2020/rad202004tage.csv']), sep=';')
    # data.to_csv(''.join([PATH, '/2020/rad202004tage.csv']))

