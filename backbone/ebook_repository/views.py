from PyPDF2 import PdfFileReader
from PyPDF2.utils import PdfReadError
from django.http import JsonResponse, HttpResponse
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import permission_classes, action
from rest_framework.exceptions import PermissionDenied, ParseError

from .models import Category, EBook, Language, User
from .serializers import (
    CategorySerializer,
    EBookSerializer,
    LanguageSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        request_user_type = User.objects.get(pk=request.data["id"]).type

        # TODO: logged_in_user_is_administrator
        logged_in_user_type = User.objects.get(pk=request.user.id).type

        if (
                request.user.id != int(request.data["id"])
                and
                logged_in_user_type != "administrator"
        ):
            raise PermissionDenied()

        if request_user_type != request.data["type"]:
            if logged_in_user_type != "administrator":
                raise PermissionDenied()

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['PATCH'],
            name='Change password',
            url_path="change-password")
    def change_password(self, request, *args, **kwargs):
        logged_in_user_type = User.objects.get(pk=request.user.id).type
        request_user: User = User.objects.get(pk=request.data["id"])

        if request.data["old_password"] == "":
            if logged_in_user_type != "administrator":
                return ParseError()
            old_password_valid = True
        else:
            old_password_valid = request_user.check_password(request.data["old_password"])

        if old_password_valid:
            request_user.set_password(request.data["new_password"])
            request_user.save()
            return HttpResponse(status=200)

        return HttpResponse(status=400)


class EBookViewSet(viewsets.ModelViewSet):
    queryset = EBook.objects.all()
    serializer_class = EBookSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ("user", "category", "language")


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ("name",)


def FiltersView(request):
    languages_data = Language.objects.values("name")
    categories_data = Category.objects.values("name")
    authors = []
    publication_years = []
    languages = [item["name"] for item in languages_data]
    categories = [item["name"] for item in categories_data]
    for ebooks in EBook.objects.values("author", "publication_year"):
        authors.append(ebooks["author"])
        publication_years.append(ebooks["publication_year"])
    return JsonResponse(
        {
            "data": {
                "author": list(authors),
                "publication_year": list(publication_years),
                "language": list(languages),
                "category": list(categories),
            }
        }
    )


def ExtractMetadataView(request):
    try:
        data = request.FILES["file"]
        pdf = PdfFileReader(data)
        info = pdf.getDocumentInfo()
        resp_info = {}
        for x in info.items():
            if x[0] in ("/Author", "/Title", "/Keywords"):
                resp_info[x[0].replace("/", "").lower()] = x[1]
        resp_info["categories"] = list(Category.objects.all().values())
        resp_info["languages"] = list(Language.objects.all().values())
        return JsonResponse({"data": resp_info})
    except PdfReadError:
        return JsonResponse(
            {"errors": {"detail": "file not pdf format"}}, status=400
        )
