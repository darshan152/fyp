import { React, useState} from 'react';
import { useSelector } from 'react-redux'
import { Button, Modal, Input, Tooltip, Switch } from 'antd';
import './components.css';
import { QuestionCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';


function DownloadAirflow(props) {
    const stepsArr = useSelector(state => state.stepsArr.value)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [path, setPath] = useState('');
    const [isCleanup, setIsCleanup] = useState(false);
    const [schInt, setSchInt] = useState('');
    let cleanup = '';


    const processRead = (curr) => {
        console.log('meow')
        if (curr.readType === 'database') {
            if (curr.dbtype === 'postgresql') {
                return `        sql_stmt = f"""${curr.sql}"""
        pg_hook = PostgresHook(
            postgres_conn_id='${curr.conn_id}'
        )
        pg_conn = pg_hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query(sql_stmt, pg_conn)`
            } else if (curr.dbtype === 'mysql+pymysql') {
                return `        sql_stmt = f"""${curr.sql}"""
        hook = MySqlHook(
            mysql_conn_id='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query(sql_stmt, conn)`
            } else if (curr.dbtype === 'oracle') {
                return `        sql_stmt = f"""${curr.sql}"""
        hook = OracleHook(
            oracle_conn_id ='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query(sql_stmt, conn)`
            } else if (curr.dbtype === 'mssql') {
                return `        sql_stmt = f"""${curr.sql}"""
        hook = MsSqlHook(
            mssql_conn_id ='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query(sql_stmt, conn)`
            } else if (curr.dbtype === 'sqlite') {
                return `        sql_stmt = f"""${curr.sql}"""
        hook = SqliteHook(
            sqlite_conn_id ='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        df = pd.read_sql_query(sql_stmt, conn)`
            }
        } else if (curr.readType === 'delimited') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            pass
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_csv(files[0],delimiter='${curr.delimiter}')`
        } else if (curr.readType === 'xml') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            pass
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_xml(files[0])`
        } else if (curr.readType === 'json') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            pass
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_json(files[0])`
        } else if (curr.readType === 'fix-width') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            pass
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_fwf(files[0])`
        } else if (curr.readType === 'custom') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            pass
        files.sort(key=lambda x: -os.path.getmtime(x))
        f = open(files[0], 'r')
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
        if (isCleanup) {
            cleanup += `        shutil.rmtree('${path}')`
        }
        if (curr.readType === 'database') {
            let truncate = ''
            if (curr.trunc) {
                truncate = `try:
                    connection.execute("Delete from ${curr.table};")
                except:
                    pass`
            }
            if (curr.dbtype === 'postgresql') {
                
                return `        hook = PostgresHook(
            postgres_conn_id='${curr.conn_id}'
        )
        engine = hook.get_sqlalchemy_engine()
        with engine.connect() as connection:
            with connection.begin():
                ${truncate}
                df.to_sql('${curr.table}',connection, if_exists='append',index=False)
        ${cleanup.split('\n').join('\n        ')}`
            } else if (curr.dbtype === 'mysql+pymysql') {
                return `        hook = MySqlHook(
            mysql_conn_id='${curr.conn_id}'
        )
        engine = hook.get_sqlalchemy_engine()
        with engine.connect() as connection:
            with connection.begin():
                ${truncate}
                df.to_sql('${curr.table}',connection, if_exists='append',index=False)
        ${cleanup.split('\n').join('\n        ')}`
            } else if (curr.dbtype === 'oracle') {
                return `        hook = OracleHook(
            oracle_conn_id ='${curr.conn_id}'
        )
        engine = hook.get_sqlalchemy_engine()
        with engine.connect() as connection:
            with connection.begin():
                ${truncate}
                df.to_sql('${curr.table}',connection, if_exists='append',index=False)
        ${cleanup.split('\n').join('\n        ')}`
            } else if (curr.dbtype === 'mssql') {
                return `        hook = MsSqlHook(
                mssql_conn_id ='${curr.conn_id}'
        )
        engine = hook.get_sqlalchemy_engine()
        with engine.connect() as connection:
            with connection.begin():
                ${truncate}
                df.to_sql('${curr.table}',connection, if_exists='append',index=False)
        ${cleanup.split('\n').join('\n        ')}`
            } else if (curr.dbtype === 'sqlite') {
                return `        hook = SqliteHook(
                sqlite_conn_id ='${curr.conn_id}'
        )
        engine = hook.get_sqlalchemy_engine()
        with engine.connect() as connection:
            with connection.begin():
                ${truncate}
                df.to_sql('${curr.table}',connection, if_exists='append',index=False)
        ${cleanup.split('\n').join('\n        ')}`
            } else if (curr.dbtype === 'redshift') {
                return `        hook = RedshiftSQLHook(
                redshift_conn_id ='${curr.conn_id}'
        )
        engine = hook.get_sqlalchemy_engine()
        with engine.connect() as connection:
            with connection.begin():
                ${truncate}
                df.to_sql('${curr.table}',connection, if_exists='append',index=False)
        ${cleanup.split('\n').join('\n        ')}`
        //     } else if (curr.dbtype === 'hdfs') {
        //         return `        hook = HDFSHook(
        //         hdfs_conn_id ='${curr.conn_id}'
        // )
        // engine = hook.get_sqlalchemy_engine()
        // df.to_sql(name='${curr.table}',con=engine)`
            } else if (curr.dbtype === 'hive') {
                if (curr.trunc) {
                    truncate = `hook.run_cli("Delete from ${curr.table};")`
                }
                return `        hook = HiveCliHook(
                hive_cli_conn_id ='${curr.conn_id}'
        )
        ${truncate}
        hook.load_df(df,'${curr.table}')
${cleanup}`
            }
        } else if (curr.readType === 'delimited') {
            return `        df.to_csv('${curr.path}',sep='${curr.delimiter}')
${cleanup}`
        }
    }


    const downloadCsv = () => {
        console.log('download clicked')
        let extract_fn = ''
        let transform_fn = ''
        let load_fn = ''
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
# from airflow.providers.oracle.hooks.oracle import OracleHook
# from airflow.providers.microsoft.mssql.hooks.mssql import MsSqlHook
# from airflow.providers.sqlite.hooks.sqlite import SqliteHook
# from airflow.providers.amazon.aws.hooks.redshift_sql import RedshiftSQLHook
# from airflow.providers.apache.hdfs.hooks.hdfs import HDFSHook
# from airflow.providers.apache.hive.hooks.hive import HiveCliHook
from airflow.models import Variable
from airflow.operators.bash import BashOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from statistics import variance, stdev, median
import shutil
import os
import glob


with DAG(
    dag_id='test_from_react',
    schedule_interval='${schInt}',
    start_date=datetime(year=${date.getFullYear()}, month=${date.getMonth()+1}, day=${date.getDate()}),
    catchup=False
) as dag:
    def extract(**kwargs):
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
        provide_context=True,
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
                <label>File Cleanup:</label>
                <Switch checked={isCleanup} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} onChange={() => setIsCleanup(!isCleanup)}/><br/>
            </Modal>
        </div>
    );
}

export default DownloadAirflow;