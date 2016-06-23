from django.conf.urls import patterns, url
from soundtrack import views


urlpatterns = [
    
    url(r'^track/(?P<page>[0-9]*)(/?)(?P<track_id>[0-9]*)(/?)$', views.TrackView.as_view()),
    # url(r'^trackup/(?P<track_id>[0-9]?)(/?)$', views.test),	
    url(r'^genre/(?P<genre_id>[0-9]*)(/?)$', views.GenreView.as_view()),
    url(r'^search/(?P<page>[0-9]*)(/?)$', views.Search.as_view()),


]