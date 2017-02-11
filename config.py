
import os

is_debug = True
SECRET_KEY = os.getenv('HANGMAN_SECRET_KEY') or 'h4n6m4n-b4ck3nd-s3cr3t'
SESSION_TYPE = 'filesystem'

