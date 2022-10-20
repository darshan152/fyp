import React from 'react';
import { useSelector } from 'react-redux'
import './components.css';


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
        <div>
            <button id='csvDownload' onClick={downloadCsv} value='download'>Download</button>
        </div>
    );
}

export default DownloadData;