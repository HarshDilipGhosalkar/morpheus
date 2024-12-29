from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FormViewSet, QuestionViewSet, ResponseViewSet, AnswerViewSet, AdminFormsView

# Create a router for ViewSet-based routing
router = DefaultRouter()
router.register('forms', FormViewSet)
router.register('questions', QuestionViewSet)
router.register('responses', ResponseViewSet)
router.register('answers', AnswerViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all app-specific routes
    path('forms/', AdminFormsView.as_view(), name='admin-forms'),
]
