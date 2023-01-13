import { Card } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { setOriginalData, setFilename, setCurrentData, setDataTypes, setLoading } from '../../states/csvDataSlice';
import { editStep, rewriteSteps } from '../../states/stepsArrSlice'
import { setWrite } from '../../states/cardModalSlice';
import { resetEditData } from '../../states/editDataSlice';
import { setEditData } from '../../states/editDataSlice'
import Papa from "papaparse";
import WriteModal from '../modals/writemodal';


function WriteCard(props) {

    const filename = useSelector(state => state.csvData.value.filename)
    const isModalOpen = useSelector(state => state.cardModal.value.write)
    const stepsArr = useSelector(state => state.stepsArr.value)
    const oldDic = useSelector(state => state.editData.value.dic)
    // const originalData = useSelector(state => state.csvData.value.originalData)
    const isEdit = useSelector(state => state.editData.value.isEdit)
    const isLoading = useSelector(state => state.csvData.value.loading)
    const dispatch = useDispatch()
    const hasWrite = stepsArr.length !== 0 && stepsArr.at(-1).type === 'write'

    const EMPTYDIC = {delimiter:',', dbtype:'postgresql'}

    const [tab, setTab] = useState("delimited");
    const [dic, setDic] = useState(EMPTYDIC);

    const onChange = (item) => {
      const onChangeItem = (e) => {
        // console.log(e.target.value)
        if (typeof e === 'object') {
          e = e.target.value
        }
        let newDic = {...dic}
        newDic[item] = e
        setDic(newDic)
        console.log(newDic)
      }
      return onChangeItem
    }

    const onChangeEdit = (item) => {
      const onChangeItem = (e) => {
        // console.log(e.target.value)
        if (typeof e === 'object') {
          e = e.target.value
        }
        let newDic = {...oldDic}
        newDic[item] = e
        dispatch(setEditData(newDic))
        console.log(newDic)
      }
      return onChangeItem
    }

    const onTabChange = (e) => {
      setTab(e)
    };

    const onTabChangeEdit = (e) => {
      console.log(oldDic)
      let newdic = {...oldDic}
      newdic.readType=e
      dispatch(setEditData(newdic))
      console.log(newdic)
    };

    const showModal = () => {
      if (!isLoading && !hasWrite) {
        dispatch(setWrite(true));
        console.log('Opening Modal')
      }      
    };

  
    const handleOk = () => {
      dispatch(setLoading(true))
      dispatch(setWrite(false))
      let tempStepsArr = [...stepsArr];
      let stepDic = {...dic}
      stepDic.type = 'write'
      stepDic.readType = tab
      tempStepsArr.push(stepDic)
      console.log(tempStepsArr)      
      dispatch(rewriteSteps(tempStepsArr))
      dispatch(setLoading(false))
    };

    const handleOkEdit = () => {
      dispatch(setLoading(true))
      dispatch(setWrite(false));
      let tempStepsArr = [...stepsArr];
      let stepDic = {...oldDic}
      stepDic.type = 'write'
      stepDic.filename = filename
      // console.log(tab)
      // stepDic.readType = tab
      // tempStepsArr.push(stepDic)
      tempStepsArr[stepDic.index] = stepDic
      console.log(tempStepsArr)      
      console.log('Modal Ok')
      dispatch(rewriteSteps(tempStepsArr))
      dispatch(setWrite(false));
      dispatch(resetEditData());
      dispatch(setLoading(false))

    };
  
    const handleCancel = () => {
      dispatch(setWrite(false));
      dispatch(resetEditData());
      setDic(EMPTYDIC)
      console.log('Modal Cancel')
    };

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
            <p className='cardTest'>Write</p>
        </Card>
        </div>
        {!isEdit ?
          <WriteModal 
            isModalOpen={isModalOpen} 
            handleOk={handleOk} 
            handleCancel={handleCancel} 
            onTabChange={onTabChange} 
            defaultTab={tab} 
            onChange={onChange}
            dic={dic}
          />
          :
          <WriteModal 
            isModalOpen={isModalOpen} 
            handleOk={handleOkEdit} 
            handleCancel={handleCancel} 
            onTabChange={onTabChangeEdit} 
            defaultTab={oldDic.readType} 
            onChange={onChangeEdit}
            dic={oldDic}
          />
        }
        </div>
    );
  }

export default WriteCard;