from django.shortcuts import render
from soundtrack.models import Track, Genre, RATING_CHOICE
from soundtrack.resp import GreedyView
from soundtrack.soundtrack_serializer import TrackViewSerializer, GenreViewSerializer, TrackSaveSerializer
# from django.db.models import Q
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser, MultiPartParser, FileUploadParser, FormParser
import time
from itertools import chain
import pdb
from django.conf import settings
from django.core.paginator import Paginator
from collections import OrderedDict

# Create your views here.
# # class TrackPost():
# def test(request, track_id=None):
#     if request.method == 'POST':
#         # pdb.set_trace()
#         data = request.POST.dict()
#         data['genre']=data['genre'].split(',')
#         if not track_id:
#             data['audio'] = request.FILES['file']
#             data['audio'].name = str(int(time.time())) + data['audio'].name
#             srlzr = TrackSaveSerializer(data=data)
#             if srlzr.is_valid():
#                 srlzr.save()
#                 return JsonResponse({'status':'success', 'data':"Track added successfully!"})
#             return JsonResponse({'status':'error', 'data':srlzr.errors})
#         try:
#             track = Track.objects.get(id=track_id)
#         except:
#             return JsonResponse({'status':'error', 'data':"Track not found!"})
#             # return self.send_response(0, "Track not found!")
#         srlzr = TrackSaveSerializer(track, data=data, partial=True)
#         if srlzr.is_valid():
#             srlzr.save()
#             return JsonResponse({'status':'success', 'data':"Track updated successfully!"})
#         return JsonResponse({'status':'error', 'data':srlzr.errors})


#     # print request.POST, request.FILES
#     # return HttpResponse('sada')

class TrackView(GreedyView):
    parser_classes = (MultiPartParser, )

    def get(self, request, page, track_id, format=None):

        # pdb.set_trace()
        if not track_id:
            tracks = Track.objects.all().order_by('-id')
            current_page = page or 1
            perpage = settings.TRACKS_PERPAGE
            # perpage = settings.CATALOGUE_PERPAGE
            paginator = Paginator(tracks, perpage)
            pg = paginator.page(current_page)
            if paginator.num_pages < 6:
                paginator_choices = [i for i in paginator.page_range]
            else:
                lower = current_page - 3 if current_page - 3 > 0 else 0
                paginator_choices = [i for i in paginator.page_range][
                    lower:current_page+2]
            srlzr = TrackViewSerializer(pg, many=True)
            return self.send_response(1, {'track_list': srlzr.data, 'genre_list': GenreViewSerializer(Genre.objects.all(), 
                many=True).data, 'rating_choice': sorted(dict(RATING_CHOICE).keys()), 'paginator_choices': paginator_choices})
        track = Track.objects.get(id=track_id)
        srlzr = TrackViewSerializer(track)

        return self.send_response(1, srlzr.data)

    def post(self, request, track_id, page, format=None):
        # print request.POST, request.FILES, request.data
        # pdb.set_trace()
        data = request._request.POST.dict()
        if 'genre' in data:
            data['genre'] = data['genre'].split(',')
        if not track_id:
            data['audio'] = request._request.FILES['file']
            data['audio'].name = str(int(time.time())) + data['audio'].name
            srlzr = TrackSaveSerializer(data=data)
            if srlzr.is_valid():
                sz = srlzr.save()
                return self.send_response(1, TrackViewSerializer(sz).data)
            return self.send_response(0, srlzr.errors)
        try:
            track = Track.objects.get(id=track_id)
        except:
            return self.send_response(0, "Track not found!")
        if request._request.FILES:
            data['audio'] = request._request.FILES['file']
            data['audio'].name = str(int(time.time())) + data['audio'].name
        srlzr = TrackSaveSerializer(track, data=data, partial=True)
        if srlzr.is_valid():
            sz = srlzr.save()
            return self.send_response(1, TrackViewSerializer(sz).data)
        return self.send_response(0, srlzr.errors)


class GenreView(GreedyView):

    def get(self, request, genre_id, format=None):
        if not genre_id:
            genre = Genre.objects.all().order_by('id')
            srlzr = GenreViewSerializer(genre, many=True)
            return self.send_response(1, srlzr.data)
        genre = Genre.objects.get(id=genre_id)
        srlzr = GenreViewSerializer(genre)
        return self.send_response(1, srlzr.data)

    def post(self, request, genre_id, format=None):
        # pdb.set_trace()
        data = request.data.copy()
        if not genre_id:
            srlzr = GenreViewSerializer(data=data)
            if srlzr.is_valid():
                sz = srlzr.save()
                return self.send_response(1, GenreViewSerializer(sz).data)
            return self.send_response(0, srlzr.errors)
        try:
            genre = Genre.objects.get(id=genre_id)
        except:
            return self.send_response(0, "Genre not found!")
        srlzr = GenreViewSerializer(data=data)
        if srlzr.is_valid():
            srlzr.update(genre, srlzr.validated_data)
            return self.send_response(1, "Genre updated successfully!")
        return self.send_response(0, srlzr.errors)


class Search(GreedyView):

    def get(self, request, page, format=None):
        # pdb.set_trace()
        data = request.GET.copy()
        # Q1 = Q(title__icontains=data.get('qry_str'))
        # Q2 = Q()
        tracks = Track.objects.filter(
            title__icontains=data.get('qry_str')).distinct().order_by('-id')
        genres = Genre.objects.filter(title__iexact=data.get('qry_str'))
        for genre in genres:
            tracks = list(chain(tracks, genre.genre_tracks.all().order_by('-id')))
        tracks = list(OrderedDict.fromkeys(tracks))
        # tracks = list(set(tracks))
        current_page = page or 1
        perpage = settings.TRACKS_PERPAGE
        # perpage = settings.CATALOGUE_PERPAGE
        paginator = Paginator(tracks, perpage)
        pg = paginator.page(current_page)
        if paginator.num_pages < 6:
            paginator_choices = [i for i in paginator.page_range]
        else:
            lower = current_page - 3 if current_page - 3 > 0 else 0
            paginator_choices = [i for i in paginator.page_range][
                lower:current_page+2]
        srlzr = TrackViewSerializer(pg, many=True)
        return self.send_response(1, {'track_list': srlzr.data, 'genre_list': GenreViewSerializer(Genre.objects.all(), many=True).data, 
            'rating_choice': sorted(dict(RATING_CHOICE).keys()), 'paginator_choices': paginator_choices})

# class AllDetails(GreedyView):
#     def get(self, request, format=None):
#         genres = Genre.objects.all()
#         srlzr = AllDetailsSerializer(genres, many=True)
#         return self.send_response(1, srlzr.data)


class IndexView(TemplateView):
    # pdb.set_trace()
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)
