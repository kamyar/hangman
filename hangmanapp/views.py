
import flask
from flask import views
from flask import render_template

from common.NestableBlueprint import NestableBlueprint

MainRoute = NestableBlueprint('main', __name__, url_prefix="")

@MainRoute.register_method_view('/')
class MainView(flask.views.MethodView):
    def get(self):
    	context = {
    		'words': []
    	}
        return render_template("index.html", context=context)

