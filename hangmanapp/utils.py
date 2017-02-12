"""
    Hangman Game utility functions
"""
import random

from flask import session

from . import config


def choose_target_word():
    return random.choice(config.words)


def handle_word_selection():
    """
        Choose a word and set related session fields
    """
    if not 'word_complete' in session:
        chosen_word = choose_target_word()
        session['word_complete'] = chosen_word
        session['wrong_guess_count'] = 0
        session['guessed_chars'] = []
    else:
        pass


def is_char_valid(char):
    """
        Backend validation of the guessed char
    """
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

def get_game_context():
    """
        Provide common game state info
    """
    context = {}
    context['app_name'] = "Awesome Hangman"
    context['word_partial'] = [char if char in session['guessed_chars'] else '_' for char in session['word_complete']]
    context['guessed_chars'] = session['guessed_chars']
    context['wrong_guess_count'] = session['wrong_guess_count']
    context['max_wrong_guess_count'] = config.max_wrong_guess_count
    if '_' not in context['word_partial']:
        context['word_completed'] = True
    else:
        context['word_completed'] = False

    if session['wrong_guess_count'] >= config.max_wrong_guess_count:
        context['failed'] = True
        context['word'] = session['word_complete']
    else:
        context['failed'] = False
        context['word'] = ''


    return context


