from rest_framework import serializers
from .models import Form, Question, Response1, Answer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['form', 'text', 'type', 'options', 'order']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['question', 'answer']

class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, write_only=True)

    class Meta:
        model = Response1
        fields = ['id', 'submitted_at', 'form', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        response = Response1.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(response=response, **answer_data)
        return response


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ['id', 'title', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

    def create(self, validated_data):
        return Form.objects.create(**validated_data)
