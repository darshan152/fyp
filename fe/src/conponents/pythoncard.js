import { Card, Modal, Upload, Button, message } from 'antd';
import React, { useState } from 'react';
import './ribbon.css';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools"



function PythonCard(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
     const [code, setCode] = useState("");
    // const [filename, setFilename] = useState("");

    const showModal = () => {
      setIsModalOpen(true);
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
        const dic = {
            'type':'python',
            'code': code,
        }
        props.handleOk(dic);
      setIsModalOpen(false);
      console.log('Modal Ok')
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
      console.log('Modal Cancel')
    };

    const handleChange = (e) => {
        setCode(e);
      };

    return (
        <div>
        <div onClick={showModal}>
        <Card>
            <img
                width={20}
                src="/logo192.png"
                alt=''
            />
            Python
        </Card>
        </div>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>You may access the data as a pandas dataframe using the variable `df`</p>
          <p>The final dataframe to be returned should be named `final_df`</p>
          <AceEditor
            placeholder=""
            mode="python"
            theme="xcode"
            name="blah2"
            // onLoad={this.onLoad}
            onChange={handleChange}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            }}/>
        {/* <textarea name="Text1" cols="40" rows="5" value={code} onChange={handleChange}></textarea> */}

        </Modal>
        </div>
    );
  }

export default PythonCard;