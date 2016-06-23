from rest_framework import serializers
from .models import Track, Genre

class TrackSaveSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Track
        field = '__all__'



class TrackViewSerializer(serializers.ModelSerializer):
    title =  serializers.SerializerMethodField()
    genre = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    empty_rates = serializers.SerializerMethodField()
    title_raw = serializers.SerializerMethodField()
    def get_title(self, obj):
        return obj.title + " [ " + obj.genre_title() + " ]"
    def get_genre(self, obj):
        return GenreViewSerializer(obj.genre, many=True).data
    def get_rating(self, obj):
        return [i for i in xrange(1,int(obj.rating)+1)]
    def get_empty_rates(self, obj):
        return [i for i in xrange(1,6-int(obj.rating))]
    def get_title_raw(self, obj):
        return obj.title
    class Meta:
        model = Track
        fields = ('id','audio', 'title', 'genre', 'rating', 'empty_rates', 'title_raw')

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


# class AllDetailsSerializer(serializers.ModelSerializer):
#     ratings = serializers.SerializerMethodField()
#     def get_ratings(self, obj):
#         return dict(RATING_CHOICE).keys()
#     class Meta:
#         model = Genre
#         fields = ('id', 'title', 'ratings')