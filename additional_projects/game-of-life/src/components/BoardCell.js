import React from 'react';

const BoardCell = (props) => (
    <button 
        className={props.isAlive ? "board-cell-button-alive" : "board-cell-button-dead"}
        onClick={() => props.handleCellClick(props.cellNumber)}>
    </button>
);

export default BoardCell;