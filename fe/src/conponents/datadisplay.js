import { Table } from 'antd';
import React from 'react';
import './ribbon.css';
import { useSelector }  from 'react-redux'
import Papa from "papaparse";


function DataDisplay(props) {
  const currentData = useSelector(state => state.csvData.value.currentData)

  let parsedData = ""
  let cols = ""
  if (currentData) {
    parsedData = Papa.parse(currentData,
      {
        'header': true,
      }
    );
    cols = parsedData.meta.fields.map(function (field, index) {
      return {
        title: field,
        dataIndex: field,
        key: field,
      };
    });     
  }

    return (
        <div>
            <Table dataSource={parsedData.data} columns={cols} />
        </div>
    );
  }

export default DataDisplay;