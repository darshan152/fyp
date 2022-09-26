import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'react-redux'
import './ribbon.css';

function HistoryCard(props) {
    const stepsArr = useSelector(state => state.stepsArr.value)

    return(
        <div>
            {stepsArr.map(function(steps, index){
                    return <Card className='step' key={ index }>{steps['type']}<button>Edit</button></Card>;
                  })}
        </div>
    );
}

export default HistoryCard;