from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import redirect_to_login
from django.db.models import Count
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.generic import CreateView, DetailView, ListView, TemplateView, UpdateView

from .forms import (
    NewspaperForm,
    NewspaperWorkspaceForm,
    RegisterForm,
    RoleAssignmentForm,
    SupportReplyForm,
    SupportTicketForm,
)
from .models import Newspaper, Profile, SupportTicket


def get_role(user):
    profile, _ = Profile.objects.get_or_create(user=user)
    return profile.role


class RoleRequiredMixin(UserPassesTestMixin):
    allowed_roles = ()

    def test_func(self):
        return self.request.user.is_authenticated and get_role(self.request.user) in self.allowed_roles

    def handle_no_permission(self):
        if not self.request.user.is_authenticated:
            return redirect_to_login(self.request.get_full_path())
        messages.error(self.request, 'У вас нет доступа к этой странице.')
        return redirect('dashboard')


class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = 'registration/register.html'
    success_url = reverse_lazy('dashboard')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboard')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        messages.success(self.request, 'Регистрация выполнена. Вам выдана роль Гость по умолчанию.')
        return response


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'newsroom/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        role = get_role(self.request.user)
        newspapers = list(Newspaper.objects.all()[:6])
        featured_newspaper = newspapers[0] if newspapers else None
        smi_news = [
            {
                'category': 'SMI News',
                'title': 'Редакция запускает новую ленту выпусков',
                'text': 'На главной странице теперь можно быстро читать свежие материалы, открывать газеты и переходить к полным выпускам.',
            },
            {
                'category': 'Редакция',
                'title': 'Следящие получили отдельную страницу выдачи ролей',
                'text': 'Роли пользователям теперь можно назначать прямо на сайте, без перехода в стандартную админку.',
            },
            {
                'category': 'Поддержка',
                'title': 'В техподдержку можно прикладывать фото и большие изображения уменьшаются автоматически',
                'text': 'Скриншоты и фото теперь подстраиваются под размер страницы системно, без разлома верстки.',
            },
        ]
        context.update(
            role=role,
            role_label=Profile.Role(role).label,
            newspapers=newspapers,
            featured_newspaper=featured_newspaper,
            smi_news=smi_news,
            can_manage=role in {Profile.Role.WATCHER, Profile.Role.NEWSPAPER_EDITOR},
            can_admin=role == Profile.Role.WATCHER,
        )
        return context


class NewspaperDefaultsMixin:
    def apply_newspaper_defaults(self, newspaper):
        publication_date = newspaper.publication_date or timezone.localdate()
        newspaper.publication_date = publication_date
        newspaper.editor_name = self.request.user.username
        if not newspaper.title:
            newspaper.title = f'Газета от {publication_date.strftime("%d.%m.%Y")}'
        if not newspaper.issue_number:
            newspaper.issue_number = publication_date.strftime('%d%m%Y')
        if not newspaper.article_title:
            newspaper.article_title = newspaper.title
        return newspaper


class NewspaperListView(LoginRequiredMixin, ListView):
    model = Newspaper
    template_name = 'newsroom/newspaper_list.html'
    context_object_name = 'newspapers'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        role = get_role(self.request.user)
        context.update(
            role=role,
            can_manage=role in {Profile.Role.WATCHER, Profile.Role.NEWSPAPER_EDITOR},
        )
        return context


class NewspaperReadView(LoginRequiredMixin, DetailView):
    model = Newspaper
    template_name = 'newsroom/newspaper_read.html'
    context_object_name = 'newspaper'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        role = get_role(self.request.user)
        context.update(
            role=role,
            can_manage=role in {Profile.Role.WATCHER, Profile.Role.NEWSPAPER_EDITOR},
        )
        return context


class NewspaperCreateView(NewspaperDefaultsMixin, RoleRequiredMixin, CreateView):
    model = Newspaper
    form_class = NewspaperForm
    template_name = 'newsroom/newspaper_form.html'
    success_url = reverse_lazy('newspaper_list')
    allowed_roles = (Profile.Role.WATCHER, Profile.Role.NEWSPAPER_EDITOR)

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        self.apply_newspaper_defaults(form.instance)
        messages.success(self.request, 'Новая газета создана.')
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(
            page_title='Создание газеты',
            submit_label='Создать выпуск',
            auto_editor_name=self.request.user.username,
        )
        return context


