from django.core.management import BaseCommand

from ebook_repository.models import User, Category, Language


class Command(BaseCommand):
    help = "Seeds database with initial data"

    def create_user(self, firstname, lastname, email, username, password, type):
        user = User()
        user.first_name = firstname
        user.last_name = lastname
        user.email = email
        user.username = username
        user.set_password(password)
        user.type = type
        user.save()
        return user

    def handle(self, *args, **options):
        admin_user = self.create_user("a", "a", "a", "a", "a", "administrator")

        category_drama = Category()
        category_drama.name = "Drama"
        category_drama.save()

        category_classic = Category()
        category_classic.name = "Classic"
        category_classic.save()

        admin_user.categories.add(category_drama)
        admin_user.categories.add(category_classic)
        admin_user.save()

        language_english = Language()
        language_english.name = "English"
        language_english.save()

        language_srpski = Language()
        language_srpski.name = "Srpski"
        language_srpski.save()
