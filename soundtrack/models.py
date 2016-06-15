from __future__ import unicode_literals

from django.db import models

# Create your models here.
RATING_CHOICE = (
	('1', '1 star ratings'),
	('2', '2 star ratings'),
	('3', '3 star ratings'),
	('4', '4 star ratings'),
	('5', '5 star ratings'),
	)


class Genre(models.Model):
	title = models.CharField(max_length=30)
	def __unicode__(self):
		return self.title


class Track(models.Model):
	audio = models.FileField(upload_to='uploads/')
	title = models.CharField(max_length=100)
	genre = models.ManyToManyField('Genre', blank=True, related_name='genre_tracks')
	rating = models.CharField(choices=RATING_CHOICE, max_length=2, null=True, blank=True)

	def __unicode__(self):
		return self.title