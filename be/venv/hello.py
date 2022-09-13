from flask import Flask
from flask_cors import CORS
from flask import request
import pandas as pd
from io import StringIO


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.get_json()
        #print(f['data'])
        df = pd.read_csv(StringIO(f['data']))
        # if df.shape[0] > 25:
        #     df = df.sample(n=25)
        print(df)
        cols = []
        for key in df.to_dict().keys():
            col = {}
            col['title'] = key
            col['dataIndex'] = key
            col['key'] = key
            cols.append(col)
        print(cols)
    # return {'data':df.to_dict('records'),
    #             'cols':cols
    #             }
    return df.to_csv(index=False)
