
# stdlib imports
import os

# Thirdparty imports
import flask
from flask_session import Session

# Local imports
import config
from hangmanapp import MainRoute

app = flask.Flask(__name__)

app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['SESSION_TYPE'] = config.SESSION_TYPE

Session(app)

app.register_blueprint(MainRoute)

if __name__ == '__main__':
    app.run(port=8888, host='0.0.0.0', debug=config.is_debug)

