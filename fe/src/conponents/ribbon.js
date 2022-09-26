import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';
import './ribbon.css';
import ReadCard from './readcard';
import PythonCard from './pythoncard';

function Ribbon(props) {

    return (
        <div>
        <ReadCard></ReadCard>
        <PythonCard></PythonCard>
        </div>
    );
  }

export default Ribbon;