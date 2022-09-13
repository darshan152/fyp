import { Card, Modal, Upload, Button, message } from 'antd';
import React, { useState } from 'react';
import './ribbon.css';
import axios from 'axios';


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
        setCode(e.target.value);
      };

    // const handleFileUpload = (e) => {
    //   if (!e.target.files) {
    //     return;
    //   }
    //   const file = e.target.files[0];
    //   const { name } = file;
    //   console.log(name)
    //   setFilename(name);
  
    //   const reader = new FileReader();
    //   reader.onload = (evt) => {
    //     if (!evt?.target?.result) {
    //       return;
    //     }
    //     const { result } = evt.target;

    //     axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, {data:result})
    //     .then(res => {
    //       console.log(res);
    //       setCsvData(res.data.data);
    //     })
    //         //.then(data => this.setState({ postId: data.id }));
    //     };
    //   reader.readAsBinaryString(file);
    // };


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
        <textarea name="Text1" cols="40" rows="5" value={code} onChange={handleChange}></textarea>

        </Modal>
        </div>
    );
  }

export default PythonCard;