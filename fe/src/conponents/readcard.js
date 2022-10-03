import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import './ribbon.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { setOriginalData, setFilename } from '../states/csvDataSlice';
import { rewriteSteps } from '../states/stepsArrSlice'
import { setRead } from '../states/cardModalSlice';


function ReadCard(props) {
    const [selectedFile, setSelectedFile] = useState(undefined);

    const filename = useSelector(state => state.csvData.value.filename)
    const isModalOpen = useSelector(state => state.cardModal.value.read)

    const dispatch = useDispatch()

    const showModal = () => {
      dispatch(setRead(true));
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
  
        processCsv(result);
      };
      reader.readAsBinaryString(selectedFile);
  
      let tempStepsArr = [];
      tempStepsArr.push(
      {'type':'read',
      'filename':filename, 
      })
      dispatch(rewriteSteps(tempStepsArr))
      console.log(tempStepsArr)
      dispatch(setRead(false));
      console.log('Modal Ok')
    };
  
    const handleCancel = () => {
      dispatch(setRead(false));
      console.log('Modal Cancel')
    };

    const handleFileUpload = (e) => {
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
      const { name } = file;
      // console.log(name)
      dispatch(setFilename(name))
      setSelectedFile(file);
    };

    function processCsv(result) {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: result, dic:{} })
        .then(res => {
          // console.log(res.data);
          dispatch(setOriginalData(res.data))
        });
    }

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