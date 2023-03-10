import { Card } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import { useSelector, useDispatch } from 'react-redux'
import { addStep, editStep } from '../../states/stepsArrSlice'
import { setCurrentData, setDataTypes, setLoading } from '../../states/csvDataSlice';
import { setDelete } from '../../states/cardModalSlice';
import axios from 'axios';
import { setEditData, resetEditData } from '../../states/editDataSlice';
import DeleteModal from '../modals/deletemodal';



function DeleteCard(props) {
  const currentData = useSelector(state => state.csvData.value.currentData)
  const originalData = useSelector(state => state.csvData.value.originalData)
  const isModalOpen = useSelector(state => state.cardModal.value.delete)
  const oldDic = useSelector(state => state.editData.value.dic)
  const isEdit = useSelector(state => state.editData.value.isEdit)
  const stepsArr = useSelector(state => state.stepsArr.value)
  const datatypes = useSelector(state => state.csvData.value.datatypes)
  const isLoading = useSelector(state => state.csvData.value.loading)
  const dispatch = useDispatch()
  const hasWrite = stepsArr.length !== 0 && stepsArr.at(-1).type === 'write'

  const EMPTYDIC = {type:'delete', datatypes:datatypes}

  const [error, setError] = useState("");
  const [dic, setDic] = useState(EMPTYDIC);

  
    const handleChange = (e, item) => {
      let newDic = {...dic}
      newDic[item] = e
      setDic(newDic)
      console.log(newDic)
    }

    const handleChangeEdit = (e, item) => {
      let newDic = {...oldDic}
      newDic[item] = e
      dispatch(setEditData(newDic))
      console.log(newDic)
    }


    const showModal = () => {
      let newDic = {...dic}
      newDic['datatypes'] = datatypes
      setDic(newDic)
      if (!isLoading && !hasWrite) {
        dispatch(setDelete(true));
        console.log('Opening Modal')
      }
    };
  
    const handleOk = () => {
      dispatch(setLoading(true))
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/delete`, {data:currentData,datatypes:datatypes,dic:dic})
      .then(res => {
        console.log(res.data)
        dispatch(addStep(dic));
        dispatch(setCurrentData(res.data.data));
        dispatch(setDataTypes(res.data.datatypes));
        dispatch(setLoading(false))
        setError('')
        dispatch(setDelete(false));
        setDic(EMPTYDIC)
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
      dispatch(setDelete(false));
      setError('')
    }).catch(error => {
      setError(error.response.data)
      dispatch(setLoading(false))
    })


  };
  
    const handleCancel = () => {
      dispatch(setDelete(false));
      console.log('Modal Cancel')
      setError('')
      dispatch(resetEditData())
      setDic(EMPTYDIC)
    };
    
    return (
        <div>
        <div onClick={showModal}>
        <Card className='TransformCard'>
            <img
                width={50}
                src="/problem-solving.png"
                alt=''
            />
            <br/>
            <p className='cardTest'>Delete</p>
        </Card>
        </div>
        { !isEdit ? 
        <DeleteModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChange} handleOk={handleOk} error={error} dic={dic}  />
        : 
        <DeleteModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChangeEdit} handleOk={handleOkEdit} error={error} dic={oldDic} />
        }
        
        </div>
    );
  }

export default DeleteCard;