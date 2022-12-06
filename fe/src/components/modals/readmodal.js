import { Modal, Tabs, Input, Alert } from 'antd';
import { React, useState } from 'react';
import '../components.css';
import AceEditor from "react-ace";


function ReadModal(props) {
  const [theInputKey, setTheInputKey] = useState("");

  const onTabChange = (e) => {
    props.onTabChange(e)
    setTheInputKey(Math.random().toString(36))
    console.log('hi')
  };

    return (
        <Modal title="Read Data" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          {/* <Upload {...prop}>
            <Button>Click to Upload</Button>
          </Upload> */}
          {props.error==='' ? null : <Alert message={props.error} type="error" />}
          <Tabs defaultActiveKey={props.defaultTab} onChange={onTabChange}>
            <Tabs.TabPane tab="Delimited" key="delimited">
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
            </Tabs.TabPane>
          </Tabs>

          
        </Modal>
    );
  }

export default ReadModal;