
# stdlib imports
import os

# Thirdparty imports
import flask

# Local imports
import config
from hangmanapp import MainRoute


app = flask.Flask(__name__)
app.register_blueprint(MainRoute)

if os.environ.get('WERKZEUG_RUN_MAIN') == None:
    print(app.url_map)

app.run(port=8888, host='0.0.0.0', debug=config.is_debug)

