import React from 'react';

import Header from './Header';
import Settings from './Settings';
import Board from './Board';

class GameOfLifeApp extends React.Component {
    state = {
        boardSize: {
            x: 30,
            y: 20
        },
        cellArray: [],
        generationsCount: 0,
        autoAdvanceId: undefined
    };
    handleAutoGenerationAdvance = () => {
        this.setState( () => ({
            autoAdvanceId: setInterval(this.handleGenerationAdvance, 100)
        }));
    }
    handleAutoGenerationStopAdvancing = () => {
        this.setState( (prevState) => ({
            autoAdvanceId: clearInterval(prevState.autoAdvanceId)
        }));
    }
    handleCellClick = (cellNumber) => {
        this.state.cellArray[cellNumber] ? 
        this.setState( (prevState) => ({
            cellArray: [...prevState.cellArray.slice(0,cellNumber), false, ...prevState.cellArray.slice(cellNumber+1, prevState.cellArray.length)]
        })) : 
        this.setState( (prevState) => ({
            cellArray: [...prevState.cellArray.slice(0,cellNumber), true, ...prevState.cellArray.slice(cellNumber+1, prevState.cellArray.length)]
        })) ;
    };
    handleGenerationAdvance = () => {
        const nextGenArray = this.state.cellArray.map( (cell, index) => {

            const boardSizeX = this.state.boardSize.x;
            const boardSizeY = this.state.boardSize.y;

            // X and Y offsets are both based on boardSizeX
            const x = index % boardSizeX;
            const y = Math.trunc(index / boardSizeX);

            const neighborsArrayCoords = [
                [x-1, y-1],
                [x-1, y],
                [x-1, y+1],
                [x, y-1],
                [x, y+1],
                [x+1, y-1],
                [x+1, y],
                [x+1, y+1]
            ]
            const neighborsArrayIndices = neighborsArrayCoords.map( (neighbor) => {
                const x = neighbor[0];
                const y = neighbor[1];
                let newX;
                let newY;
                // Handle corrections for X out of bounds
                if (x < 0) {
                    newX = x + boardSizeX;
                } else if (x >= boardSizeX) {
                    newX = x - boardSizeX;
                } else {
                    newX = x;
                }
                // Handle corrections for Y out of bounds
                if (y < 0) {
                    newY = y + boardSizeY;
                } else if (y >= boardSizeY) {
                    newY = y - boardSizeY;
                } else {
                    newY = y;
                }
                // Convert X/Y back to index
                const newIndex = newY * boardSizeX + newX;
                // Return indices
                return newIndex;
            });
            // Reduce the neighborsArrayIndices to # of living neighbors
            const numNeighborsAlive = neighborsArrayIndices.reduce( (accum, curVal) => {
                if (this.state.cellArray[curVal]) {
                    return accum + 1;
                }
                else {
                    return accum;
                }
            }, 0);
            // Determine whether to return alive or dead based on # of living neighbors
            if (cell) {
                // Dies if too few or too many alive neighbors
                if (numNeighborsAlive <= 1 || numNeighborsAlive >= 4) {
                    return false;
                }
                else {
                    return true;
                }
            }
            if (!cell) {
                // Comes to life if exactly 3 alive neighbors
                if (numNeighborsAlive === 3) {
                    return true;
                }
                else {
                    return false;
                }
            }
        });
        this.setState( (prevState) => ({
            cellArray: nextGenArray,
            generationsCount: prevState.generationsCount + 1
        }));
    };
    handleGenerateRandomBoardPattern = () => {
        const boardCells = this.state.boardSize.x * this.state.boardSize.y;
        const newCellArray = [];
        for (let i = 0; i < boardCells; i++) {
            const randomNum = Math.floor(Math.random()*2);
            randomNum === 1 ? newCellArray.push(true) : newCellArray.push(false);
        }
        this.setState( () => ({
            cellArray: newCellArray
        }));
    }
    // Note: handleClearBoardState() only resets cellArray and generationsCount.
    // There's no need for a function that clears all items in the state.
    // May want to clarify function naming or how state is formatted at a later date.
    handleClearBoardState = () => {
        const boardCells = this.state.boardSize.x * this.state.boardSize.y;
        const newCellArray = [];
        for (let i = 0; i < boardCells; i++) {
            newCellArray.push(false);
        }
        this.setState( () => ({
            cellArray: newCellArray,
            generationsCount: 0
        }));
    }
    componentDidMount() {
        // Generate random board pattern
        this.handleGenerateRandomBoardPattern();
        // Start the simulation so that it runs on load
        this.handleAutoGenerationAdvance();
    }
    render() {
        return (
            <div>
                <Header />
                <div className='container'>
                    <div id='settings'>
                        <Settings 
                            handleAutoGenerationAdvance = {this.handleAutoGenerationAdvance}
                            handleAutoGenerationStopAdvancing = {this.handleAutoGenerationStopAdvancing}
                            handleGenerationAdvance = {this.handleGenerationAdvance}
                            handleClearBoardState = {this.handleClearBoardState}
                            handleGenerateRandomBoardPattern = {this.handleGenerateRandomBoardPattern}
                            generationsCount = {this.state.generationsCount}
                        />
                    </div>
                    <div id='board'>
                        <Board 
                            cellArray={this.state.cellArray}
                            handleCellClick={this.handleCellClick}
                        />
                    </div>
                </div>
            </div>
        )
    }
};

export default GameOfLifeApp;