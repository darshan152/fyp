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
import DeleteCard from './cards/deletecard';
import FilterCard from './cards/filtercard';
import EncodeCard from './cards/encodecard';
import DatatypeCard from './cards/datatypecard';
import RenameCard from './cards/renamecard';

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
        <DeleteCard></DeleteCard>
        <FilterCard></FilterCard>
        <EncodeCard></EncodeCard>
        <DatatypeCard></DatatypeCard>
        <RenameCard></RenameCard>
        <WriteCard></WriteCard>


        </div>
    );
  }

export default Ribbon;