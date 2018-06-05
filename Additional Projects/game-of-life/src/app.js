import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css/normalize.css';
import './styles/styles.scss';

import GameOfLifeApp from './components/GameOfLifeApp';

ReactDOM.render(<GameOfLifeApp />, document.getElementById('app'));