class NewspaperUpdateView(NewspaperDefaultsMixin, RoleRequiredMixin, UpdateView):
    model = Newspaper
    form_class = NewspaperForm
    template_name = 'newsroom/newspaper_form.html'
    success_url = reverse_lazy('newspaper_list')
    allowed_roles = (Profile.Role.WATCHER, Profile.Role.NEWSPAPER_EDITOR)

    def form_valid(self, form):
        self.apply_newspaper_defaults(form.instance)
        messages.success(self.request, 'Изменения сохранены.')
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(
            page_title='Редактирование газеты',
            submit_label='Сохранить правки',
            auto_editor_name=self.request.user.username,
        )
        return context


class NewspaperWorkspaceView(NewspaperDefaultsMixin, RoleRequiredMixin, UpdateView):
    model = Newspaper
    form_class = NewspaperWorkspaceForm
    template_name = 'newsroom/editor_workspace.html'
    success_url = reverse_lazy('newspaper_list')
    allowed_roles = (Profile.Role.WATCHER, Profile.Role.NEWSPAPER_EDITOR)

    def form_valid(self, form):
        self.apply_newspaper_defaults(form.instance)
        messages.success(self.request, 'Документ газеты сохранен.')
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(
            toolbar_items=['Файл', 'Главная', 'Вставка', 'Разметка', 'Вид'],
            format_items=['Заголовок', 'Подзаголовок', 'Абзац', 'Цитата'],
        )
        return context


class AdminPanelView(RoleRequiredMixin, TemplateView):
    template_name = 'newsroom/admin_panel.html'
    allowed_roles = (Profile.Role.WATCHER,)

    def get_form(self):
        return RoleAssignmentForm(self.request.POST or None)

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            profile = form.save()
            messages.success(request, f'Роль пользователя {profile.user.username} обновлена.')
            return redirect('admin_panel')
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        role_totals = [
            {
                'label': Profile.Role(item['role']).label,
                'total': item['total'],
            }
            for item in Profile.objects.values('role').annotate(total=Count('id'))
        ]
        context.update(
            form=kwargs.get('form', self.get_form()),
            requests=[
                'Выдать роль редактора пользователю media.kira',
                'Проверить публикацию номера State Bulletin №067',
                'Подтвердить доступ к архиву выпусков',
            ],
            users=Profile.objects.select_related('user').order_by('user__username'),
            role_totals=role_totals,
        )
        return context


class SupportView(LoginRequiredMixin, TemplateView):
    template_name = 'newsroom/support.html'

    def get_ticket_form(self):
        return SupportTicketForm(self.request.POST or None, self.request.FILES or None)

    def get_reply_form(self):
        return SupportReplyForm(self.request.POST or None)

    def post(self, request, *args, **kwargs):
        role = get_role(request.user)
        action = request.POST.get('action')

        if action == 'create_ticket':
            ticket_form = self.get_ticket_form()
            if ticket_form.is_valid():
                ticket = ticket_form.save(commit=False)
                ticket.author = request.user
                ticket.save()
                messages.success(request, 'Обращение в техподдержку отправлено.')
                return redirect('support')
            return self.render_to_response(self.get_context_data(ticket_form=ticket_form, reply_form=self.get_reply_form()))

        if action == 'reply_ticket' and role == Profile.Role.WATCHER:
            reply_form = self.get_reply_form()
            if reply_form.is_valid():
                ticket = get_object_or_404(SupportTicket, pk=reply_form.cleaned_data['ticket_id'])
                ticket.admin_reply = reply_form.cleaned_data['admin_reply']
                ticket.replied_by = request.user
                ticket.status = SupportTicket.Status.ANSWERED
                ticket.save(update_fields=['admin_reply', 'replied_by', 'status', 'updated_at'])
                messages.success(request, f'Ответ для обращения "{ticket.subject}" сохранен.')
                return redirect('support')
            return self.render_to_response(self.get_context_data(ticket_form=self.get_ticket_form(), reply_form=reply_form))

        messages.error(request, 'Недоступное действие.')
        return redirect('support')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        role = get_role(self.request.user)
        tickets = SupportTicket.objects.all() if role == Profile.Role.WATCHER else SupportTicket.objects.filter(author=self.request.user)
        context.update(
            role=role,
            can_answer=role == Profile.Role.WATCHER,
            tickets=tickets,
            ticket_form=kwargs.get('ticket_form', SupportTicketForm()),
            reply_form=kwargs.get('reply_form', SupportReplyForm()),
        )
        return context


class LandingRedirectView(TemplateView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboard')
        return redirect('login')