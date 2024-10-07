from flask import Flask, jsonify
import json
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
dir_path = os.path.dirname(os.path.realpath(__file__))

MIN_SNR = 5


df = pd.read_csv(os.path.join(dir_path, 'exo-archive.csv'))
df['dec_radians'] = df['dec']*np.pi/180
df['ra_radians'] = np.pi/2 - df['ra']*np.pi/180

# pl_rade = planetary radius (earth)
# st_rad = stellar-radius
# sy_dist = distance [pc]
# pl_orbsmax = planet-star distance

def calc_snr(R, Rp, D, Es, Ps, snr0=100, D0=6, Es0=10):
    return snr0 * ( (R*Rp*(D/D0)) / ((Es/Es0)*Ps) )**2

@app.route('/planets/telediam/<int:diameter>')
def getPlanetsByTelescopeDiameter(diameter: int = 5):
    if diameter < 5 or diameter > 15:
        return { "error": "invalid diameter" }

    df['ESmax'] = 15*(diameter/6)/df['pl_orbsmax']
    data = df[calc_snr(df['st_rad'], df['pl_rade'], diameter, df['sy_dist'], df['pl_orbsmax']) > MIN_SNR]
    data['snr'] = calc_snr(data['st_rad'], data['pl_rade'], diameter, data['sy_dist'], data['pl_orbsmax'])
    data = data[data['sy_dist'] < data['ESmax']]

    json_data = json.loads(data.to_json(orient='records'))
    response = jsonify(json_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run()