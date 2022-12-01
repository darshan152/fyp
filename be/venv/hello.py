from flask import Flask
from flask_cors import CORS
from flask import request
from flask import Flask, Response
from werkzeug.wsgi import wrap_file
import pandas as pd
from io import StringIO
import pandavro as pdx
from io import BytesIO
import json
from fastavro import writer, reader, parse_schema
import base64



app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST' or request.method == 'GET':
        f = request.get_json()
        df, fo = read(f['data'],f['dic'])
        # if df.shape[0] > 25:
        #     df = df.sample(n=25)
        dtype = extract_dtypes(df)
        w = wrap_file(request.environ,fo)
        fo.seek(0)
        #encoded = base64.b64encode(fo.read())
        resp = Response(w,mimetype="text/plain",direct_passthrough=True)
        resp.headers['content-type'] = dtype
        return resp
        #resp# Response(json.dumps({'data': encoded, 'datatypes':dtype}),mimetype="text/plain")# Response(w,mimetype="text/plain",direct_passthrough=True)
    # return {
    #     'data':df.to_csv(index=False),
    #     'datatypes':(dtype)
    # }

def read(data,dic):
    df = pd.read_csv(StringIO(data))
    fo = BytesIO()
    pdx.to_avro(fo,df)
    return df, fo

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
    global final_df
    final_df = ""
    try:
        exec("global final_df\n"+dic['code'])
    except:
        ## Handle case when code not executable
        print('Code not excecuted')

    if isinstance(final_df,pd.Series):
        ans = final_df.to_frame()
    elif isinstance(final_df,pd.DataFrame):
        ans = final_df
    else:
        ## Handle case when final_df is of diff type
        ans = final_df

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