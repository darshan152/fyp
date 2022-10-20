import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import { useSelector, useDispatch } from 'react-redux'
import { addStep, editStep } from '../../states/stepsArrSlice'
import { setCurrentData } from '../../states/csvDataSlice';
import { setPython } from '../../states/cardModalSlice';
import axios from 'axios';
import { setEditData, resetEditData } from '../../states/editDataSlice';
import PythonModal from '../modals/pythonmodal';



function PythonCard(props) {
  const currentData = useSelector(state => state.csvData.value.currentData)
  const originalData = useSelector(state => state.csvData.value.originalData)
  const isModalOpen = useSelector(state => state.cardModal.value.python)
  const oldDic = useSelector(state => state.editData.value.dic)
  const isEdit = useSelector(state => state.editData.value.isEdit)
  const stepsArr = useSelector(state => state.stepsArr.value)
  const dispatch = useDispatch()

  const [code, setCode] = useState("");


    const showModal = () => {
      dispatch(setPython(true));
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
        const dic = {
            'type':'python',
            'code': code,
        }
      dispatch(addStep(dic));
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/python`, {data:currentData,dic:dic})
      .then(res => {
        console.log(res.data)
        dispatch(setCurrentData(res.data));
      })
      dispatch(setPython(false));
      console.log('Modal Ok')
      setCode("")
    };

  const handleOkEdit = () => {
    let newStepsArr = [...stepsArr]
    newStepsArr[oldDic.index] = oldDic
    console.log(newStepsArr)
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:originalData,stepsArr:newStepsArr})
    .then(res => {
      dispatch(setCurrentData(res.data));
      dispatch(resetEditData());
      dispatch(editStep(newStepsArr));
      dispatch(setPython(false));
    })


  };
  
    const handleCancel = () => {
      dispatch(setPython(false));
      console.log('Modal Cancel')
      setCode("")
      dispatch(resetEditData())
    };

    const handleChange = (e) => {
        setCode(e);
      };
    
    const handleChangeEdit = (e) => {
      let newdic = {...oldDic}
      newdic.code=e
      dispatch(setEditData(newdic))
    };

    return (
        <div>
        <div onClick={showModal}>
        <Card>
            <img
                width={50}
                src="/python.png"
                alt=''
            />
            <br/>
            <p className='cardTest'>Python</p>
        </Card>
        </div>
        { !isEdit ? 
        <PythonModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChange} handleOk={handleOk} code={code}/>
        : 
        <PythonModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChangeEdit} handleOk={handleOkEdit} code={oldDic.code}/>
        }
        
        </div>
    );
  }

export default PythonCard;