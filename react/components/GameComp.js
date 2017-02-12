
import React from "react";

export default class GameComp extends React.Component {
    _bind(methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    constructor(props) {
        super(props);
        var state = {
            feedback : {}
        }
        Object.assign(state, props)
        this.state = state;
        this._bind([
            'guessInputHandler',
            'getGuessComp',
            'submitGuess',
            'resetGame',
        ]);
    }

    resetGame() {
        /*
            Submit reset request to backend
        */
        var that = this;
        fetch('/reset', {
            method: 'post',
            credentials: 'include' 
        }).then(response => response.json())
        .then(function(response) {
            that.setState(response);
        }).catch(function(err) {
            console.log(err);
        });
    }

    submitGuess() {
        /*
            Submit the guess to backend
        */
        this.refs.guess_input.value = '';
        var that = this;
        fetch('/guess', {
            method: 'post',
            body: JSON.stringify({
                guess_char: that.state.guess_char
            }),
            credentials: 'include' 
        }).then(response => response.json())
        .then(function(response) {
            var newState = {
                guess_char: ''
            }
            if (response.failed) {
                newState.feedback = {
                    msg: "Game Over! :(",
                    is_error: true,
                }
            } else if (response.error && response.error.msg) {
                newState.feedback = {
                    msg: response.error.msg,
                    is_error: true,
                };
            } else if(!response.char_exists) {
                newState.feedback = {
                    msg: "Wrong guess, sorry!",
                    is_error: true,
                };
            } else {
                if (response.word_completed) {
                    newState.feedback = {
                        msg: "Hey! Congrats, you found it!",
                        is_error: false,
                    }
                }
            }
            Object.assign(newState, response)
            that.setState(newState);
        }).catch(function(err) {
            console.log(err);
        });
    }

    guessInputHandler() {
        /*
            Handle input field value change(and its validity)
        */
        var alphanumRegex = /^[a-z0-9]$/
        var guess_char = this.refs.guess_input.value;
        if (!guess_char) {
            this.setState({
                guess_char: '',
                feedback: {}
            });
            return;
        }
        if (!alphanumRegex.test(guess_char)) {
            this.setState({
                feedback: {
                    msg: "Guess should be alphanumeric!",
                    is_error: true,
                }
            });
            return;
        }
        if (this.state.guessed_chars.indexOf(guess_char) > -1) {
            this.setState({
                feedback: {
                    msg: "Already guessed it, try another!",
                    is_error: true,
                }
            });
            return;
        }

        this.setState({
            guess_char: guess_char,
            feedback: {
                msg: "Look good, should we check it?",
                is_error: false,
            }
        });
    }

    getFeedbackComp() {
        /*
            Show feedback about the latest development in game state
        */
        var feedbackComp;
        if (this.state.feedback && this.state.feedback.msg) {
            var feedbackClass = this.state.feedback.is_error ? 'error':'success';
            feedbackComp = (
                <div className={`flex-set flex--content-center ${feedbackClass}-comp`}>
                    {this.state.feedback.msg}
                </div>
            )
        }
        return feedbackComp;
    }


    getWordComp() {
        /*
            Show current state of the word
        */
        var wordComp = this.state.word_partial.map(function(v, i) {
            return (
                <div key={i} className="game-char">
                    {v}
                </div>
            )
        });
        return wordComp;
    }

    getGuessComp() {
        /*
            Show input field and buttons
        */
        return (
            <div className="flex-set flex--content-center">
                <input
                    type="text"
                    ref="guess_input"
                    onChange={this.guessInputHandler} 
                    maxLength={1} 
                    disabled={this.state.failed || this.state.word_completed}>
                </input>
                <button 
                    onClick={this.submitGuess}
                    disabled={!this.state.guess_char}>
                    Let check this
                </button>
                <button 
                    onClick={this.resetGame}>
                    Reset
                </button>
            </div>
        )
    }

    getAlreadyGuessedCharComp() {
        /*
            Show already guessed chars
        */
        var guessedCharsComp = this.state.guessed_chars.map(function(v, i) {
            return (
                <div key={i} style={{minWidth:"50px"}}>
                    {v}
                </div>
            )
        })
        return (
            <div className="flex-set flex--content-around flex--wrap">
                {guessedCharsComp}
            </div>
        )
    }

    render() {
        var statusText = `${this.state.wrong_guess_count} wrong guesses out of ${this.state.max_wrong_guess_count}`;
        if (this.state.failed) {
            var statusText = `You reached maximum wrong guess of ${this.state.max_wrong_guess_count}, try again? :)`;
        }
        return (
            <div className="flex-set flex--content-around flex--column">
                <div className="flex-set flex--content-around">
                    <img src={`/static/img/Hangman-${this.state.wrong_guess_count}.png`} alt=""/>
                </div>
                <div className="flex-set flex--content-around">
                    <div className="flex-set flex--content-around game-inner" >
                        {this.getWordComp()}
                    </div>
                </div>
                {this.getGuessComp()}
                <div className="flex-set flex--content-center status-comp">
                    {statusText}
                </div>
                {this.getAlreadyGuessedCharComp()}
                {this.getFeedbackComp()}

            </div>
        );
    }
}