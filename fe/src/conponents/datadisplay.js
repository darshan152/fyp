import { Button, Card, Table } from 'antd';
import React, { useState } from 'react';
import './components.css';


function DataDisplay(props) {

    const columns = [
        {
          title: 'A',
          dataIndex: 'A',
          key: 'A',
        },
        {
          title: 'B',
          dataIndex: 'B',
          key: 'B',
        },
        {
          title: 'Type',
          dataIndex: 'Type',
          key: 'Type',
        },
      ];

    return (
        <div>
            <Table  dataSource={props.data} columns={props.cols} >
            </Table>
        </div>
    );
  }

export default DataDisplay;