import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';
import './components.css';
import ReadCard from './cards/readcard';
import PythonCard from './cards/pythoncard';
import WriteCard from './cards/writecard';
import AggregateCard from './cards/aggregatecard';
import AddCard from './cards/addcard';
import JoinCard from './cards/joincard';
import ScaleCard from './cards/scalecard';
import MissingCard from './cards/missingcard';

function Ribbon(props) {

    return (
        <div>
        <ReadCard></ReadCard>
        <PythonCard></PythonCard>
        <AggregateCard></AggregateCard>
        <AddCard></AddCard>
        <JoinCard></JoinCard>
        <ScaleCard></ScaleCard>
        <MissingCard></MissingCard>
        <WriteCard></WriteCard>


        </div>
    );
  }

export default Ribbon;