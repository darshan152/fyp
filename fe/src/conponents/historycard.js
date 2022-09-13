import React, { useState } from 'react';
import { Card } from 'antd';
import './ribbon.css';

function HistoryCard(props) {
    console.log(props.stepsArr)

    return(
        <div>
            {props.stepsArr.map(function(steps, index){
                    return <Card className='step' key={ index }>{steps['type']}</Card>;
                  })}
        </div>
    );
}

export default HistoryCard;