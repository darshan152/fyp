import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setPython, setRead } from '../states/cardModalSlice';
import axios from 'axios';

import './ribbon.css';
import { setEditData } from '../states/editDataSlice';
import { editStep } from '../states/stepsArrSlice';
import { setCurrentData } from '../states/csvDataSlice';

function HistoryCard(props) {
    const stepsArr = useSelector(state => state.stepsArr.value)
    const originalData = useSelector(state => state.csvData.value.originalData)
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

    const handleDelete = (index) => {
        let newSteps = [...stepsArr]
        newSteps = newSteps.slice(0,index).concat(newSteps.slice(index+1,newSteps.length))
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:originalData,stepsArr:newSteps})
        .then(res => {
            dispatch(setCurrentData(res.data));
            dispatch(editStep(newSteps));
        })

    }

    return(
        <div>
            {stepsArr.map(function(step, index){
                    return (
                        <Card className='step' key={ index }>
                            {step['type']}
                            <button onClick={()=>handleEdit(step,index)}>Edit</button>
                            { step['type'] !== 'read' ? 
                            <button onClick={()=>handleDelete(index)}>Delete</button>
                            : null}
                        </Card>
                    )
                  })}
        </div>
    );
}

export default HistoryCard;