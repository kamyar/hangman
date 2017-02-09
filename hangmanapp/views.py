

from flask import views

from common.NestableBlueprint import NestableBlueprint

MainRoute = NestableBlueprint('main', __name__, url_prefix="")

@MainRoute.register_method_view('/')
class MainView(flask.views.MethodView):
    def get(self):
        return "Hello World!"
