import React from 'react';
import ReactDOM from 'react-dom';

import GameComp from './components/GameComp';

console.log(document.getElementById(`game-div`));
console.log(GameComp);
ReactDOM.render(
    <GameComp  />,
    document.getElementById(`game-div`)
);
