import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';
import './components.css';
import ReadCard from './cards/readcard';
import PythonCard from './cards/pythoncard';

function Ribbon(props) {

    return (
        <div>
        <ReadCard></ReadCard>
        <PythonCard></PythonCard>
        </div>
    );
  }

export default Ribbon;