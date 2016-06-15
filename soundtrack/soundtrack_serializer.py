from rest_framework import serializers
from .models import Track, Genre


class TrackViewSerializer(serializers.ModelSerializer):
    genre = serializers.SerializerMethodField()
    def get_genre(self, obj):
        return GenreViewSerializer(obj.genre, many=True).data
    class Meta:
        model = Track
        field = '__all__'

    def update(self, instance, validated_data):
        instance.audio = validated_data.get('audio', instance.audio)
        instance.title = validated_data.get('title', instance.title)
        instance.genre = validated_data.get('genre',instance.genre)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.save()
        return instance

class GenreViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        field = '__all__'
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.save()
        return instance
