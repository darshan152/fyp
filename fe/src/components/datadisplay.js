import { Table } from 'antd';
import React from 'react';
import './components.css';
import { useSelector }  from 'react-redux'
import Papa from "papaparse";


function DataDisplay(props) {
  const currentData = useSelector(state => state.csvData.value.currentData)
  const datatypes = useSelector(state => state.csvData.value.datatypes)

  let parsedData = ""
  let cols = ""
  if (currentData) {
    parsedData = Papa.parse(currentData,
      {
        'header': true,
      }
    );
    let json = {}
    if (datatypes) {
      json = datatypes
    }
    cols = parsedData.meta.fields.map(function (field, index) {
      return {
        title: field,
        children: [{
          title: json[field],
          dataIndex: field,
          key: field,
        }],        
      };
    });     
  }
  

    return (
        <div>
            <Table 
            className='datatable' 
            dataSource={parsedData.data} 
            pagination={false} 
            scroll={{
            x: true,
            y: '70vh',
            }} 
            columns={cols} />
        </div>
    );
  }

export default DataDisplay;