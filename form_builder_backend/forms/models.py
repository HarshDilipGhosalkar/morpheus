from django.db import models
from django.contrib.auth.models import User

class Form(models.Model):
    title = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="forms")
    created_at = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    FORM_TYPES = [
        ('text', 'Text'),
        ('dropdown', 'Dropdown'),
        ('checkbox', 'Checkbox'),
    ]
    form = models.ForeignKey(Form, related_name='questions', on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    type = models.CharField(choices=FORM_TYPES, max_length=50)
    options = models.JSONField(blank=True, null=True)  # For dropdown/checkbox options
    order = models.PositiveIntegerField()

class Response1(models.Model):
    form = models.ForeignKey(Form, related_name='responses', on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    response = models.ForeignKey(Response1, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.JSONField()  # Stores text or options selected
