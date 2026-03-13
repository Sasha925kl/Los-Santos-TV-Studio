from io import BytesIO
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from PIL import Image


class Profile(models.Model):
    class Role(models.TextChoices):
        WATCHER = 'watcher', 'Следящий'
        NEWSPAPER_EDITOR = 'newspaper_editor', 'Редактор газет'
        GUEST = 'guest', 'Гость'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.GUEST)

    def __str__(self):
        return f'{self.user.username} ({self.get_role_display()})'


class Newspaper(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'published', 'Опубликована'

    title = models.CharField(max_length=160)
    editor_name = models.CharField(max_length=120)
    article_title = models.CharField(max_length=180, blank=True)
    article_body = models.TextField(blank=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='newspapers/', blank=True, null=True)
    publication_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='newspapers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._resize_image_field('cover_image', 'newspapers', (1200, 1200))

    def _resize_image_field(self, field_name, folder, max_size):
        image_field = getattr(self, field_name)
        if not image_field:
            return

        image = Image.open(image_field.path)
        if image.width <= max_size[0] and image.height <= max_size[1]:
            return

        if image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')

        image.thumbnail(max_size)
        image_io = BytesIO()
        image.save(image_io, format='JPEG', quality=88, optimize=True)

        stem = Path(image_field.name).stem
        resized_name = f'{folder}/{stem}.jpg'
        image_field.save(resized_name, ContentFile(image_io.getvalue()), save=False)
        super().save(update_fields=[field_name])


class SupportTicket(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', 'Открыт'
        ANSWERED = 'answered', 'Отвечен'

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField(max_length=180)
    message = models.TextField()
    attachment = models.ImageField(upload_to='support/', blank=True, null=True)
    admin_reply = models.TextField(blank=True)
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='support_replies',
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at', '-created_at']

    def __str__(self):
        return self.subject

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._resize_image_field('attachment', 'support', (1400, 1400))

    def _resize_image_field(self, field_name, folder, max_size):
        image_field = getattr(self, field_name)
        if not image_field:
            return

        image = Image.open(image_field.path)
        if image.width <= max_size[0] and image.height <= max_size[1]:
            return

        if image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')

        image.thumbnail(max_size)
        image_io = BytesIO()
        image.save(image_io, format='JPEG', quality=88, optimize=True)

        stem = Path(image_field.name).stem
        resized_name = f'{folder}/{stem}.jpg'
        image_field.save(resized_name, ContentFile(image_io.getvalue()), save=False)
        super().save(update_fields=[field_name])


