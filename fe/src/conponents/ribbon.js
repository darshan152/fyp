import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';
import './ribbon.css';
import ReadCard from './readcard';
import PythonCard from './pythoncard';

function Ribbon(props) {

    return (
        <div>
        <ReadCard handleFileUpload={props.handleReadFileUpload} handleOk={props.handleReadOk}></ReadCard>
        <PythonCard handleOk={props.handleOk}></PythonCard>
        </div>
    );
  }

export default Ribbon;