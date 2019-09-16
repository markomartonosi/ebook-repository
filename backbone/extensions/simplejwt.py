from ebook_repository.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class EBookRepositoryTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        db_user = User.objects.get(pk=user.id)
        token["first_name"] = db_user.first_name
        token["last_name"] = db_user.last_name
        token["username"] = db_user.username
        token["type"] = db_user.type
        token["categories"] = [
            category for category in db_user.categories.values()
        ]
        return token


class EBookRepositoryObtainPairView(TokenObtainPairView):
    serializer_class = EBookRepositoryTokenObtainPairSerializer
