import React from 'react';
import { Card } from 'antd';
import HistoryCard from './historycard';
import './components.css';
import DownloadData from './downloaddata';

function SideBar(props) {
    return(
        <div>
            <Card className='sidecard'>
                <h3>Steps</h3>
                <HistoryCard></HistoryCard>
            </Card>
            <DownloadData/>
        </div>
    );
}

export default SideBar;