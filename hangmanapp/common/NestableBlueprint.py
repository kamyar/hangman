

from flask import Blueprint


class NestableBlueprint(Blueprint):
    """
        Hacking in support for nesting blueprints, until hopefully 
        https://github.com/mitsuhiko/flask/issues/593 will be resolved
    """
    def __init__(self, *args, **kwargs):
        super(NestableBlueprint, self).__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):
        super(NestableBlueprint, self).__call__(*args, **kwargs)

    def register_blueprint(self, blueprint, **options):
        def deferred(state):
            url_prefix = (state.url_prefix or u"") + (options.get('url_prefix', blueprint.url_prefix) or u"")
            if 'url_prefix' in options:
                del options['url_prefix']

            state.app.register_blueprint(blueprint, url_prefix=url_prefix, **options)
        self.record(deferred)

    def register_method_view(self, *args, **kwargs):
        def wrapper(method_view):
            name = method_view.__name__
            print("registering ", name)
            self.add_url_rule(*args, view_func=method_view.as_view(name), **kwargs)
            return method_view
        return wrapper
