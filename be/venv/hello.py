from flask import Flask
from flask_cors import CORS
from flask import request
import pandas as pd
import numpy as np
from io import StringIO
import json
import werkzeug
from sqlalchemy import create_engine
import pandas as pd
from sqlalchemy.engine import URL
import statistics
import uuid 
from datetime import datetime, timedelta
import pendulum
import time
from random import random
from sklearn.preprocessing import MinMaxScaler, PowerTransformer, StandardScaler, MaxAbsScaler, RobustScaler, QuantileTransformer, KBinsDiscretizer, LabelBinarizer, OrdinalEncoder, Binarizer, LabelEncoder
from sklearn.impute import SimpleImputer,KNNImputer
from sklearn.linear_model import LinearRegression


app = Flask(__name__)
CORS(app)

def ds_add(ds, days):
    if not days:
        return str(ds)
    dt = datetime.strptime(str(ds), "%Y-%m-%d") + timedelta(days=days)
    return dt.strftime("%Y-%m-%d")

def ds_format(ds, input_format, output_format):
    return datetime.strptime(str(ds), input_format).strftime(output_format)

def datetime_diff_for_humans(dt, since):
    return pendulum.instance(dt).diff_for_humans(since)


macros={
    'uuid':uuid,
    'datetime':datetime,
    'timedelta':timedelta,
    'time':time,
    'random':random,
    'ds_add':ds_add,
    'ds_format':ds_format,
    'datetime_diff_for_humans':datetime_diff_for_humans,
   }

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
        kwargs={'data_interval_end': pendulum.today('utc'),
                'data_interval_start':  pendulum.today('utc').add(days=-1),
                'ds':  pendulum.today('utc').format('YYYY-MM-DD'),
                'ds_nodash':  pendulum.today('utc').format('YYYYMMDD'),
                'execution_date':  pendulum.now('utc'),
                'logical_date':  pendulum.now('utc'),
                'macros': macros,
                'next_ds':  pendulum.today('utc').format('YYYY-MM-DD'),
                'next_ds_nodash': pendulum.today('utc').format('YYYYMMDD'),
                'next_execution_date': pendulum.now('utc'),
                'prev_data_interval_start_success':  pendulum.today('utc').add(days=-1),
                'prev_data_interval_end_success':  pendulum.today('utc'),
                'prev_ds': pendulum.today('utc').format('YYYY-MM-DD'),
                'prev_ds_nodash':  pendulum.today('utc').format('YYYYMMDD'),
                'prev_execution_date':  pendulum.now('utc'),
                'prev_execution_date_success':  pendulum.today('utc').add(days=-1),
                'prev_start_date_success':  pendulum.now('utc'),
                'tomorrow_ds': pendulum.today('utc').add(days=1).format('YYYY-MM-DD'),
                'tomorrow_ds_nodash':  pendulum.today('utc').add(days=1).format('YYYYMMDD'),
                'ts':  pendulum.now('utc').format('YYYY-MM-DDThh:mm:ss:msZ'),
                'ts_nodash':  pendulum.now('utc').format('YYYYMMDDThhmmss'),
                'ts_nodash_with_tz': pendulum.now('utc').format('YYYYMMDDThhmmssmsZ').replace(':',''),
                'yesterday_ds': pendulum.today('utc').add(days=-1).format('YYYY-MM-DD'),
                'yesterday_ds_nodash': pendulum.today('utc').add(days=-1).format('YYYYMMDD'),
                }
        print(dic)
        if dic['isfileupload']:
            try: 
                df = pd.read_csv(StringIO(data))
            except Exception as e:
                print(e)
                raise ReadError('Error parsing delimited file. Please check the file.')
        else:
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
            sql_stmt = dic["sql"]
            print('test')
            sql_stmt = eval('f"""{}"""'.format(sql_stmt))
            print(sql_stmt)
            try:
                df = pd.read_sql_query(sql_stmt, cnxn)
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

def read_internal(data,datatypes):
    dt_arr = []
    for key,val in datatypes.copy().items():
        if 'date' in val:
            dt_arr.append(key)
            del datatypes[key]
    return  pd.read_csv(StringIO(data),dtype=datatypes, parse_dates=dt_arr)


@app.route('/python', methods=['GET', 'POST'])
def python_transformation():
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

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
        df = read_internal(f['data'],f['datatypes'])

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
        if dic['groupby'] :
            ans = df.groupby(dic['groupby']).agg(agg).reset_index()
        else:
            ans = df.agg(agg).reset_index()
        ans.columns = ans.columns.map(lambda x: ' '.join(x) if type(x)!=str else x)
        return ans
    except Exception as e:
        print('Aggregation failed.')
        raise AggError('Aggregation failed, please check your inputs.')
    
