import logo from './logo.svg';
import { Layout } from 'antd';
import Ribbon from './conponents/ribbon';
import DataDisplay from './conponents/datadisplay';
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';

const { Header, Sider, Content } = Layout;


function App() {
  const [tableData, setTableData] = useState(undefined);
  const [tableCols, setTableCols] = useState(undefined);
  
  const [filename, setFilename] = useState("");

  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    console.log(name)
    setFilename(name);

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
          //.then(data => this.setState({ postId: data.id }));
      };
    reader.readAsBinaryString(file);
  };
  
  return (
    <div className="App">
      <Layout>
        <Header>
          <Ribbon handleFileUpload={handleFileUpload}></Ribbon>
        </Header>
        <Layout>
          <Content>
            <DataDisplay data={tableData} cols={tableCols}></DataDisplay>
          </Content>
          <Sider>Sider</Sider>
        </Layout>
      </Layout>
    </div>
  );
}


export default App;
