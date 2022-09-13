import logo from './logo.svg';
import { Layout } from 'antd';
import Ribbon from './conponents/ribbon';
import DataDisplay from './conponents/datadisplay';
import SideBar from './conponents/sidebar';
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';

const { Header, Sider, Content } = Layout;


function App() {
  const [tableData, setTableData] = useState(undefined);
  const [tableCols, setTableCols] = useState(undefined);
  const [filename, setFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [stepsArr, setStepsArr] = useState([]);
  var tempStepsArr = [];

  const handleReadOk = () => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
      const { result } = evt.target;

      axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, {data:result})
      .then(res => {
        console.log(res);
        setTableData(res.data.data);
        setTableCols(res.data.cols);
      })
    };
    reader.readAsBinaryString(selectedFile);

    tempStepsArr = [];
    tempStepsArr.push(
    {'type':'read',
    'filename':filename, 
    })
    setStepsArr(tempStepsArr)
    console.log(tempStepsArr)
  }

  const handleReadFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    console.log(name)
    setFilename(name);
    setSelectedFile(file);

    // const reader = new FileReader();
    // reader.onload = (evt) => {
    //   if (!evt?.target?.result) {
    //     return;
    //   }
    //   const { result } = evt.target;

    //   axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, {data:result})
    //   .then(res => {
    //     console.log(res);
    //     setTableData(res.data.data);
    //     setTableCols(res.data.cols);
    //   })
    // };
    // reader.readAsBinaryString(file);
  };
  
  return (
    <div className="App">
      <Layout>
        <Header>
          <Ribbon handleReadFileUpload={handleReadFileUpload} handleReadOk={handleReadOk}></Ribbon>
        </Header>
        <Layout>
          <Content>
            <DataDisplay data={tableData} cols={tableCols}></DataDisplay>
          </Content>
          <Sider><SideBar stepsArr={stepsArr}/></Sider>
        </Layout>
      </Layout>
    </div>
  );
}


export default App;
