import { Modal, Tabs, Input, Alert } from 'antd';
import { useSelector } from 'react-redux'

import { React, useState } from 'react';
import '../components.css';
import AceEditor from "react-ace";



function WriteModal(props) {
  const [theInputKey, setTheInputKey] = useState("");
  // const stepsArr = useSelector(state => state.stepsArr.value)
  // const hasWrite = stepsArr.length !== 0 && stepsArr.at(-1).type === 'write'


  console.log(props.defaultTab)

  const onTabChange = (e) => {
    props.onTabChange(e)
    setTheInputKey(Math.random().toString(36))
  };

    return (
        <Modal title="Write Data" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          <Tabs activeKey={props.defaultTab} onChange={onTabChange}
          items= {[
            {
              label: 'Delimited',
              key: 'delimited',
              children: <div>
              <label>Delimiter: </label>
              <Input value={props.dic.delimiter} onChange={props.onChange('delimiter')}/>
              <label>Processing path: </label>
              <Input value={props.dic.path} onChange={props.onChange('path')} /></div>,
            },
            
            {
              label: 'Database',
              key: 'database',
              children: <div>
                <select value={props.dic.dbtype} onChange={props.onChange('dbtype')} name="databases" id="databases">
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql+pymysql">MySQL</option>
                  <option value="oracle">Oracle</option>
                  <option value="mssql">MsSql</option>
                  <option value="sqlite">Sqlite</option>
                  <option value="redshift">Redshift</option>
                  <option value="hive">Hive</option>
                  {/* <option value="-">Nothing</option> */}
                </select> <br/>
                <label>Airflow Connection ID: </label>
                <Input value={props.dic.conn_id} onChange={props.onChange('conn_id')} />
                <label>Table name: </label>
                <Input value={props.dic.table} onChange={props.onChange('table')} />
              </div>,
            },
          ]}>
            
          </Tabs>

          
        </Modal>
    );
  }

export default WriteModal;