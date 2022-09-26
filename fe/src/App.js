import { Layout } from 'antd';
import Ribbon from './conponents/ribbon';
import DataDisplay from './conponents/datadisplay';
import SideBar from './conponents/sidebar';
import './App.css';
import React from 'react';


const { Header, Sider, Content } = Layout;


function App() {

  return (
    <div className="App">
      <Layout>
        <Header>
          <Ribbon></Ribbon>
        </Header>
        <Layout>
          <Content>
            <DataDisplay></DataDisplay>
          </Content>
          <Sider><SideBar/></Sider>
        </Layout>
      </Layout>
    </div>
  );

  


}


export default App;
