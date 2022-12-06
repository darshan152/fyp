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


function ReadCard(props) {
    const [selectedFile, setSelectedFile] = useState(undefined);

    const filename = useSelector(state => state.csvData.value.filename)
    const isModalOpen = useSelector(state => state.cardModal.value.read)
    const stepsArr = useSelector(state => state.stepsArr.value)
    const oldDic = useSelector(state => state.editData.value.dic)
    // const originalData = useSelector(state => state.csvData.value.originalData)
    const isEdit = useSelector(state => state.editData.value.isEdit)
    const dispatch = useDispatch()

    const [code, setCode] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [tab, setTab] = useState("delimited");
    const [error, setError] = useState("");

    const onTabChange = (e) => {
      setTab(e)
      dispatch(setFilename(""))
      setError('')
      setSelectedFile(null);
    };

    const onTabChangeEdit = (e) => {
      let newdic = {...oldDic}
      newdic.readType=e
      dispatch(setEditData(newdic))
      dispatch(setFilename(""))
      setSelectedFile(null);
    };

    const showModal = () => {
      dispatch(setRead(true));
      console.log('Opening Modal')
    };
  
    const handleOk = () => {
      dispatch(setLoading(true))
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
  
        let tempStepsArr = [];
        tempStepsArr.push(
        {'type':'read',
        'filename':filename, 
        // 'fileType':filename.split('.').at(-1).toLowerCase(),
        'readType':tab,
        'delimiter':delimiter,
        'code':code,
        })
        console.log(tempStepsArr)      
        
        console.log('Modal Ok')
        dispatch(setOriginalData(result))
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: result, dic:tempStepsArr[0] })
          .then(res => {
            dispatch(rewriteSteps(tempStepsArr))
            dispatch(setOriginalData(result));
            dispatch(setRead(false));
            dispatch(setCurrentData(res.data.data))
            dispatch(setDataTypes(res.data.datatypes))
            dispatch(setLoading(false))
            setError('')
          })
          .catch((error)=> {
            setError(error.response.data)
            dispatch(setLoading(false))
          });

      };
      try {
        reader.readAsBinaryString(selectedFile);
      } catch {
        setError('Please upload a file.')
        dispatch(setLoading(false))
      }
  
      
    };

    const handleCodeChange = (e) => {
      console.log(e)
      setCode(e);
    };

    const handleCodeChangeEdit = (e) => {
      let newdic = {...oldDic}
      newdic.code=e
      dispatch(setEditData(newdic))
    };

    const handleDelimiterChange = (e) => {
      console.log(e.nativeEvent.data)
      setDelimiter(e.nativeEvent.data);
    };

    const handleDelimiterChangeEdit = (e) => {
      let newdic = {...oldDic}
      newdic.delimiter=e.nativeEvent.data
      dispatch(setEditData(newdic))
    };

    const handleOkEdit = () => {
      dispatch(setLoading(true))
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
  
        
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
          dispatch(setRead(false));
          dispatch(setLoading(false))
          setError('')
        }).catch((error)=> {
          setError(error.response.data)
          dispatch(setLoading(false))
        });
        
      };
      try {
        reader.readAsBinaryString(selectedFile);
      } catch {
        setError('Please upload a file.')
        dispatch(setLoading(false))
      }

    };
  
    const handleCancel = () => {
      dispatch(setRead(false));
      setError('')
      console.log('Modal Cancel')
      //dispatch(setLoading(false))
    };

    const handleFileUpload = (e) => {
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
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
          <ReadModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} handleFileUpload={handleFileUpload} handleCodeChange={handleCodeChange} handleDelimiterChange
          ={handleDelimiterChange} code={code} delimiter={delimiter} onTabChange={onTabChange} defaultTab={'delimited'} error={error}/>
          :<ReadModal isModalOpen={isModalOpen} handleOk={handleOkEdit} handleCancel={handleCancel} handleFileUpload={handleFileUpload} handleCodeChange={handleCodeChangeEdit} handleDelimiterChange
          ={handleDelimiterChangeEdit} code={oldDic.code} delimiter={oldDic.delimiter} onTabChange={onTabChangeEdit} defaultTab={oldDic.readType} error={error} />
        }
        </div>
    );
  }

export default ReadCard;