import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { setOriginalData, setFilename, setCurrentData, setDataTypes, setLoading } from '../../states/csvDataSlice';
import { editStep, rewriteSteps } from '../../states/stepsArrSlice'
import { setRead } from '../../states/cardModalSlice';
import ReadModal from '../modals/readmodal';
import { resetEditData } from '../../states/editDataSlice';


function ReadCard(props) {
    const [selectedFile, setSelectedFile] = useState(undefined);

    const filename = useSelector(state => state.csvData.value.filename)
    const isModalOpen = useSelector(state => state.cardModal.value.read)
    const stepsArr = useSelector(state => state.stepsArr.value)
    const originalData = useSelector(state => state.csvData.value.originalData)
    const isEdit = useSelector(state => state.editData.value.isEdit)
    const dispatch = useDispatch()

    const showModal = () => {
      dispatch(setRead(true));
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
      dispatch(setLoading(true))
      dispatch(setRead(false));
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
      
      console.log('Modal Ok')
    };

    const handleOkEdit = () => {
      dispatch(setLoading(true))
      dispatch(setRead(false));
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
  
        dispatch(setOriginalData(result));
        let tempStepsArr = [...stepsArr]
        tempStepsArr[0] = {'type':'read',
        'filename':filename, 
        }
        console.log(tempStepsArr)
        console.log('Modal Ok')
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:result,stepsArr:tempStepsArr})
        .then(res => {
          dispatch(setCurrentData(res.data.data));
          dispatch(setDataTypes(res.data.datatypes));
          dispatch(resetEditData());
          dispatch(editStep(tempStepsArr));
          dispatch(setLoading(false))
          dispatch(setRead(false));
        })
      };
      reader.readAsBinaryString(selectedFile);

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
      dispatch(setOriginalData(result))
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: result, dic:{} })
        .then(res => {
          dispatch(setCurrentData(res.data.data))
          dispatch(setDataTypes(res.data.datatypes))
          dispatch(setLoading(false))
        });
    }

    return (
        <div>
        <div onClick={showModal}>
        <Card className='TransformCard'>
            <img
                width={50}
                src="/book.png"
                alt=''
            />
            <br/>
            <p className='cardTest'>Read</p>
        </Card>
        </div>
        {!isEdit ?
          <ReadModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} handleFileUpload={handleFileUpload} />
          :<ReadModal isModalOpen={isModalOpen} handleOk={handleOkEdit} handleCancel={handleCancel} handleFileUpload={handleFileUpload} />
        }
        </div>
    );
  }

export default ReadCard;