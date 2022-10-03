import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setPython, setRead } from '../states/cardModalSlice';

import './ribbon.css';
import { setEditData } from '../states/editDataSlice';

function HistoryCard(props) {
    const stepsArr = useSelector(state => state.stepsArr.value)
    console.log(stepsArr)
    const dispatch = useDispatch()

    const handleEdit = (step,index) => {
        console.log(step)
        if (step['type'] === 'python') {
            dispatch(setPython(true));
        } else if (step['type'] === 'read') {
            dispatch(setRead(true));
        }

        const newStep = {
            ...step,
            index:index
        }
        dispatch(setEditData(newStep))

    }

    return(
        <div>
            {stepsArr.map(function(step, index){
                    return <Card className='step' key={ index }>{step['type']}<button onClick={()=>handleEdit(step,index)}>Edit</button></Card>;
                  })}
        </div>
    );
}

export default HistoryCard;