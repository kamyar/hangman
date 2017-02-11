
import random

from flask import session

from .config import words


def choose_target_word():
    return random.choice(words)


def handle_word():
    if not 'word_complete' in session:
        chosen_word = choose_target_word()
        session['word_complete'] = chosen_word
        session['wrong_guess_count'] = 0
        session['guessed_chars'] = []
    else:
        print "already selected", session['word_complete']


def is_char_valid(char):
    error = None
    if not char.isalnum():
        error =  {
            'msg': "Character you are guessing should be alphanumeric(1...9 or a...z)",
            'code': 1002
        }
    elif not char:
        error =  {
            'msg': "You did not guess anything",
            'code': 1003
        }
    elif char in session['guessed_chars']:
        error = {
            'msg': "You have already guessed this",
            'code': 1004
        }

    if error:
        return False, error
    else:
        return True, {}

