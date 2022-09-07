import { Card, Modal, Upload, Button, message } from 'antd';
import React, { useState } from 'react';
import './components.css';
import { parse } from 'papaparse';

function ReadCard(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [csvData, setCsvData] = useState(undefined);
    const [filename, setFilename] = useState("");

    const showModal = () => {
      setIsModalOpen(true);
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
      console.log('Modal Ok')
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
      console.log('Modal Cancel')
    };

    const handleFileUpload = (e) => {
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
      const { name } = file;
      console.log(name)
      setFilename(name);
  
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
        console.log(result)
        console.log(filename)
        const records = parse(result, {
          'header': true,
        });
        console.log(records);
        setCsvData(records);
      };
      reader.readAsBinaryString(file);
    };
    
    const prop = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
    
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
    
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
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
            Read
        </Card>
        </div>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          {/* <Upload {...prop}>
            <Button>Click to Upload</Button>
          </Upload> */}

          <input type="file" accept=".csv"  onChange={handleFileUpload} />
        </Modal>
        </div>
    );
  }

export default ReadCard;