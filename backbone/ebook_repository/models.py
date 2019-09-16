from django.contrib.auth.models import User as DjangoUser
from django.db import models
from services.search import create_e_ebook, delete_e_book


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class User(DjangoUser):
    type = models.CharField(
        max_length=50,
        choices=[
            ("administrator", "administrator"),
            ("subscriber", "subscriber"),
        ],
        default=("subscriber"),
    )
    categories = models.ManyToManyField(Category, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class EBook(models.Model):
    title = models.TextField()
    author = models.CharField(max_length=255, blank=True)
    keywords = models.CharField(max_length=255, blank=True)
    publication_year = models.IntegerField(blank=True)
    filename = models.FileField(upload_to="uploads/", blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    language = models.ForeignKey(Language, on_delete=models.DO_NOTHING)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        create_e_ebook(
            self.id,
            self.title,
            self.author,
            self.keywords,
            self.publication_year,
            self.filename,
            self.user,
            self.category,
            self.language
        )

    def delete(self, using=None, keep_parents=False):
        delete_e_book(self.id) # TODO: fix
        return super().delete(using, keep_parents)
