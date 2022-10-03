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
        df = read(f['data'],f['dic'])
        # if df.shape[0] > 25:
        #     df = df.sample(n=25)
    return df.to_csv(index=False)

def read(data,dic):
    df = pd.read_csv(StringIO(data))
    return df

@app.route('/python', methods=['GET', 'POST'])
def python_transformation():
    if request.method == 'POST':
        f = request.get_json()
        df = pd.read_csv(StringIO(f['data']))
        ans = python(f['dic'],df)
    return ans.to_csv(index=False)

def python(dic,df):
    exec("global final_df\n"+dic['code'])
    try:
        ans = final_df
    except:
        print("Final df not found")
        ans = pd.DataFrame()
    return ans

@app.route('/retransform', methods=['GET', 'POST'])
def retransformation():
    if request.method == 'POST':
        f = request.get_json()
        stepsArr = f['stepsArr']
        df = read(f['data'],stepsArr[0])
        for step in stepsArr:
            print(step)
            if step['type'] == 'python':
                df = python(step,df)
    print(df)
    return df.to_csv(index=False)