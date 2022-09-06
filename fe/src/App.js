import logo from './logo.svg';
import { Layout } from 'antd';
import Ribbon from './conponents/ribbon';
import './App.css';

const { Header, Sider, Content } = Layout;


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Button type='primary'>Test</Button> */}
      <Layout>
        <Header>
          <Ribbon></Ribbon>
        </Header>
        <Layout>
          <Content>
            <p>Content</p>
          </Content>
          <Sider>Sider</Sider>
        </Layout>
      </Layout>
    </div>
  );
}


export default App;
