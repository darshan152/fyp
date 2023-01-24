import { Card, Space, Button } from 'antd';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setAggregate, setPython, setRead, setWrite } from '../states/cardModalSlice';
import axios from 'axios';

import './components.css';
import { setEditData } from '../states/editDataSlice';
import { editStep } from '../states/stepsArrSlice';
import { setCurrentData,setDataTypes,setLoading } from '../states/csvDataSlice';
import { Table } from 'antd';
import update from 'immutability-helper';
import React, { useCallback, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


function HistoryCard(props) {
    const stepsArr = useSelector(state => state.stepsArr.value)
    const originalData = useSelector(state => state.csvData.value.originalData)
    const isLoading = useSelector(state => state.csvData.value.loading)
    console.log(stepsArr)
    const dispatch = useDispatch()

    const type = 'DraggableBodyRow';
  const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  let cursorType = 'move'
  if (stepsArr[index]) {
    if (stepsArr[index]['type'] === 'read' || stepsArr[index]['type'] === 'write') {
      cursorType = 'auto'
    }
  }
  console.log(restProps)
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{
        cursor: cursorType,
        ...style,
      }}
      {...restProps}
    />
  );
};


    const columns = [
      {
        title: 'Step',
        dataIndex: 'step',
        key: 'step',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button className='stepEditButton' onClick={() => handleEdit(stepsArr[record.key],record.key)} shape="round" icon={<EditOutlined />}/>
            { (stepsArr[record.key] && stepsArr[record.key].type!=='read') ?
            <Button className='stepDeleteButton' onClick={() => handleDelete(record.key)} shape="round" icon={<DeleteOutlined />}/> :
            null
          }
          </Space>
        ),
      },
    ];

    const handleEdit = (step,index) => {
      if (!isLoading) {
        console.log(step)
        if (step['type'] === 'python') {
            dispatch(setPython(true));
        } else if (step['type'] === 'read') {
            dispatch(setRead(true));
        } else if (step['type'] === 'write') {
          dispatch(setWrite(true));
        } else if (step['type'] === 'aggregation') {
          dispatch(setAggregate(true));
      } 

        const newStep = {
            ...step,
            index:index
        }
        dispatch(setEditData(newStep))
      }
    }

    const handleDelete = (index) => {
      if (!isLoading) {
        dispatch(setLoading(true))
        let newSteps = [...stepsArr]
        newSteps = newSteps.slice(0,index).concat(newSteps.slice(index+1,newSteps.length))
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:originalData,stepsArr:newSteps})
        .then(res => {
            dispatch(setCurrentData(res.data.data));
            dispatch(setDataTypes(res.data.datatypes));
            dispatch(editStep(newSteps));
            dispatch(setLoading(false))
        })
      }
    }



      let data = stepsArr.map(function(step, index){
            return (
                {
                    key: index,
                    step:step['type'],
                })})
      const components = {
        body: {
          row: DraggableBodyRow,
        },
      };
      const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
          if (hoverIndex === 0  || dragIndex === 0) {
            return
          }
          const handleStepsMove = (newStepsArr) => {
            console.log(newStepsArr)
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/retransform`, {data:originalData,stepsArr:newStepsArr})
              .then(res => {
                  dispatch(setCurrentData(res.data.data));
                  dispatch(setDataTypes(res.data.datatypes));
                  dispatch(editStep(newStepsArr));
              })
          }
          const dragRow = stepsArr[dragIndex];
          handleStepsMove(
            update(stepsArr, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
        },
        [stepsArr,dispatch,originalData],
      );
      console.log(stepsArr)
      return (
        <div>
        { stepsArr.length ? 
        <DndProvider backend={HTML5Backend}>
          <Table
            pagination={false} 
            scroll={{
            x: false,
            y: '65vh',
            }} 
            showHeader={false}
            columns={columns}
            dataSource={data}
            components={components}
            onRow={(_, index) => {
              const attr = {
                index,
                moveRow,
              };
              return attr;
            }}
          />
        </DndProvider>
        : <button onClick={() => dispatch(setRead(true))}>Read in data</button>} 
        </div>
      );

}

export default HistoryCard;