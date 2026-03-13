from django.urls import path

from .views import (
    AdminPanelView,
    DashboardView,
    LandingRedirectView,
    NewspaperCreateView,
    NewspaperListView,
    NewspaperReadView,
    NewspaperUpdateView,
    NewspaperWorkspaceView,
    SupportView,
)

urlpatterns = [
    path('', LandingRedirectView.as_view(), name='home'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('newspapers/', NewspaperListView.as_view(), name='newspaper_list'),
    path('newspapers/create/', NewspaperCreateView.as_view(), name='newspaper_create'),
    path('newspapers/<int:pk>/', NewspaperReadView.as_view(), name='newspaper_read'),
    path('newspapers/<int:pk>/edit/', NewspaperUpdateView.as_view(), name='newspaper_edit'),
    path('newspapers/<int:pk>/workspace/', NewspaperWorkspaceView.as_view(), name='newspaper_workspace'),
    path('admin-panel/', AdminPanelView.as_view(), name='admin_panel'),
    path('support/', SupportView.as_view(), name='support'),
]
