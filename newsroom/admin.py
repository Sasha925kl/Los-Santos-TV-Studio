from django.contrib import admin

from .models import Newspaper, Profile, SupportTicket


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email')


@admin.register(Newspaper)
class NewspaperAdmin(admin.ModelAdmin):
    list_display = ('title', 'issue_number', 'status', 'editor_name', 'created_by', 'updated_at')
    list_filter = ('status',)
    search_fields = ('title', 'issue_number', 'editor_name', 'article_title')


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('subject', 'author', 'status', 'replied_by', 'updated_at')
    list_filter = ('status',)
    search_fields = ('subject', 'author__username', 'message', 'admin_reply')
