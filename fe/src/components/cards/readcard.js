import { Card } from 'antd';
import React, { useState } from 'react';
import '../components.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { setOriginalData, setFilename, setCurrentData, setDataTypes, setLoading } from '../../states/csvDataSlice';
import { editStep, rewriteSteps } from '../../states/stepsArrSlice'
import { setRead } from '../../states/cardModalSlice';
import ReadModal from '../modals/readmodal';
import { resetEditData } from '../../states/editDataSlice';
import { setEditData } from '../../states/editDataSlice'
import Papa from "papaparse";


function ReadCard(props) {
    const [selectedFile, setSelectedFile] = useState(undefined);

    const filename = useSelector(state => state.csvData.value.filename)
    const isModalOpen = useSelector(state => state.cardModal.value.read)
    const stepsArr = useSelector(state => state.stepsArr.value)
    const oldDic = useSelector(state => state.editData.value.dic)
    // const originalData = useSelector(state => state.csvData.value.originalData)
    const isEdit = useSelector(state => state.editData.value.isEdit)
    const isLoading = useSelector(state => state.csvData.value.loading)
    const dispatch = useDispatch()

    const EMPTYDIC = {delimiter:',',code:'', dbtype:'postgresql'}

    const [tab, setTab] = useState("delimited");
    const [error, setError] = useState("");
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
      dispatch(setFilename(""))
      setError('')
      setSelectedFile(null);
    };

    const onTabChangeEdit = (e) => {
      console.log(oldDic)
      let newdic = {...oldDic}
      newdic.readType=e
      dispatch(setEditData(newdic))
      dispatch(setFilename(""))
      setSelectedFile(null);
      // setTimeout(()=>{console.log(oldDic)},2000)
      console.log(newdic)
    };

    const showModal = () => {
      if (!isLoading) {
        dispatch(setRead(true));
        console.log('Opening Modal')
      }      
    };

    const sampleCSVData = (result) => {
      const rows = Papa.parse(result,{delimiter:dic.delimiter}).data
      if (rows.at(-1).length === 1 && rows.at(-1)[0] === '') {
        rows.pop()
      }
      const headerRow =  [rows[0]]
      const min = 1
      const max = rows.length - 1
      // console.log(rows)
      const times = 100000
      if (max > times) {
        var ranArr = [];

        for (var i=min;i<=max;i++) {
          ranArr.push(i);
        }
        
        for (let i = ranArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ranArr[i], ranArr[j]] = [ranArr[j], ranArr[i]];
        }
        ranArr = ranArr.slice(0,times)
        // console.log(ranArr)
        const sampledRows = ranArr.map(idx=>rows[idx])
        // console.log(sampledRows)
        return Papa.unparse(headerRow.concat(sampledRows))
      }
      return result
    }

    const sampleFwData = (result) => {
      const rows = result.split('\n')
      if (rows.at(-1).length === 1 && rows.at(-1)[0] === '') {
        rows.pop()
      }
      const headerRow =  [rows[0]]
      const min = 1
      const max = rows.length - 1
      // console.log(rows)
      const times = 5
      if (max > times) {
        var ranArr = [];

        for (var i=min;i<=max;i++) {
          ranArr.push(i);
        }
        
        for (let i = ranArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ranArr[i], ranArr[j]] = [ranArr[j], ranArr[i]];
        }
        ranArr = ranArr.slice(0,times)
        // console.log(ranArr)
        const sampledRows = ranArr.map(idx=>rows[idx])
        // console.log(sampledRows)
        return headerRow.concat(sampledRows).join('\n')
      }
      return result
    }
  
    const handleOk = () => {
      let now = Date.now()
      dispatch(setLoading(true))
      dispatch(setRead(false))
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        var { result } = evt.target;
        if (tab === 'delimited'){
          result = sampleCSVData(result)
        } else if (tab === 'fix-width'){
          result = sampleFwData(result)
        }
        // console.log(result);
  
        let tempStepsArr = [];
        let stepDic = {...dic}
        stepDic.type = 'read'
        stepDic.filename = filename
        stepDic.readType = tab
        tempStepsArr.push(stepDic)
        console.log(tempStepsArr)      
        
        console.log('Modal Ok')
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: result, dic:tempStepsArr[0] })
          .then(res => {
            dispatch(rewriteSteps(tempStepsArr))
            dispatch(setOriginalData(result));
            // dispatch(setRead(false));
            dispatch(setCurrentData(res.data.data))
            dispatch(setDataTypes(res.data.datatypes))
            dispatch(setLoading(false))
            setError('')
            console.log((Date.now()-now)/1000)
          })
          .catch((error)=> {
            dispatch(setRead(true));
            setError(error.response.data)
            dispatch(setLoading(false))
          });

      };
      if (tab !== 'database') {
        try {
          reader.readAsBinaryString(selectedFile);
        } catch {
          setTimeout(null,1000)
          dispatch(setRead(true));
          setError('Please upload a file.')
          dispatch(setLoading(false))
        }
      } else {
        dispatch(setLoading(true))
        dispatch(setRead(false))
        let tempStepsArr = [];
        let stepDic = {...dic}
        stepDic.type = 'read'
        stepDic.filename = filename
        stepDic.readType = tab
        tempStepsArr.push(stepDic)
        console.log(tempStepsArr)      
        
        console.log('Modal Ok')
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: null, dic:tempStepsArr[0] })
          .then(res => {
            dispatch(rewriteSteps(tempStepsArr))
            dispatch(setOriginalData(null));
            // dispatch(setRead(false));
            dispatch(setCurrentData(res.data.data))
            dispatch(setDataTypes(res.data.datatypes))
            dispatch(setLoading(false))
            setError('')
            console.log((Date.now()-now)/1000)
          })
          .catch((error)=> {
            dispatch(setRead(true));
            setError(error.response.data)
            dispatch(setLoading(false))
          });
        
      }
  
      
    };

    const handleOkEdit = () => {
      dispatch(setLoading(true))
      dispatch(setRead(false));
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        var { result } = evt.target;
        if (tab === 'delimited'){
          result = sampleCSVData(result)
        } else if (tab === 'fix-width'){
          result = sampleFwData(result)
        }
  
        
        let tempStepsArr = [...stepsArr]
        let newDic = {...oldDic}
        newDic.filename = filename
        // newDic.fileType = filename.split('.').at(-1).toLowerCase()
        tempStepsArr[0] = newDic
        console.log(tempStepsArr)
        console.log('Modal Ok')
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:result,stepsArr:tempStepsArr})
        .then(res => {
          dispatch(setOriginalData(result));
          dispatch(setCurrentData(res.data.data));
          dispatch(setDataTypes(res.data.datatypes));
          dispatch(resetEditData());
          dispatch(editStep(tempStepsArr));
          // dispatch(setRead(false));
          dispatch(setLoading(false))
          setError('')
        }).catch((error)=> {
          dispatch(setRead(true));
          setError(error.response.data)
          dispatch(setLoading(false))
        });
        
      };
      // console.log(tab)
      if (oldDic.readType !== 'database') {
        try {
          reader.readAsBinaryString(selectedFile);
        } catch {
          dispatch(setRead(true));
          setError('Please upload a file.')
          dispatch(setLoading(false))
        }
      } else {
        // console.log(tab)
        dispatch(setLoading(true))
        dispatch(setRead(false))
        let tempStepsArr = [];
        let stepDic = {...oldDic}
        stepDic.type = 'read'
        stepDic.filename = filename
        // console.log(tab)
        // stepDic.readType = tab
        tempStepsArr.push(stepDic)
        console.log(tempStepsArr)      
        
        console.log('Modal Ok')
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: null, dic:tempStepsArr[0] })
          .then(res => {
            dispatch(rewriteSteps(tempStepsArr))
            dispatch(setOriginalData(null));
            // dispatch(setRead(false));
            dispatch(setCurrentData(res.data.data))
            dispatch(setDataTypes(res.data.datatypes))
            dispatch(resetEditData());
            dispatch(setLoading(false))
            setError('')
          })
          .catch((error)=> {
            dispatch(setRead(true));
            setError(error.response.data)
            dispatch(setLoading(false))
          });
        
      }

    };
  
    const handleCancel = () => {
      if (stepsArr.length !== 0 && stepsArr[0].type === 'read') {
        dispatch(setRead(false));
        dispatch(resetEditData());
        setError('')
        setDic(EMPTYDIC)
        console.log('Modal Cancel')
        //dispatch(setLoading(false))
      }
    };

    const handleFileUpload = (e) => {
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
      console.log(file)
      const { name } = file;
      dispatch(setFilename(name))
      setSelectedFile(file);
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
            <p className='cardTest'>Read</p>
        </Card>
        </div>
        {!isEdit ?
          <ReadModal 
            isModalOpen={isModalOpen} 
            handleOk={handleOk} 
            handleCancel={handleCancel} 
            handleFileUpload={handleFileUpload} 
            onTabChange={onTabChange} 
            defaultTab={tab} 
            error={error}
            onChange={onChange}
            dic={dic}
          />
          :
          <ReadModal 
            isModalOpen={isModalOpen} 
            handleOk={handleOkEdit} 
            handleCancel={handleCancel} 
            handleFileUpload={handleFileUpload} 
            onTabChange={onTabChangeEdit} 
            defaultTab={oldDic.readType} 
            error={error} 
            onChange={onChangeEdit}
            dic={oldDic}
          />
        }
        </div>
    );
  }

export default ReadCard;