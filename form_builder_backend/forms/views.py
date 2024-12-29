from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Form, Question, Response1, Answer
from .serializers import FormSerializer, QuestionSerializer, ResponseSerializer, AnswerSerializer

from rest_framework.views import APIView

from rest_framework.response import Response




class FormViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):  # Check if data is a list
            serializer = self.get_serializer(data=request.data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response1.objects.all()
    serializer_class = ResponseSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AdminCreateFormView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Your form creation logic
        pass

class FormCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()  # Create a mutable copy of request data
        data['created_by'] = request.user.id  # Add the authenticated user's ID
        print("ID",data['created_by'])
        serializer = FormSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminFormsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        forms = Form.objects.filter(created_by=request.user)  # Filter forms by admin user
        serializer = FormSerializer(forms, many=True)
        return Response(serializer.data)
