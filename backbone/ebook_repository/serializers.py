from rest_framework_json_api import serializers
from rest_framework_json_api.relations import ResourceRelatedField

from .models import Category, EBook, Language, User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "url")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "username",
            "password",
            "type",
            "categories",
            "url",
        )

    categories = ResourceRelatedField(queryset=Category.objects, many=True)
    included_serializers = {"categories": CategorySerializer}


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ("name", "url")


class EBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = EBook
        fields = (
            "title",
            "author",
            "keywords",
            "publication_year",
            "filename",
            "user",
            "language",
            "category",
            "url",
        )

    user = ResourceRelatedField(queryset=User.objects, many=False)
    language = ResourceRelatedField(queryset=Language.objects, many=False)
    category = ResourceRelatedField(queryset=Category.objects, many=False)
    included_serializers = {
        "user": UserSerializer,
        "language": LanguageSerializer,
        "category": CategorySerializer,
    }

    class JSONAPIMeta:
        included_resources = ["user", "language", "category"]
