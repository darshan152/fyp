import { Button, Card, Table } from 'antd';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import React, { useState } from 'react';
import './ribbon.css';
import { parse } from 'papaparse';


function DataDisplay(props) {
  const [parsedData, setParsedData] = useState(undefined);

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

     
    console.log(props.data)
    // if (props.data !== undefined && parsedData !== parse(props.data)) {
    //   console.log(parse(props.data))
    //   setParsedData(parse(props.data))
    // }

    return (
        <div>
            <Table dataSource={props.data} columns={props.cols} />
        </div>
    );
  }

export default DataDisplay;