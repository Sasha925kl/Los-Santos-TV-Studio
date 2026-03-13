from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Newspaper, Profile, SupportTicket


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True, label='Email')

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class NewspaperForm(forms.ModelForm):
    publication_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'type': 'date'}),
        label='Дата выхода',
    )

    class Meta:
        model = Newspaper
        fields = [
            'title',
            'cover_image',
            'publication_date',
        ]
        labels = {
            'title': 'Название газеты',
            'cover_image': 'Фото для газеты',
        }
        widgets = {
            'cover_image': forms.ClearableFileInput(attrs={'accept': 'image/*'}),
        }


class NewspaperWorkspaceForm(forms.ModelForm):
    class Meta:
        model = Newspaper
        fields = [
            'cover_image',
            'article_title',
            'article_body',
            'description',
        ]
        labels = {
            'cover_image': 'Фото для газеты',
            'article_title': 'Заголовок статьи',
            'article_body': 'Материал выпуска',
            'description': 'Описание и заметки',
        }
        widgets = {
            'article_body': forms.Textarea(attrs={'rows': 8}),
            'description': forms.Textarea(attrs={'rows': 5}),
            'cover_image': forms.ClearableFileInput(attrs={'accept': 'image/*'}),
        }


class RoleAssignmentForm(forms.Form):
    profile = forms.ModelChoiceField(
        queryset=Profile.objects.none(),
        label='Пользователь',
        empty_label='Выберите пользователя',
    )
    role = forms.ChoiceField(choices=Profile.Role.choices, label='Новая роль')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['profile'].queryset = Profile.objects.select_related('user').order_by('user__username')

    def save(self):
        profile = self.cleaned_data['profile']
        profile.role = self.cleaned_data['role']
        profile.save(update_fields=['role'])
        return profile


class SupportTicketForm(forms.ModelForm):
    class Meta:
        model = SupportTicket
        fields = ['subject', 'message', 'attachment']
        labels = {
            'subject': 'Тема обращения',
            'message': 'Сообщение в техподдержку',
            'attachment': 'Фото или скриншот',
        }
        widgets = {
            'message': forms.Textarea(attrs={'rows': 5}),
            'attachment': forms.ClearableFileInput(attrs={'accept': 'image/*'}),
        }


class SupportReplyForm(forms.Form):
    ticket_id = forms.IntegerField(widget=forms.HiddenInput())
    admin_reply = forms.CharField(label='Ответ тех-админа', widget=forms.Textarea(attrs={'rows': 4}))
