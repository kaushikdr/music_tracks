from django.shortcuts import render
from soundtrack.models import Track, Genre
from soundtrack.resp import GreedyView
from soundtrack.soundtrack_serializer import TrackViewSerializer, GenreViewSerializer
# from django.db.models import Q
from itertools import chain
import pdb

# Create your views here.
class TrackView(GreedyView):
	def get(self, request, track_id, format=None):
		if not track_id:
			tracks = Track.objects.all()
			srlzr = TrackViewSerializer(tracks, many=True)
			return self.send_response(1, srlzr.data)
		track = Track.objects.get(id=track_id)
		srlzr = TrackViewSerializer(track)
		return self.send_response(1, srlzr.data)

	def post(self, request, track_id, format=None):
		data = request.data.copy()
		if not track_id:
			srlzr = TrackViewSerializer(data=data)
			if srlzr.is_valid():
				srlzr.save()
				return self.send_response(1, "Track added successfully!")
			return self.send_response(0, srlzr.errors)
		try:
			track = Track.objects.get(id=track_id)
		except:
			return self.send_response(0, "Track not found!")
		srlzr = TrackViewSerializer(data=data)
		if srlzr.is_valid():
			srlzr.update(track, srlzr.validated_data)
			return self.send_response(1, "Track updated successfully!")
		return self.send_response(0, srlzr.errors)

class GenreView(GreedyView):
	def get(self, request, genre_id, format=None):
		if not genre_id:
			genre = Genre.objects.all()
			srlzr = GenreViewSerializer(genre, many=True)
			return self.send_response(1, srlzr.data)
		genre = Genre.objects.get(id=genre_id)
		srlzr = GenreViewSerializer(genre)
		return self.send_response(1, srlzr.data)
	def post(self, request, genre_id, format=None):
		data = request.data.copy()
		if not genre_id:
			srlzr = GenreViewSerializer(data=data)
			if srlzr.is_valid():
				srlzr.save()
				return self.send_response(1, "Genre added successfully!")
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
	def get(self, request, format=None):
		# pdb.set_trace()
		data = request.GET.copy()
		# Q1 = Q(title__icontains=data.get('qry_str'))
		# Q2 = Q()
		tracks = Track.objects.filter(title__icontains=data.get('qry_str')).distinct()
		genres = Genre.objects.filter(title__iexact=data.get('qry_str'))
		for genre in genres:
			tracks = list(chain(tracks, genre.genre_tracks.all()))
		tracks = list(set(tracks))
		srlzr = TrackViewSerializer(tracks, many=True)
		return self.send_response(1, srlzr.data)
