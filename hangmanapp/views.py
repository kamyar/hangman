
import json

import flask
from flask import views, render_template, session, request, jsonify

from common.NestableBlueprint import NestableBlueprint

from . import utils, config


MainRoute = NestableBlueprint('main', __name__, url_prefix="")

@MainRoute.register_method_view('/')
class MainView(flask.views.MethodView):
    def get(self):
        utils.handle_word()
        context = {
            'app_name': "Awesome Hangman"
        }
        context['word_partial'] = ['_'] * len(session['word_complete'])

        return render_template("index.html", context=context)

# TODO: also return total wrong guesses
@MainRoute.register_method_view('/guess')
class GuessView(flask.views.MethodView):
    def post(self):
        context = {}
        data = json.loads(request.data)
        guess_char = data.get("guess_char", '').lower()
        is_valid, error = utils.is_char_valid(guess_char)

        # is the char valid?
        if not is_valid:
            context['error'] =  error
        else:
            session['guessed_chars'].append(guess_char)
            # is the guess inside the word?
            if guess_char in session['word_complete']:
                context['char_exists'] = True
            else:
                context['char_exists'] = False
                session['wrong_guess_count'] += 1

        # max reached?
        if session['wrong_guess_count'] >= config.max_wrong_guess_count:
            context['error'] =  {
                'msg': "You reached your max guesses",
                'code': 1001
            }

        context['word_partial'] = [char if char in session['guessed_chars'] else '_' for char in session['word_complete']]
        context['guessed_chars'] = session['guessed_chars']
        # is the word reavealed completely?
        if '_' not in context['word_partial']:
            context['word_completed'] = True

        return jsonify(context)

