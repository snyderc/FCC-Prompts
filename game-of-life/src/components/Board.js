import React from 'react';

import BoardCell from './BoardCell';

const Board = (props) => (
    <div className="board">
        {props.cellArray.map( (cell, index) => (
            <BoardCell 
                key={index}
                cellNumber={index}
                handleCellClick={props.handleCellClick}
                isAlive={cell}
            />
        ))}
    </div>
);

export default Board;