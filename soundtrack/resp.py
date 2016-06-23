from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.views import APIView


class GreedyView(APIView):

    def send_response(self, status, data=None):
        if status == 1:
            return Response({'status': 'success', 'data': data})
        if status == 0:
            return Response({'status': 'error', 'detail': data or "Sorry, Please try later."})

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(GreedyView, self).dispatch(*args, **kwargs)


def greedy_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.

    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response and response.status_code in [400, 401, 403, 404, 500, 405]:
        response.data['status'] = "error"
    return response
