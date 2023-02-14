import { React, useState} from 'react';
import { useSelector } from 'react-redux'
import { Button, Modal, Input, Tooltip } from 'antd';
import './components.css';
import { QuestionCircleOutlined } from '@ant-design/icons';


function DownloadAirflow(props) {
    const stepsArr = useSelector(state => state.stepsArr.value)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [path, setPath] = useState('');
    const [schInt, setSchInt] = useState('');


    const processRead = (curr) => {
        console.log('meow')
        if (curr.readType === 'database') {
            if (curr.dbtype === 'postgresql') {
                return `        sql_stmt = "${curr.sql}"
        pg_hook = PostgresHook(
            postgres_conn_id='${curr.conn_id}'
        )
        pg_conn = pg_hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query (sql_stmt, pg_conn)`
            } else if (curr.dbtype === 'mysql+pymysql') {
                return `        sql_stmt = "${curr.sql}"
        pg_hook = MySqlHook(
            mysql_conn_id='${curr.conn_id}'
        )
        pg_conn = pg_hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query (sql_stmt, pg_conn)`
            }
        } else if (curr.readType === 'delimited') {
            return `        df = pd.read_csv('${curr.path}',delimiter='${curr.delimiter}')`
        } else if (curr.readType === 'xml') {
            return `        df = pd.read_xml('${curr.path}')`
        } else if (curr.readType === 'json') {
            return `        df = pd.read_json('${curr.path}')`
        } else if (curr.readType === 'fix-width') {
            return `        df = pd.read_fwf('${curr.path}')`
        } else if (curr.readType === 'custom') {
            return `        path = '${curr.path}'
        f = open(path, 'r')
        data = StringIO(f.read())
        ${curr.code.split('\n').join('\n        ')}`
        }
    }

    const processPython = (transform_fn,curr) => {
        return transform_fn+`        ${curr.code.split('\n').join('\n        ')}\n        df = final_df\n`
    }

    const processAggregation = (transform_fn,curr) => {
        let aggRows = curr['aggRows'].map((x) => {let c = {[x.col]:x.agg}; return c})
        let agg = {}
        for (var i = 0; i < aggRows.length; i++) {
            let curr = aggRows[i]
            let keyCurr = Object.keys(curr)[0]
            if (keyCurr in agg) {
                agg[keyCurr] = agg[keyCurr].concat(curr[keyCurr])
            } else {
                agg[keyCurr] = curr[keyCurr] 
            }
        }
        return transform_fn+`        df = df.groupby('${curr['groupby']}').agg(${JSON.stringify(agg)}).reset_index()
        df.columns = df.columns.map(' '.join)
`
    }

    const processAdd = (transform_fn,curr) => {
        console.log(curr)
        let addRows = curr.addRows
        for (var i = 0; i < addRows.length; i++) {
            let row = addRows[i]
            if (row.add === 'abs') {
                transform_fn = transform_fn + `        df['${row['name']}'] = df['${row['col']}'].abs()
`
            } else if (row.add === 'concat') {
                transform_fn = transform_fn + `        df['${row['name']}'] = ''
        for col in [${"'" + row['cols'].join("','") + "'"}]:
            df['${row['name']}'] = df['${row['name']}'] + df[col].map(str)
`
            } else if (row.add === 'add_to_date') {
                transform_fn = transform_fn + `        df['${row['name']}'] = df['${row['col']}'] + pd.DateOffset(${row['date_add_type']}=int(${row['date_add_number']}))
`
            } else if (row.add === 'mean') {
                transform_fn = transform_fn + `        df['${row['name']}'] = df[[${"'" + row['cols'].join("','") + "'"}]].mean(axis=1)
`
            } else if (row.add === 'ceil' || row.add === 'floor' || row.add === 'round' || row.add === 'cumsum') {
                transform_fn = transform_fn + `        df['${row['name']}'] = np.${row.add}(df['${row['col']}'])
`
            } else if (row.add === 'sum') {
                transform_fn = transform_fn + `        df['${row['name']}'] = 0
        for col in [${"'" + row['cols'].join("','") + "'"}]:
            df['${row['name']}'] = df['${row['name']}'] + df[col].map(float)
`
            } else if (row.add === 'subtract') {
                transform_fn = transform_fn + `        df['${row['name']}'] = df[[${"'" + row['cols'].join("','") + "'"}][0]].map(float)
        for col in [${"'" + row['cols'].join("','") + "'"}][1:]:
            df['${row['name']}'] = df['${row['name']}'] - df[col].map(float)
`
        } else if (row.add === 'multiply') {
            transform_fn = transform_fn + `        df['${row['name']}'] = df[[${"'" + row['cols'].join("','") + "'"}][0]].map(float)
        for col in [${"'" + row['cols'].join("','") + "'"}][1:]:
            df['${row['name']}'] = df['${row['name']}'] * df[col].map(float)
`
        } else if (row.add === 'divide') {
            transform_fn = transform_fn + `        df['${row['name']}'] = df[[${"'" + row['cols'].join("','") + "'"}][0]].map(float)
        for col in [${"'" + row['cols'].join("','") + "'"}][1:]:
            df['${row['name']}'] = df['${row['name']}'] / df[col].map(float)
`
        } else if (row.add === 'min' || row.add === 'max' || row.add === 'stdev' || row.add === 'variance' || row.add === 'median') {
            transform_fn = transform_fn + `        df['${row['name']}'] = df.apply(lambda x: ${row['add']}(x[[${"'" + row['cols'].join("','") + "'"}]]),axis=1)
`
        } else if (row.add === 'log10' || row.add === 'log2' || row.add === 'sqrt') {
            transform_fn = transform_fn + `        df['${row['name']}'] = np.${row.add}(df['${row['col']}'])
`
        } else if (row.add === 'ln') {
            transform_fn = transform_fn + `        df['${row['name']}'] = np.log(df['${row['col']}'])
`
        } else if (row.add === 'length') {
            transform_fn = transform_fn + `        df['${row['name']}'] = df['${row['col']}'].astype(str).str.len()
`
        } else if (row.add === 'reverse') {
            transform_fn = transform_fn + `        df['${row['name']}'] = df['${row['col']}'].astype(str).str[::-1]
`
            }
        }
        return transform_fn
    }


    const processWrite = (curr) => {
        console.log('meow')
        if (curr.readType === 'database') {
            if (curr.dbtype === 'postgresql') {
                return `        pg_hook = PostgresHook(
            postgres_conn_id='${curr.conn_id}'
        )
        engine = pg_hook.get_sqlalchemy_engine()
        df.to_sql(name='meow', con=engine)`
            } else if (curr.dbtype === 'mysql+pymysql') {
                return `        pg_hook = MySqlHook(
            mysql_conn_id='${curr.conn_id}'
        )
        engine = pg_hook.get_sqlalchemy_engine()
        df.to_csv(name='meow',con=engine)`
            }
        } else if (curr.readType === 'delimited') {
            return `        df.to_csv('${curr.path}',sep='${curr.delimiter}')`
        }
    }


    const downloadCsv = () => {
        console.log('download clicked')
        let extract_fn
        let transform_fn = ''
        let load_fn
        const date = new Date();
        for (var i = 0; i < stepsArr.length; i++) {
            console.log(stepsArr[i]);
            let curr = stepsArr[i]
            if (curr.type === 'read') {
                extract_fn = processRead(curr)
            } else if (curr.type === 'python') {
                transform_fn = processPython(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'aggregation') {
                transform_fn = processAggregation(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'add') {
                transform_fn = processAdd(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'write') {
                load_fn = processWrite(curr)
            }
        }
        let airflow = `import pandas as pd
import numpy as np
from io import StringIO
from datetime import datetime
from airflow.models import DAG
from airflow.operators.python import PythonOperator
from airflow.hooks.postgres_hook import PostgresHook
# from airflow.hooks.mysql_hook import MySqlHook
from airflow.models import Variable
from airflow.operators.bash import BashOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from statistics import variance, stdev, median


with DAG(
    dag_id='test_from_react',
    schedule_interval='${schInt}',
    start_date=datetime(year=${date.getFullYear()}, month=${date.getMonth()+1}, day=${date.getDate()}),
    catchup=False
) as dag:
    def extract():
${extract_fn}
        df.to_csv('${path.at(-1) !== '/' ? path + '/' : path}raw_data.csv')
    
    def transform():
        df = pd.read_csv('${path.at(-1) !== '/' ? path + '/' : path}raw_data.csv')
${transform_fn}        df.to_csv('${path.at(-1) !== '/' ? path + '/' : path}transformed_data.csv')
        
    
    def load():
        df = pd.read_csv('${path.at(-1) !== '/' ? path + '/' : path}transformed_data.csv')
${load_fn}

    task_extract = PythonOperator(
        task_id='extract',
        python_callable=extract,
        #do_xcom_push=True
    )

    task_transform = PythonOperator(
        task_id='transform',
        python_callable=transform,
        #do_xcom_push=True
    )

    task_load = PythonOperator(
        task_id='load',
        python_callable=load,
        #do_xcom_push=True
    )

    task_extract >> task_transform >> task_load
        `
        
        const file = new Blob([airflow],{type: 'text/text'})

        const element = document.createElement("a")
        element.href = URL.createObjectURL(file)
        element.download = "airflow_dag.py"

        document.body.appendChild(element)
        element.click()
    }

    const openModal =  () => {
        setIsModalOpen(true);
    }

    const closeModal =  () => {
        setIsModalOpen(false);
    }

    const onPathChange = (e) => {
        setPath(e.target.value)
    }

    const onSchIntChange = (e) => {
        setSchInt(e.target.value)
    }

    return(
        <div>
            {/* <Button id='csvDownload' type='primary' onClick={downloadCsv} value='download' shape='round' icon={<DownloadOutlined />}>Download</Button> */}
            <Button id='csvDownload' type='primary' onClick={openModal} value='Generate' shape='round' >Generate Airflow DAG</Button>
            <Modal open={isModalOpen} onCancel={closeModal} onOk={downloadCsv}>
                <p>Add airflow shtwuff</p>
                <label>Path:</label>
                <Input value={path} onChange={onPathChange}></Input>
                <label>Schedule Interval: </label><Tooltip title="Use crontab"><a href='https://crontab.guru' target="_blank" rel="noreferrer"><QuestionCircleOutlined /></a></Tooltip>
                <Input value={schInt} onChange={onSchIntChange}></Input>
            </Modal>
        </div>
    );
}

export default DownloadAirflow;