import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import { useSelector, useDispatch } from 'react-redux'
import { addStep, editStep } from '../../states/stepsArrSlice'
import { setCurrentData, setDataTypes, setLoading } from '../../states/csvDataSlice';
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
  const datatypes = useSelector(state => state.csvData.value.datatypes)
  const dispatch = useDispatch()

  const [code, setCode] = useState("");
  const [error, setError] = useState("");


    const showModal = () => {
      dispatch(setPython(true));
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
      dispatch(setLoading(true))
        const dic = {
            'type':'python',
            'code': code,
        }
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/python`, {data:currentData,datatypes:datatypes,dic:dic})
      .then(res => {
        console.log(res.data)
        dispatch(addStep(dic));
        dispatch(setCurrentData(res.data.data));
        dispatch(setDataTypes(res.data.datatypes));
        dispatch(setLoading(false))
        dispatch(setPython(false));
        setCode("")
      }).catch(error => {
        setError(error.response.data)
        dispatch(setLoading(false))
      })
      console.log('Modal Ok')
      
    };

  const handleOkEdit = () => {
    dispatch(setLoading(true))
    let newStepsArr = [...stepsArr]
    newStepsArr[oldDic.index] = oldDic
    console.log(newStepsArr)
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:originalData,stepsArr:newStepsArr})
    .then(res => {
      dispatch(setCurrentData(res.data.data));
      dispatch(setDataTypes(res.data.datatypes));
      dispatch(resetEditData());
      dispatch(editStep(newStepsArr));
      dispatch(setLoading(false))
      dispatch(setPython(false));
    }).catch(error => {
      setError(error.response.data)
      dispatch(setLoading(false))
    })


  };
  
    const handleCancel = () => {
      dispatch(setPython(false));
      console.log('Modal Cancel')
      setCode("")
      setError('')
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
        <Card className='TransformCard'>
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
        <PythonModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChange} handleOk={handleOk} code={code} error={error}/>
        : 
        <PythonModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChangeEdit} handleOk={handleOkEdit} code={oldDic.code} error={error}/>
        }
        
        </div>
    );
  }

export default PythonCard;