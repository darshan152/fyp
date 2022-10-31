from flask import Flask
from flask_cors import CORS
from flask import request
import pandas as pd
from io import StringIO
import json


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
        dtype = extract_dtypes(df)
    return {
        'data':df.to_csv(index=False),
        'datatypes':(dtype)
    }

def read(data,dic):
    df = pd.read_csv(StringIO(data))
    return df

def extract_dtypes(df):
    dtype = None
    if isinstance(df, pd.DataFrame):
        json_types = json.loads(df.dtypes.to_json())
        dtype = {}
        for key in json_types.keys():
            dtype[key] = json_types[key]['name']
    elif isinstance(df, pd.Series):
        d = df.dtype
        dtype = {df.name:str(d)}
    return dtype


@app.route('/python', methods=['GET', 'POST'])
def python_transformation():
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = pd.read_csv(StringIO(f['data']),dtype=f['datatypes'])

        ans = python(f['dic'],df)
        dtype = extract_dtypes(ans)
        print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }
    

def python(dic,df):
    exec("global final_df\n"+dic['code'])
    try:
        if isinstance(final_df,pd.Series):
            ans = final_df.to_frame()
        else:
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
    dtype = extract_dtypes(df)
    return { 
        'data':df.to_csv(index=False),
        'datatypes':(dtype),
    }