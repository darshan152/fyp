import { Modal, Tabs, Input, Alert } from 'antd';
import { useSelector } from 'react-redux'

import { React, useState } from 'react';
import '../components.css';
import AceEditor from "react-ace";



function ReadModal(props) {
  const [theInputKey, setTheInputKey] = useState("");
  const stepsArr = useSelector(state => state.stepsArr.value)
  const hasRead = stepsArr.length !== 0 && stepsArr[0].type === 'read'


  console.log(props.defaultTab)

  const onTabChange = (e) => {
    props.onTabChange(e)
    setTheInputKey(Math.random().toString(36))
  };

    return (
        <Modal title="Read Data" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel} cancelButtonProps={{disabled:!hasRead}} closable={hasRead}>
          {/* <Upload {...prop}>
            <Button>Click to Upload</Button>
          </Upload> */}
          {props.error==='' ? null : <Alert message={props.error} type="error" />}
          <Tabs activeKey={props.defaultTab} onChange={onTabChange}
          items= {[
            {
              label: 'Delimited',
              key: 'delimited',
              children: <div><input key={theInputKey || '' } type="file" accept=".csv"  onChange={props.handleFileUpload} /><br/><br/>
              <label>Delimiter: </label>
              <Input value={props.dic.delimiter} onChange={props.onChange('delimiter')}/></div>,
            },
            {
              label: 'XML',
              key: 'xml',
              children: <div><input key={theInputKey || '' } type="file" accept=".xml"  onChange={props.handleFileUpload} /></div>,
            },
            {
              label: 'JSON',
              key: 'json',
              children: <div><input key={theInputKey || '' } type="file" accept=".json"  onChange={props.handleFileUpload} /></div>,
            },
            {
              label: 'Fix-width',
              key: 'fix-width',
              children: <div><input key={theInputKey || '' } type="file" accept="*"  onChange={props.handleFileUpload} /></div>,
            },
            {
              label: 'Custom',
              key: 'custom',
              children: <div><input key={theInputKey || '' } type="file" accept="*"  onChange={props.handleFileUpload} /><br/><br/>
              <p>Uploaded file is accesible as a StringIO object in `data`. Final dataframe needs to be loaded to the variable `df`.</p>
              <AceEditor
                disable
                placeholder=""
                mode="python"
                theme="xcode"
                name="blah2"
                onChange={props.onChange('code')}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={props.dic.code}
                setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                }}/></div>,
            },
            {
              label: 'Database',
              key: 'database',
              children: <div>
                <select value={props.dic.dbtype} onChange={props.onChange('dbtype')} name="databases" id="databases">
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql+pymysql">MySQL</option>
                  <option value="-">Nothing</option>
                </select> <br/>
                <label>Host: </label>
                <Input type='text' value={props.dic.host} onChange={props.onChange('host')}/><br/>
                <label>Port: </label>
                <Input type='text' value={props.dic.port} onChange={props.onChange('port')}/><br/>
                <label>User: </label>
                <Input type='text' value={props.dic.user} onChange={props.onChange('user')}/><br/>
                <label>Password: </label>
                <Input type='password' value={props.dic.password} onChange={props.onChange('password')}/><br/>
                <label>Database Name: </label>
                <Input type='text' value={props.dic.dbname} onChange={props.onChange('dbname')}/><br/>
                <label>SQL Query: </label>
                <Input type='text' value={props.dic.sql} onChange={props.onChange('sql')}/><br/>
              </div>,
            },
          ]}>
            {/* <Tabs.TabPane tab="Delimited" key="delimited">
              <input key={theInputKey || '' } type="file" accept=".csv"  onChange={props.handleFileUpload} /><br/><br/>
              <label>Delimiter: </label>
              <Input value={props.delimiter} onChange={props.handleDelimiterChange}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="XML" key="xml">
              <input key={theInputKey || '' } type="file" accept=".xml"  onChange={props.handleFileUpload} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="JSON" key="json">
              <input key={theInputKey || '' } type="file" accept=".json"  onChange={props.handleFileUpload} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Fix-width" key="fix-width">
              <input key={theInputKey || '' } type="file" accept="*"  onChange={props.handleFileUpload} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Custom" key="custom">
              <input key={theInputKey || '' } type="file" accept="*"  onChange={props.handleFileUpload} /><br/><br/>
              <p>Uploaded file is accesible as a StringIO object in `data`. Final dataframe needs to be loaded to the variable `df`.</p>
              <AceEditor
                disable
                placeholder=""
                mode="python"
                theme="xcode"
                name="blah2"
                onChange={props.handleCodeChange}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={props.code}
                setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                }}/>
            </Tabs.TabPane> */}
          </Tabs>

          
        </Modal>
    );
  }

export default ReadModal;