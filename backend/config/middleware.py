from config.containers import Container


class DependencyInjectorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.container = Container()

    def __call__(self, request):
        request.container = self.container
        response = self.get_response(request)
        return response
