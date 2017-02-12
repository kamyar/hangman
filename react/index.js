import React from 'react';
import ReactDOM from 'react-dom';

import GameComp from './components/GameComp';

ReactDOM.render(
    <GameComp partial_word={GameModule.word_partial}/>,
    document.getElementById(`game-div`)
);
