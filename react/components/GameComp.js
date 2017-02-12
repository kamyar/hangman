
import React from "react";


export default class GameComp extends React.Component {
    _bind(methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    constructor(props) {
        super(props);
        this.state = {
            partial_word: this.props.partial_word,
            wrongGuessCount: 0,
            feedback: {},
        };
        this._bind([
            'guessInputHandler',
            'getGuessComp',
            'submitGuess',
        ]);
    }

    submitGuess() {
        console.log("will check");
        fetch('/guess', {
            method: 'post',
            body: JSON.stringify({
                guess_char: this.state.guessChar
            }),
            credentials: 'include' 
        }).then(response => response.json())
        .then(function(response) {
            console.log(response);
            if (response.error && response.error.msg) {
                this.setState({
                    guessChar: '',
                    feedback: response.error.msg
                });
            } else if(!response.char_exists) {
               this.setState({
                   guessChar: '',
                   feedback: "Wrong guess, sorry!"
               }); 
            }
            // TODO:
            // set partial_word
            // give feedback
            // check error
        }).catch(function(err) {
            console.log(err);
        });
    }

    guessInputHandler(e) {
        var alphanumRegex = /^[a-z0-9]$/
        var guessChar = e.target.value;
        if (!guessChar) {
            this.setState({
                guessChar: '',
                feedback: {}
            });
            return;
        }
        if (!alphanumRegex.test(guessChar)) {
            this.setState({
                feedback: {
                    msg: "Guess should be alphanumeric!",
                    is_error: true,
                }
            });
            return;
        }

        this.setState({
            guessChar: e.target.value,
            feedback: {
                msg: "Look good, should we check it?",
                is_error: false,
            }
        });
    }

    getFeedbackComp() {
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
        var wordComp = this.state.partial_word.map(function(v, i) {
            return (
                <div key={i} className="game-char">
                    {v}
                </div>
            )
        });
        return wordComp;
    }

    getGuessComp() {
        return (
            <div className="flex-set flex--content-center">
                <input
                    type="text"
                    onChange={this.guessInputHandler} 
                    maxLength={1} 
                    defaultValue={this.state.guessChar}>
                </input>
                <button 
                    onClick={this.submitGuess}
                    disabled={!this.state.guessChar}
                    >
                    Let check this
                </button>
            </div>
        )
    }

    render() {
        // console.log(this.props.partial_word);
        return (
            <div className="flex-set flex--content-around flex--column">
                <div className="flex-set flex--content-around">
                    <div className="flex-set flex--content-around game-inner" >
                        {this.getWordComp()}
                    </div>
                </div>
                {this.getGuessComp()}
                {this.getFeedbackComp()}

            </div>
        );
    }
}