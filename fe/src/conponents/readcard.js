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

    const handleFetchData = () => { // access in API call
      fetch(`${process.env.REACT_APP_BACKEND_URL}`)
        //.then((res) => res.json())
        .then((data) => console.log(data.text));
    };

    handleFetchData();


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