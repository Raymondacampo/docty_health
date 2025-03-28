# middleware.py
class CustomXFrameOptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Allow framing for media files
        if request.path.startswith('/media/'):
            response['X-Frame-Options'] = 'ALLOW'
        return response