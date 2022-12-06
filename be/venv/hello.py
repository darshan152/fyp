from flask import Flask
from flask_cors import CORS
from flask import request
import pandas as pd
from io import StringIO
import json
import werkzeug


app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    # raise CustomCodeError('meow')
    if request.method == 'POST':
        f = request.get_json()
        # print(f)
        df = read(f['data'],f['dic'])
        # if df.shape[0] > 25:
        #     df = df.sample(n=25)
        dtype = extract_dtypes(df)
    return {
        'data':df.to_csv(index=False),
        'datatypes':(dtype)
    }

def read(data,dic):
    global df
    df = ""
    if dic['readType'] == 'delimited':
        try: 
            df = pd.read_csv(StringIO(data),delimiter=dic['delimiter'])
        except:
            raise ReadError('Error parsing delimited file. Please check the file and delimiter.')
    elif dic['readType'] == 'json':
        try:
            df = pd.read_json(StringIO(data))
        except:
            raise ReadError('Error parsing json file. Please check the file.')
    elif dic['readType'] == 'xml':
        try:
            df = pd.read_xml(data)
        except:
            raise ReadError('Error parsing xml file. Please check the file.')
    elif dic['readType'] == 'fix-width':
        try:
            df = pd.read_fwf(StringIO(data))
        except:
            raise ReadError('Error parsing fix-width file. Please check the file.')
    elif dic['readType'] == 'custom':
        data = StringIO(data)
        try:
            exec("global df\n"+dic['code'])
        except:
            ## Handle case when code not executable
            print('Code not excecuted')
            raise CustomCodeError('Code failed to be executed.')

        if isinstance(df,pd.Series):
                df = df.to_frame()
        elif isinstance(df,pd.DataFrame):
            df = df
        else:
            ## Handle case when final_df is of diff type
            if final_df == "":
                raise CustomCodeError('Please return the dataframe in the variable `df`.')
            raise CustomCodeError('`df` is not of type DataFrame.')
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
    global final_df
    final_df = ""
    try:
        exec("global final_df\n"+dic['code'])
    except:
        ## Handle case when code not executable
        print('Code not excecuted')
        raise CustomCodeError('Code failed to be executed.')
    

    if isinstance(final_df,pd.Series):
        ans = final_df.to_frame()
    elif isinstance(final_df,pd.DataFrame):
        ans = final_df
    else:
        ## Handle case when final_df is of diff type
        if final_df == "":
            raise CustomCodeError('Please return the dataframe in the variable `final_df`.')
        raise CustomCodeError('`final_df` is not of type DataFrame.')

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


class CustomCodeError(werkzeug.exceptions.HTTPException):
    code = 512

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(CustomCodeError)
def handle_512(e):
    return e.message, e.code

class ReadError(werkzeug.exceptions.HTTPException):
    code = 513

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(ReadError)
def handle_512(e):
    return e.message, e.code
