from flask import Flask
from flask_cors import CORS
from flask import request
import pandas as pd
from io import StringIO
import json
import werkzeug
from sqlalchemy import create_engine
import pandas as pd
from sqlalchemy.engine import URL


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
        print(df.shape)
        if df.shape[0] > 100000:
            df = df.sample(n=100000)
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
        except Exception as e:
            print(e)
            raise ReadError('Error parsing delimited file. Please check the file and delimiter.')
    elif dic['readType'] == 'json':
        try:
            df = pd.read_json(StringIO(data))
        except Exception as e:
            print(e)
            raise ReadError('Error parsing json file. Please check the file.')
    elif dic['readType'] == 'xml':
        try:
            df = pd.read_xml(data)
        except Exception as e:
            print(e)
            raise ReadError('Error parsing xml file. Please check the file.')
    elif dic['readType'] == 'fix-width':
        try:
            df = pd.read_fwf(StringIO(data))
        except Exception as e:
            print(e)
            raise ReadError('Error parsing fix-width file. Please check the file.')
    elif dic['readType'] == 'custom':
        data = StringIO(data)
        try:
            exec("global df\n"+dic['code'])
        except Exception as e:
            print(e)
            ## Handle case when code not executable
            print('Code not excecuted')
            raise CustomCodeError('Code failed to be executed.')

        if isinstance(df,pd.Series):
                df = df.to_frame()
        elif isinstance(df,pd.DataFrame):
            df = df
        else:
            ## Handle case when final_df is of diff type
            if df == "":
                raise CustomCodeError('Please return the dataframe in the variable `df`.')
            raise CustomCodeError('`df` is not of type DataFrame.')
    elif dic['readType'] == 'database':
        print(dic)
        try: 
            url_object = URL.create(
                dic['dbtype'],
                username=dic["user"],
                password=dic["password"],  # plain (unescaped) text
                host=dic["host"],
                port=dic["port"],
                database=dic["dbname"],
            )
        except Exception as e:
            print(e.args)
            raise CustomCodeError('Please ensure all fields are filled up.')
        engine = create_engine(url_object)
        try:
            cnxn = engine.connect()
        except Exception as e:
            print(e.args)
            raise CustomCodeError('Connection to Database Failed.')
        try:
            df = pd.read_sql_query (dic["sql"], cnxn)
        except Exception as e:
            raise CustomCodeError('Error in SQL code.')

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

@app.route('/agg', methods=['GET', 'POST'])
def agg_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = pd.read_csv(StringIO(f['data']),dtype=f['datatypes'])

        # print('hey')
        ans = agg(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def agg(dic, df):
    l = list(map(lambda x: {x['col']:x['agg']},dic['aggRows']))
    
    agg = {}
    for i in l:
        items = list(i.items())[0]
        if items[0] in agg.keys():
            agg[items[0]] = list(set(agg[items[0]] + items[1]))
        else:
            agg[items[0]] = items[1]
    try:
        ans = df.groupby(dic['groupby']).agg(agg).reset_index()
        ans.columns = ans.columns.map(' '.join)
        return ans
    except Exception as e:
        print('Aggregation failed.')
        raise AggError('Aggregation failed, please check your inputs.')


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
            if step['type'] == 'aggregation':
                df = agg(step,df)
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
def handle_513(e):
    return e.message, e.code

class AggError(werkzeug.exceptions.HTTPException):
    code = 514

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(AggError)
def handle_514(e):
    return e.message, e.code
