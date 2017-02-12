import React from 'react';
import ReactDOM from 'react-dom';

import GameComp from './components/GameComp';

ReactDOM.render(
    <GameComp {...GameModule}/>,
    document.getElementById(`game-div`)
);
