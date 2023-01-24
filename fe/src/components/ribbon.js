import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';
import './components.css';
import ReadCard from './cards/readcard';
import PythonCard from './cards/pythoncard';
import WriteCard from './cards/writecard';
import AggregateCard from './cards/aggregatecard';

function Ribbon(props) {

    return (
        <div>
        <ReadCard></ReadCard>
        <PythonCard></PythonCard>
        <AggregateCard></AggregateCard>
        <WriteCard></WriteCard>

        </div>
    );
  }

export default Ribbon;