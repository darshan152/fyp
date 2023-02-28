import { Card } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import { useSelector, useDispatch } from 'react-redux'
import { addStep, editStep } from '../../states/stepsArrSlice'
import { setCurrentData, setDataTypes, setLoading } from '../../states/csvDataSlice';
import { setScale } from '../../states/cardModalSlice';
import axios from 'axios';
import { setEditData, resetEditData } from '../../states/editDataSlice';
import ScaleModal from '../modals/scalemodal';



function ScaleCard(props) {
  const currentData = useSelector(state => state.csvData.value.currentData)
  const originalData = useSelector(state => state.csvData.value.originalData)
  const isModalOpen = useSelector(state => state.cardModal.value.scale)
  const oldDic = useSelector(state => state.editData.value.dic)
  const isEdit = useSelector(state => state.editData.value.isEdit)
  const stepsArr = useSelector(state => state.stepsArr.value)
  const datatypes = useSelector(state => state.csvData.value.datatypes)
  const isLoading = useSelector(state => state.csvData.value.loading)
  const dispatch = useDispatch()
  const hasWrite = stepsArr.length !== 0 && stepsArr.at(-1).type === 'write'

  const EMPTYDIC = {rows:[], type:'scale', datatypes:datatypes}

  const [error, setError] = useState("");
  const [dic, setDic] = useState(EMPTYDIC);

  


    const addRow = () => {
      let newDic = {...dic}
      let newRows = newDic.rows
      newRows.push({ scale:'', cols:[], with_mean:true, with_std:true, with_centering:true, with_scaling:true, qmin:25, qmax:75, min:0, max:1, output_distribution:'uniform', n_quantiles:1000, standardize:true, method:"yeo-johnson", clip:false, unit_variance: false })
      newDic['rows'] = newRows
      setDic(newDic)
      console.log(newRows)
    }

    const addRowEdit = () => {
      let newDic = {...oldDic}
      let newRows = [...newDic.rows]
      newRows.push({ scale: '', cols:[], with_mean:true, with_std:true, with_centering:true, with_scaling:true, qmin:25, qmax:75, min:0, max:1, output_distribution:'uniform', n_quantiles:1000, standardize:true, method:"yeo-johnson", clip:false, unit_variance: false })
      newDic['rows'] = newRows
      dispatch(setEditData(newDic))
      console.log('meow')
    }

    const delRow = () => {
      let newDic = {...dic}
      let newRows = newDic.rows
      newRows = newRows.slice(0,(newRows.length)-1)
      newDic['rows'] = newRows
      setDic(newDic)
      console.log('meow')
    }

    const delRowEdit = () => {
      let newDic = {...oldDic}
      let newRows = [...newDic.rows]
      newRows = newRows.slice(0,(newRows.length)-1)
      newDic['rows'] = newRows
      dispatch(setEditData(newDic))
      console.log('meow')
    }

    const changeRows = (e, idx, item) => {
      console.log(e)
      let newDic = {...dic}
      let newRows = newDic.rows
      newRows[idx][item] = e
      newDic['rows'] = newRows
      setDic(newDic)
      console.log(newRows)
    }

    const changeRowsEdit = (e, idx, item) => {
      let newDic = {...oldDic}
      let newRows = [...newDic.rows]
      let currAdd = {...newRows[idx]}
      currAdd[item] = e
      newRows[idx]=currAdd
      newDic['rows'] = newRows
      dispatch(setEditData(newDic))
      console.log(newRows)
    }

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
        dispatch(setScale(true));
        console.log('Opening Modal')
      }
    };
  
    const handleOk = () => {
      dispatch(setLoading(true))
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/scale`, {data:currentData,datatypes:datatypes,dic:dic})
      .then(res => {
        console.log(res.data)
        dispatch(addStep(dic));
        dispatch(setCurrentData(res.data.data));
        dispatch(setDataTypes(res.data.datatypes));
        dispatch(setLoading(false))
        setError('')
        dispatch(setScale(false));
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
      dispatch(setScale(false));
      setError('')
    }).catch(error => {
      setError(error.response.data)
      dispatch(setLoading(false))
    })


  };
  
    const handleCancel = () => {
      dispatch(setScale(false));
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
                src="/add.png"
                alt=''
            />
            <br/>
            <p className='cardTest'>Scale</p>
        </Card>
        </div>
        { !isEdit ? 
        <ScaleModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChange} handleOk={handleOk} error={error} dic={dic}  delRow={delRow} addRow={addRow} changeRows={changeRows}/>
        : 
        <ScaleModal isModalOpen={isModalOpen} handleCancel={handleCancel} handleChange={handleChangeEdit} handleOk={handleOkEdit} error={error} dic={oldDic} delRow={delRowEdit} addRow={addRowEdit} changeRows={changeRowsEdit}/>
        }
        
        </div>
    );
  }

export default ScaleCard;