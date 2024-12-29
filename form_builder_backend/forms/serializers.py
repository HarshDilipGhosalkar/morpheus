from rest_framework import serializers
from .models import Form, Question, Response1, Answer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['form', 'text', 'type', 'options', 'order']

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response1
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ['id', 'title', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

    def create(self, validated_data):
        return Form.objects.create(**validated_data)
