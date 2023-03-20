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
    const [email, setEmail] = useState('');
    let cleanup = '';


    const processRead = (curr) => {
        console.log('meow')
        const isEmail = email !== '' ? "True" : "False"
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
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_csv(files[0],delimiter='${curr.delimiter}')`
        } else if (curr.readType === 'xml') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_xml(files[0])`
        } else if (curr.readType === 'json') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_json(files[0])`
        } else if (curr.readType === 'fix-width') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        df = pd.read_fwf(files[0])`
        } else if (curr.readType === 'custom') {
            cleanup += `        dest_path = os.path.dirname('${curr.path}')+'/success'
        os.makedirs(dest_path, exist_ok=True)
        os.replace('${curr.path}',dest_path)
`
            return `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
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
    const processJoin = (transform_fn,curr) => {
        const isEmail = email !== '' ? "True" : "False"
        if (curr.readType === 'database') {
            if (curr.dbtype === 'postgresql') {
                transform_fn = transform_fn + `        sql_stmt = f"""${curr.sql}"""
        pg_hook = PostgresHook(
            postgres_conn_id='${curr.conn_id}'
        )
        pg_conn = pg_hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        join_df = pd.read_sql_query(sql_stmt, pg_conn)
`
            } else if (curr.dbtype === 'mysql+pymysql') {
                transform_fn = transform_fn + `        sql_stmt = f"""${curr.sql}"""
        hook = MySqlHook(
            mysql_conn_id='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        join_df = pd.read_sql_query(sql_stmt, conn)
`
            } else if (curr.dbtype === 'oracle') {
                transform_fn = transform_fn + `        sql_stmt = f"""${curr.sql}"""
        hook = OracleHook(
            oracle_conn_id ='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        join_df = pd.read_sql_query(sql_stmt, conn)
`
            } else if (curr.dbtype === 'mssql') {
                transform_fn = transform_fn + `        sql_stmt = f"""${curr.sql}"""
        hook = MsSqlHook(
            mssql_conn_id ='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        join_df = pd.read_sql_query(sql_stmt, conn)
`
            } else if (curr.dbtype === 'sqlite') {
                transform_fn = transform_fn + `        sql_stmt = f"""${curr.sql}"""
        hook = SqliteHook(
            sqlite_conn_id ='${curr.conn_id}'
        )
        conn = hook.get_conn()
        # cursor = pg_conn.cursor()
        # cursor.execute(sql_stmt)
        # print(cursor.fetchall())
        join_df = pd.read_sql_query(sql_stmt, conn)
`
            }
        } else if (curr.readType === 'delimited') {
            transform_fn = transform_fn + `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        join_df = pd.read_csv(files[0],delimiter='${curr.delimiter}')
`
        } else if (curr.readType === 'xml') {
            transform_fn = transform_fn + `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        join_df = pd.read_xml(files[0])
`
        } else if (curr.readType === 'json') {
            transform_fn = transform_fn + `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        join_df = pd.read_json(files[0])
`
        } else if (curr.readType === 'fix-width') {
            transform_fn = transform_fn + `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        join_df = pd.read_fwf(files[0])
`
        } else if (curr.readType === 'custom') {
            transform_fn = transform_fn + `        files = glob.glob('${curr.path}')
        if len(files) == 0:
            if ${isEmail}:
                send_email(html_content = "Please check path ${curr.path}, unable to find specified file", to=['${email}'], subject="Failed to locate file.")
            raise Exception("Failed to locate file.")
        files.sort(key=lambda x: -os.path.getmtime(x))
        f = open(files[0], 'r')
        data = StringIO(f.read())
        ${curr.code.split('\n').join('\n        ')}
`
        }
        transform_fn = transform_fn + `        df = df.merge(join_df,how='${curr['joinType']}',left_on='${curr['masterKey']}', right_on='${curr['secondaryKey']}')
`
        return transform_fn
    }

    const processScale = (transform_fn,curr) => {
        console.log(curr)
        let rows = curr.rows
        for (var i = 0; i < rows.length; i++) {
            if (rows[i]['scale'] === 'MinMaxScaler'){
                transform_fn = transform_fn + `        sc = MinMaxScaler(feature_range = (${rows[i]['min']},${rows[i]['max']}), clip=${rows[i]['clip'] ? 'True' : 'False'})
`}
            else if(rows[i]['scale'] === 'StandardScaler'){
                transform_fn = transform_fn + `        sc = StandardScaler(with_mean = ${rows[i]['with_mean'] ? 'True' : 'False'}, with_std=${rows[i]['with_std'] ? 'True' : 'False'})
`}
            else if ( rows[i]['scale'] === 'MaxAbsScaler'){
                transform_fn = transform_fn + `        sc = MaxAbsScaler()
`}
            else if ( rows[i]['scale'] === 'RobustScaler'){
                transform_fn = transform_fn + `        sc = RobustScaler(with_centering = ${rows[i]['with_centering'] ? 'True' : 'False'}, with_scaling=${rows[i]['with_scaling'] ? 'True' : 'False'}, unit_variance=${rows[i]['unit_variance'] ? 'True' : 'False'},quantile_range=(${rows[i]['qmin']},${rows[i]['qmax']}))
`}
            else if ( rows[i]['scale'] === 'PowerTransformer'){
                transform_fn = transform_fn + `        sc = PowerTransformer(method = '${rows[i]['method']}', standardize=${rows[i]['standardize'] ? 'True' : 'False'})
`}
            else if ( rows[i]['scale'] === 'QuantileTransformer'){
                transform_fn = transform_fn + `        sc = QuantileTransformer(n_quantiles= ${rows[i]['n_quantiles']}, output_distribution='${rows[i]['output_distribution']}')
`}
            transform_fn = transform_fn + `        for col in [${"'" + rows[i]['cols'].join("','") + "'"}]:
            df[col] = sc.fit_transform(df[[col]])
`

        }
        return transform_fn
    }

    const processMissing = (transform_fn,curr) => {
        console.log(curr)
        let rows = curr.rows
        for (var i = 0; i < rows.length; i++) {
            if (rows[i]['method'] === 'Delete'){
                transform_fn = transform_fn + `        df = df[df['${rows[i]['col']}'].isna()==False]
`}
            else if (rows[i]['method'] === 'Impute') {
                if (rows[i]['imputeType'] === 'mean' || rows[i]['imputeType'] === 'median') {
                    transform_fn = transform_fn + `        imp = SimpleImputer(strategy='${rows[i]['imputeType']}')
        df['${rows[i]['col']}'] = imp.fit_transform(df[['${rows[i]['col']}']])
`}
                else if (rows[i]['imputeType'] === 'mode') {
                    transform_fn = transform_fn + `        imp = SimpleImputer(strategy='most_frequent')
        df['${rows[i]['col']}'] = imp.fit_transform(df[['${rows[i]['col']}']])
`}
            
                else if (rows[i]['imputeType'] === 'custom') {
                    transform_fn = transform_fn + `        df['${rows[i]['col']}'] = df['${rows[i]['col']}'].fillna('${rows[i]['custom']}')
`}
                else if (rows[i]['imputeType'] === 'knn') {
                    transform_fn = transform_fn + `        cols = [${"'" + rows[i]['imp_cols'].join("','") + "'"}]
        cols.append('${rows[i]['col']}')
        sc = KNNImputer(add_indicator=${rows[i]['add_ind'] ? 'True' : 'False'}, weights='${rows[i]['weights']}', n_neighbors=${rows[i]['n_neighbors']})
        a = sc.fit_transform(X=df[cols])
        df['${rows[i]['col']}'] = pd.DataFrame(a, columns=cols)[['${rows[i]['col']}']].iloc[:,0]
`}
                else if (rows[i]['imputeType'] === 'linreg') {
                    transform_fn = transform_fn + `        cols = [${"'" + rows[i]['imp_cols'].join("','") + "'"}]
        lr = LinearRegression()
        testdf = df[df['${rows[i]['col']}'].isnull()==True]
        traindf = df[df['${rows[i]['col']}'].isnull()==False]
        y = traindf['${rows[i]['col']}']
        lr.fit(traindf[cols],y)
        pred = lr.predict(testdf[cols])
        testdf['${rows[i]['col']}']= pred
        df = pd.concat([traindf,testdf])
`}
                }
            else if (rows[i]['method'] === 'Indicator') {
                transform_fn = transform_fn + `        df['${rows[i]['col_name']}'] = df['${rows[i]['col']}'].isna().astype(float)
`}
        }
        return transform_fn

    }

    const processDelete = (transform_fn,curr) => {
         transform_fn = transform_fn + `        df = df.drop([${"'" + curr['cols'].join("','") + "'"}]),axis=1)
`
        return transform_fn
    }

    const processFilter = (transform_fn,curr) => {
        transform_fn = transform_fn + `        df = df.query('${curr['query']}')
`
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
        const isEmail = email !== '' ? "True" : "False"
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
            } else if (curr.type === 'join') {
                transform_fn = processJoin(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'scale') {
                transform_fn = processScale(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'missing') {
                transform_fn = processMissing(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'delete') {
                transform_fn = processDelete(transform_fn,curr)
                console.log(transform_fn)
            } else if (curr.type === 'filter') {
                transform_fn = processFilter(transform_fn,curr)
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
import json
from airflow.utils.email import send_email
from sklearn.preprocessing import MinMaxScaler, PowerTransformer, StandardScaler, MaxAbsScaler, RobustScaler, QuantileTransformer
from sklearn.impute import SimpleImputer,KNNImputer
from sklearn.linear_model import LinearRegression


default_args = {
    'owner': 'Airflow GUI',
    'depends_on_past': False,
    'email': ['${email}'],
    'email_on_failure': ${isEmail},
    'email_on_retry': False,
    'retries': 0,
    # 'retry_delay': timedelta(minutes=5),
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
    # 'wait_for_downstream': False,
    # 'dag': dag,
    # 'sla': timedelta(hours=2),
    # 'execution_timeout': timedelta(seconds=300),
    # 'on_failure_callback': some_function,
    # 'on_success_callback': some_other_function,
    # 'on_retry_callback': another_function,
    # 'sla_miss_callback': yet_another_function,
    # 'trigger_rule': 'all_success'
}


with DAG(
    dag_id='test_from_react',
    default_args=default_args,
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
        df.dtypes.to_csv('${path.at(-1) !== '/' ? path + '/' : path}dtypes.csv')
        
    
    def load():
        dt = pd.read_csv('${path.at(-1) !== '/' ? path + '/' : path}dtypes.csv',index_col=0)
        datatypes = json.loads(dt.to_json())['0']
        dt_arr = []
        for key,val in datatypes.copy().items():
            if 'date' in val:
                dt_arr.append(key)
                del datatypes[key]
        df = pd.read_csv('${path.at(-1) !== '/' ? path + '/' : path}transformed_data.csv',dtype=datatypes, parse_dates=dt_arr)
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
        cleanup=''
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
        <div style={{'display':'inline-block'}}>
            {/* <Button id='csvDownload' type='primary' onClick={downloadCsv} value='download' shape='round' icon={<DownloadOutlined />}>Download</Button> */}
            <Button id='airflowDownload' type='primary' onClick={openModal} value='Generate' shape='round' >Generate Airflow DAG</Button>
            <Modal title='Airflow Parameters' open={isModalOpen} onCancel={closeModal} onOk={downloadCsv}>
                <label>Processing Directory:</label>
                <Input value={path} onChange={onPathChange}></Input>
                <label>Schedule Interval: </label><Tooltip title="Click to go to crontab"><a href='https://crontab.guru' target="_blank" rel="noreferrer"><QuestionCircleOutlined /></a></Tooltip>
                <Input value={schInt} onChange={onSchIntChange}></Input>
                <label>File Cleanup: </label>
                <Switch checked={isCleanup} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} onChange={() => setIsCleanup(!isCleanup)}/><br/>
                <label>Email: </label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            </Modal>
        </div>
    );
}

export default DownloadAirflow;