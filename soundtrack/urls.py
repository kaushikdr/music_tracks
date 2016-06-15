from django.conf.urls import patterns, url
from soundtrack import views


urlpatterns = [
    
    url(r'^track/(?P<track_id>[0-9]?)(/?)$', views.TrackView.as_view()),
    url(r'^genre/(?P<genre_id>[0-9]?)(/?)$', views.GenreView.as_view()),
    url(r'^search/$', views.Search.as_view()),


]