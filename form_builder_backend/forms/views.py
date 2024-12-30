from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Form, Question, Response1, Answer
from .serializers import FormSerializer, QuestionSerializer, ResponseSerializer, AnswerSerializer
from collections import Counter

from rest_framework.views import APIView

from rest_framework.response import Response




class FormQuestionsView(APIView):
    permission_classes = [AllowAny]  # No authentication required

    def get(self, request, form_id):
        try:
            # Fetch the form with the given form_id
            form = Form.objects.get(id=form_id)

            # Get all questions related to this form
            questions = form.questions.all()

            # Serialize the questions
            serializer = QuestionSerializer(questions, many=True)

            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Form.DoesNotExist:
            return Response({"detail": "Form not found."}, status=status.HTTP_404_NOT_FOUND)



class FormViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
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
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        form_id = self.request.query_params.get('form')  # Get the 'form' query parameter
        if form_id is not None:
            queryset = queryset.filter(form_id=form_id)  # Filter by form ID
        return queryset

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


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, form_id):
        # Fetch all responses for the given form
        responses = Response1.objects.filter(form_id=form_id)

        analytics = {}

        # Fetch all questions related to the form
        questions = Question.objects.filter(form_id=form_id)

        for question in questions:
            if question.type == 'text':
                answers = Answer.objects.filter(question=question)
                words = []

                for answer in answers:
                    words.extend(answer.answer.split())  # Split the text into words

                # Count the top 5 most common words
                word_count = Counter(word.lower() for word in words if len(word) >= 5)
                top_words = word_count.most_common(5)
                others = sum([count for word, count in word_count.items() if word not in dict(top_words)])

                analytics[question.id] = {
                    'type': question.type,
                    'data': {
                        'top_words': [{'word': word, 'count': count} for word, count in top_words],
                        'others': others
                    }
                }

            elif question.type == 'checkbox':
                answers = Answer.objects.filter(question=question)
                option_combinations = []

                for answer in answers:
                    option_combinations.append(tuple(sorted(answer.answer.split(','))))

                # Count the top 5 combinations of options
                combo_count = Counter(option_combinations)
                top_combos = combo_count.most_common(5)
                others = sum([count for combo, count in combo_count.items() if combo not in dict(top_combos)])

                analytics[question.id] = {
                    'type': question.type,
                    'data': {
                        'top_combos': [{'combination': combo, 'count': count} for combo, count in top_combos],
                        'others': others
                    }
                }

            elif question.type == 'dropdown':
                answers = Answer.objects.filter(question=question)
                options = [answer.answer for answer in answers]

                # Count the top 5 most selected options
                option_count = Counter(options)
                top_options = option_count.most_common(5)
                others = sum([count for option, count in option_count.items() if option not in dict(top_options)])

                analytics[question.id] = {
                    'type': question.type,
                    'data': {
                        'top_options': [{'option': option, 'count': count} for option, count in top_options],
                        'others': others
                    }
                }

        return Response(analytics, status=200)
    

class SaveFormAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        form = Form.objects.create(
            title=data.get("title"),
            description=data.get("description"),
            created_by=request.user,
        )
        for q in data.get("questions", []):
            Question.objects.create(
                form=form,
                text=q.get("text"),
                type=q.get("type"),
                options=q.get("options", []),
            )
        return Response({"message": "Form saved successfully!"}, status=201)
    
class FormResponsesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, form_id):
        try:
            form = Form.objects.get(id=form_id)
            responses = Response1.objects.filter(form=form)
            serializer = ResponseSerializer(responses, many=True)
            return Response(serializer.data)
        except Form.DoesNotExist:
            return Response({"detail": "Form not found."}, status=404)
        except Response1.DoesNotExist:
            return Response({"detail": "No responses found."}, status=404)  # Handle this specific case if needed
