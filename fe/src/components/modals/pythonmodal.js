import React from 'react';
import '../components.css';
import AceEditor from "react-ace";
import { Modal } from 'antd';


import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools"



function PythonModal(props) {
    return (
        <div>
          <Modal title="Python Transformation" open={props.isModalOpen} onOk={props.handleOk} onCancel={props.handleCancel}>
          <p>You may access the data as a pandas dataframe using the variable `df`</p>
          <p>The final dataframe to be returned should be named `final_df`</p>
          <AceEditor
            disable
            placeholder=""
            mode="python"
            theme="xcode"
            name="blah2"
            onChange={props.handleChange}
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
            </Modal>
        </div>
    );
  }

export default PythonModal;