@app.route('/add', methods=['GET', 'POST'])
def add_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = add(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def add(dic, df):
    for row in dic['addRows']:
        print(row['add'])
        if row['add'] == 'concat':
            df[row['name']] = ''
            for col in row['cols']:
                df[row['name']] = df[row['name']] + df[col].map(str)
        elif row['add'] == 'add_to_date':
            if row['date_add_type'] == 'days':
                df[row['name']] = df[row['col']] + pd.DateOffset(days=int(row['date_add_number']))
            if row['date_add_type'] == 'months':
                df[row['name']] = df[row['col']] + pd.DateOffset(months=int(row['date_add_number']))
            if row['date_add_type'] == 'years':
                df[row['name']] = df[row['col']] + pd.DateOffset(years=int(row['date_add_number']))
            if row['date_add_type'] == 'hours':
                df[row['name']] = df[row['col']] + pd.DateOffset(hours=int(row['date_add_number']))
            if row['date_add_type'] == 'minutes':
                df[row['name']] = df[row['col']] + pd.DateOffset(minutes=int(row['date_add_number']))
            if row['date_add_type'] == 'seconds':
                df[row['name']] = df[row['col']] + pd.DateOffset(seconds=int(row['date_add_number']))
        elif row['add'] == 'abs':
            df[row['name']] = df[row['col']].abs()
        elif row['add'] == 'mean':
            df[row['name']] = df[row['cols']].mean(axis=1)
        elif row['add'] == 'ceil':
            df[row['name']] = np.ceil(df[row['col']])
        elif row['add'] == 'floor':
            df[row['name']] = np.floor(df[row['col']])
        elif row['add'] == 'round':
            df[row['name']] = np.round(df[row['col']])
        elif row['add'] == 'cumsum':
            df[row['name']] = np.cumsum(df[row['col']])
        elif row['add'] == 'sum':
            df[row['name']] = 0
            for col in row['cols']:
                df[row['name']] = df[row['name']] + df[col].map(float)
        elif row['add'] == 'subtract':
            df[row['name']] = df[row['cols'][0]].map(float)
            for col in row['cols'][1:]:
                df[row['name']] = df[row['name']] - df[col].map(float)
        elif row['add'] == 'multiply':
            df[row['name']] = df[row['cols'][0]].map(float)
            for col in row['cols'][1:]:
                df[row['name']] = df[row['name']] * df[col].map(float)
        elif row['add'] == 'divide':
            df[row['name']] = df[row['cols'][0]].map(float)
            for col in row['cols'][1:]:
                df[row['name']] = df[row['name']] / df[col].map(float)
        elif row['add'] == 'max':
            df[row['name']] = df.apply(lambda x: max(x[row['cols']]),axis=1)
        elif row['add'] == 'min':
            df[row['name']] = df.apply(lambda x: min(x[row['cols']]),axis=1)
        elif row['add'] == 'median':
            df[row['name']] = df.apply(lambda x: statistics.median(x[row['cols']]),axis=1)
        elif row['add'] == 'stdev':
            df[row['name']] = df.apply(lambda x: statistics.stdev(x[row['cols']]),axis=1)
        elif row['add'] == 'variance':
            df[row['name']] = df.apply(lambda x: statistics.variance(x[row['cols']]),axis=1)
        elif row['add'] == 'log10':
            df[row['name']] = np.log10(df[row['col']])
        elif row['add'] == 'log2':
            df[row['name']] = np.log2(df[row['col']])
        elif row['add'] == 'ln':
            df[row['name']] = np.log(df[row['col']])
        elif row['add'] == 'sqrt':
            df[row['name']] = np.sqrt(df[row['col']])
        elif row['add'] == 'length':
            df[row['name']] = df[row['col']].astype(str).str.len()
        elif row['add'] == 'reverse':
            df[row['name']] = df[row['col']].astype(str).str[::-1]
    return df


@app.route('/join', methods=['GET', 'POST'])
def join_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = join(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def join(dic, df):
    join_df = read(dic['joinData'],dic)
    # print(dic)
    try:
        ans = df.merge(join_df,how=dic['joinType'],left_on=dic['masterKey'], right_on=dic['secondaryKey'])
    except:
        raise JoinError("Please check inputs for join operation")

    return ans

@app.route('/scale', methods=['GET', 'POST'])
def scale_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = scale(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def scale(dic, df):
    print(dic)
    for row in dic["rows"]:
        if row["scale"] == 'MinMaxScaler':
            sc = MinMaxScaler(feature_range = (row['min'],row['max']), clip=row['clip'])
        elif row["scale"] == 'StandardScaler':
            sc = StandardScaler(with_mean = row['with_mean'], with_std=row['with_std'])
        elif row["scale"] == 'MaxAbsScaler':
            sc = MaxAbsScaler()
        elif row["scale"] == 'RobustScaler':
            sc = RobustScaler(with_centering = row['with_centering'], with_scaling=row['with_scaling'], unit_variance=row['unit_variance'],quantile_range=(row['qmin'],row['qmax']))
        elif row["scale"] == 'PowerTransformer':
            sc = PowerTransformer(method = row['method'], standardize=row['standardize'])
        elif row["scale"] == 'QuantileTransformer':
            sc = QuantileTransformer(n_quantiles= row['n_quantiles'], output_distribution=row['output_distribution'])
        try:
            for col in row['cols']:
                df[col] = sc.fit_transform(df[[col]])
        except:
            raise ScaleError('Please Check scaling inputs')
    return df


@app.route('/missing', methods=['GET', 'POST'])
def missing_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = missing(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def missing(dic, df):
    print(dic)
    for row in dic["rows"]:
        print(row)
        try:
            row['method']
            row['col']
        except:
            raise MissingError("Please check your inputs")
        if row["method"] == 'Delete':
                df = df[df[row["col"]].isna()==False]
        elif row["method"] == 'Impute':
            try:
                row['imputeType']
            except:
                raise MissingError("Please check your inputs")
            if row['imputeType'] == "mean":
                imp = SimpleImputer(strategy='mean')
                try:
                    df[row["col"]] = imp.fit_transform(df[[row["col"]]])
                except:
                    raise MissingError('Something went wrong! We are unable to apply this impute type.')
            elif row['imputeType'] == "median":
                imp = SimpleImputer(strategy='median')
                try:
                    df[row["col"]] = imp.fit_transform(df[[row["col"]]])
                except:
                    raise MissingError('Something went wrong! We are unable to apply this impute type.')
            elif row['imputeType'] == "mode":
                imp = SimpleImputer(strategy='most_frequent')
                try: 
                    df[row["col"]] = imp.fit_transform(df[[row["col"]]])
                except:
                    raise MissingError('Something went wrong! We are unable to apply this impute type.')
            elif row['imputeType'] == "custom":
                try:
                    df[row["col"]] = df[row["col"]].fillna(row['custom'])
                except:
                    raise MissingError("Please check your inputs")
            elif row['imputeType'] == "knn":
                try: 
                    cols = row["imp_cols"]
                    cols.append(row['col'])
                    sc = KNNImputer(add_indicator=row['add_ind'], weights=row['weights'], n_neighbors=row['n_neighbors'])
                except:
                    raise MissingError("Please check your inputs")
                try:
                    a = sc.fit_transform(X=df[cols])
                    df[row["col"]] = pd.DataFrame(a, columns=cols)[[row["col"]]].iloc[:,0]
                except:
                    raise MissingError('Something went wrong! We are unable to apply this impute type.')
            elif row['imputeType'] == "linreg":
                try:
                    cols = row["imp_cols"]
                    lr = LinearRegression()
                    testdf = df[df[row["col"]].isnull()==True]
                    traindf = df[df[row["col"]].isnull()==False]
                    y = traindf[row["col"]]
                except:
                    raise MissingError("Please check your inputs")
                if testdf.shape[0] == 0 or traindf.shape[0] == 0:
                    raise MissingError("Chosen column to impute is either empty or has no missing values")
                try: 
                    lr.fit(traindf[cols],y)
                    pred = lr.predict(testdf[cols])
                    testdf[row["col"]]= pred
                    df = pd.concat([traindf,testdf])
                except Exception as e:
                    print(e)
                    raise MissingError('Something went wrong! We are unable to apply this impute type.')
        elif row["method"] == 'Indicator':
            try:
                df[row["col_name"]] = df[row["col"]].isna().astype(float)
            except:
                raise MissingError("Please check your inputs")
        
    return df


@app.route('/delete', methods=['GET', 'POST'])
def delete_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = delete(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def delete(dic, df):
    try:
        df = df.drop(list(dic['cols']),axis=1)
    except:
        raise DeleteError("Please check your inputs")
    return df

@app.route('/filter', methods=['GET', 'POST'])
def filter_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = filter(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def filter(dic, df):
    try:
        df = df.query(dic['query'])
    except Exception as e:
        print(e)
        raise FilterError("Please check your query")
    return df

@app.route('/encode', methods=['GET', 'POST'])
def encode_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = encode(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def encode(dic, df):
    for row in dic["rows"]:
        try:
            row['method']
        except:
            raise EncodeError('Please check your inputs')
        if row['method'] == 'KBinsDiscretizer':
            if row['n_bins'] == '':
                raise EncodeError('Please check your inputs')
            try:
                enc = KBinsDiscretizer(encode='ordinal', n_bins=row['n_bins'], strategy=row['strategy'])
                df[row['col']] = enc.fit_transform(df[[row['col']]])
            except:
                raise EncodeError(f'Column {row["col"]} was not able to be transformed with KBinsDiscretizer. Please change your input column or method')
        elif row['method'] == 'LabelBinarizer':
            try:
                enc = LabelBinarizer()
                trf = enc.fit_transform(df[[row['col']]])
                for i in range(len(enc.classes_)):
                    df[row['col']+ '_' +str(enc.classes_[i])] = trf[:, i]
            except:
                raise EncodeError(f'Column {row["col"]} was not able to be transformed with LabelBinarizer. Please change your input column or method')
        elif row['method'] == 'OrdinalEncoder':
            try:
                enc = OrdinalEncoder()
                df[row['col']] = enc.fit_transform(df[[row['col']]])
            except:
                raise EncodeError(f'Column {row["col"]} was not able to be transformed with OrdinalEncoder. Please change your input column or method')
        elif row['method'] == 'Binarizer':
            if row['threshold'] == '':
                raise EncodeError('Please check your inputs')
            try:
                enc = Binarizer(threshold = row['threshold'])
                df[row['col']] = enc.fit_transform(df[[row['col']]])
            except:
                raise EncodeError(f'Column {row["col"]} was not able to be transformed with Binarizer. Please change your input column or method')
        elif row['method'] == 'LabelEncoder':
            try:
                enc = LabelEncoder()
                df[row['col']] = enc.fit_transform(df[row['col']])
            except:
                raise EncodeError(f'Column {row["col"]} was not able to be transformed with LabelEncoder. Please change your input column or method')
    return df


@app.route('/datatype', methods=['GET', 'POST'])
def datatype_transformation():
    # print('im here')
    if request.method == 'POST':
        f = request.get_json()
        print(f['datatypes'])
        df = read_internal(f['data'],f['datatypes'])

        # print('hey')
        ans = datatype(f['dic'],df)
        # print(ans)
        dtype = extract_dtypes(ans)
        # print(dtype)
    return { 
        'data':ans.to_csv(index=False),
        'datatypes':(dtype),
    }

def datatype(dic, df):
    for row in dic["rows"]:
        try: 
            row['cols']
            row['dtype']
        except:
            raise DatatypeError("Please check your inputs")
        for col in row['cols']:
            try:
                df[col] = df[col].astype(row['dtype'])
            except:
                raise DatatypeError(f"Unable to convert {col} to {row['dtype']} datatype")
        
    return df

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
            if step['type'] == 'add':
                df = add(step,df)
            if step['type'] == 'join':
                df = join(step,df)
            if step['type'] == 'scale':
                df = scale(step,df)
            if step['type'] == 'missing':
                df = missing(step,df)
            if step['type'] == 'delete':
                df = delete(step,df)
            if step['type'] == 'filter':
                df = filter(step,df)
            if step['type'] == "encode":
                df = encode(step,df)
            if step['type'] == "datatype":
                df = datatype(step,df)
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

class JoinError(werkzeug.exceptions.HTTPException):
    code = 515

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(JoinError)
def handle_515(e):
    return e.message, e.code

class ScaleError(werkzeug.exceptions.HTTPException):
    code = 516

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(ScaleError)
def handle_516(e):
    return e.message, e.code

class MissingError(werkzeug.exceptions.HTTPException):
    code = 517

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(MissingError)
def handle_517(e):
    return e.message, e.code

class DeleteError(werkzeug.exceptions.HTTPException):
    code = 518

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(DeleteError)
def handle_518(e):
    return e.message, e.code

class FilterError(werkzeug.exceptions.HTTPException):
    code = 519

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(FilterError)
def handle_519(e):
    return e.message, e.code

class EncodeError(werkzeug.exceptions.HTTPException):
    code = 520

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(EncodeError)
def handle_520(e):
    return e.message, e.code

class DatatypeError(werkzeug.exceptions.HTTPException):
    code = 521

    def __init__(self, message):
        super().__init__()
        self.message = message

@app.errorhandler(DatatypeError)
def handle_521(e):
    return e.message, e.code



