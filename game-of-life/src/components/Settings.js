import React from 'react';

const Settings = (props) => (
    <div className="settings">
        <p>Generations: {props.generationsCount}</p>
        <button className="button-settings" onClick={props.handleGenerationAdvance}>Advance +1 Gen</button>
        <button className="button-settings" onClick={props.handleAutoGenerationAdvance}>Advance Automatically</button>
        <button className="button-settings" onClick={props.handleAutoGenerationStopAdvancing}>Stop Advancing</button>
        <button className="button-settings" onClick={props.handleClearBoardState}>Clear</button>
        <button className="button-settings" onClick={props.handleGenerateRandomBoardPattern}>Generate Random Board</button>
    </div>
);

export default Settings;