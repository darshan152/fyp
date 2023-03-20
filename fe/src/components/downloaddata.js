import React from 'react';
import { useSelector } from 'react-redux'
import { Button } from 'antd';
import './components.css';
import { DownloadOutlined } from '@ant-design/icons';


function DownloadData(props) {
    const currentData = useSelector(state => state.csvData.value.currentData)

    const downloadCsv = () => {
        console.log('download clicked')
        
        const file = new Blob([currentData],{type: 'text/csv'})

        const element = document.createElement("a")
        element.href = URL.createObjectURL(file)
        element.download = "transformed_data.csv"

        document.body.appendChild(element)
        element.click()
    }
    return(
        <div style={{'display':'inline-block'}}>
            <Button id='csvDownload' type='primary' onClick={downloadCsv} value='download' shape='round' icon={<DownloadOutlined />}>Download</Button>
        </div>
    );
}

export default DownloadData;