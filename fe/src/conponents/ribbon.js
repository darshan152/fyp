import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';
import './components.css';
import ReadCard from './readcard';

function Ribbon(props) {

    return (
        <div>
        <ReadCard></ReadCard>
        <Card>
            <p>Meow</p>
        </Card>
        </div>
    );
  }

export default Ribbon;