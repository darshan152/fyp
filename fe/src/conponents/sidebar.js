import React from 'react';
import { Card } from 'antd';
import HistoryCard from './historycard';
import './ribbon.css';

function SideBar(props) {
    return(
        <div>
            <Card className='sidecard'>
                <h3>Steps</h3>
                <HistoryCard></HistoryCard>
            </Card>
        </div>
    );
}

export default SideBar;