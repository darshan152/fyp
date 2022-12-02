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
import { setEditData } from '../../states/editDataSlice'


function ReadCard(props) {
    const [selectedFile, setSelectedFile] = useState(undefined);

    const filename = useSelector(state => state.csvData.value.filename)
    const isModalOpen = useSelector(state => state.cardModal.value.read)
    const stepsArr = useSelector(state => state.stepsArr.value)
    const oldDic = useSelector(state => state.editData.value.dic)
    const originalData = useSelector(state => state.csvData.value.originalData)
    const isEdit = useSelector(state => state.editData.value.isEdit)
    const dispatch = useDispatch()

    const [code, setCode] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [tab, setTab] = useState("delimited");

    const onTabChange = (e) => {
      setTab(e)
      dispatch(setFilename(""))
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
      dispatch(setRead(false));
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
        'fileType':filename.split('.').at(-1).toLowerCase(),
        'readType':tab,
        'delimiter':delimiter,
        'code':code,
        })
        dispatch(rewriteSteps(tempStepsArr))
        console.log(tempStepsArr)      
        
        console.log('Modal Ok')
        processCsv(result,tempStepsArr[0]);

      };
      reader.readAsBinaryString(selectedFile);
  
      
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
      dispatch(setRead(false));
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (!evt?.target?.result) {
          return;
        }
        const { result } = evt.target;
  
        dispatch(setOriginalData(result));
        let tempStepsArr = [...stepsArr]
        let newDic = {...oldDic}
        newDic.filename = filename
        newDic.fileType = filename.split('.').at(-1).toLowerCase()
        tempStepsArr[0] = newDic
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
      dispatch(setFilename(name))
      setSelectedFile(file);
    };

    function processCsv(result, dic) {
      dispatch(setOriginalData(result))
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, { data: result, dic:dic })
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
          <ReadModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} handleFileUpload={handleFileUpload} handleCodeChange={handleCodeChange} handleDelimiterChange
          ={handleDelimiterChange} code={code} delimiter={delimiter} onTabChange={onTabChange} defaultTab={'delimited'}/>
          :<ReadModal isModalOpen={isModalOpen} handleOk={handleOkEdit} handleCancel={handleCancel} handleFileUpload={handleFileUpload} handleCodeChange={handleCodeChangeEdit} handleDelimiterChange
          ={handleDelimiterChangeEdit} code={oldDic.code} delimiter={oldDic.delimiter} onTabChange={onTabChangeEdit} defaultTab={oldDic.readType} />
        }
        </div>
    );
  }

export default ReadCard;