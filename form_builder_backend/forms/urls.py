from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FormViewSet,
    QuestionViewSet,
    ResponseViewSet,
    AnswerViewSet,
    AdminFormsView,
    FormCreateView,
    AnalyticsView
)


# Router for ViewSets
router = DefaultRouter()
router.register(r'forms', FormViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'responses', ResponseViewSet)
router.register(r'answers', AnswerViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all ViewSet routes
    path('admin-forms/', AdminFormsView.as_view(), name='admin-forms'),
    path('create-form/', FormCreateView.as_view(), name='create-form'),  
    path('analytics/<int:form_id>/', AnalyticsView.as_view(), name='analytics'),
]
