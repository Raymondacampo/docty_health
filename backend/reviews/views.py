from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import status
from django.conf import settings
from .serializers import ReviewSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging
from itsdangerous import URLSafeTimedSerializer
from .models import Review
from doctors.models import Doctor
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count


logger = logging.getLogger(__name__)
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

class ReviewPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ReviewsDetailView(APIView):
    permission_classes = [AllowAny]
    pagination_class = ReviewPagination

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            reviews = Review.objects.filter(doctor=doctor).order_by('-created_at')
            total_reviews = reviews.count()

            # Compute rating distribution
            rating_distribution = (
                reviews.values('rating')
                .annotate(count=Count('rating'))
                .order_by('rating')
            )
            # Initialize counts for all ratings (1 to 5)
            distribution = {str(i): 0 for i in range(1, 6)}
            for item in rating_distribution:
                distribution[str(item['rating'])] = item['count']

            paginator = self.pagination_class()
            page = paginator.paginate_queryset(reviews, request)
            serializer = ReviewSerializer(page, many=True)

            return Response({
                'reviews': serializer.data,
                'total_reviews': total_reviews,
                'page_size': paginator.page_size,
                'current_page': paginator.page.number,
                'total_pages': paginator.page.paginator.num_pages,
                'rating_distribution': distribution,
            }, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            user = request.user
            print(user)

            # Check if user has already reviewed this doctor
            if Review.objects.filter(user=user, doctor=doctor).exists():
                return Response(
                    {"error": "You have already reviewed this doctor"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            data = {
                'user_id': user.id,
                'doctor_id': doctor.id,
                'rating': request.data.get('rating'),
                'headline': request.data.get('headline', ''),
                'body': request.data.get('body', '')
            }

            serializer = ReviewSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Review created successfully"},
                    status=status.HTTP_201_CREATED
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class UpdateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            data = {
                'user_id': request.user.id,
                'doctor_id': review.doctor.id,
                'rating': request.data.get('rating', review.rating),
                'headline': request.data.get('headline', review.headline),
                'body': request.data.get('body', review.body)
            }
            serializer = ReviewSerializer(review, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Review updated successfully"},
                    status=status.HTTP_200_OK
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Review.DoesNotExist:
            return Response(
                {"error": "Review not found or not authorized"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()
            return Response(
                {"message": "Review deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Review.DoesNotExist:
            return Response(
                {"error": "Review not found or not authorized"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            review = Review.objects.filter(user=request.user, doctor=doctor).first()
            if review:
                serializer = ReviewSerializer(review)
                return Response({"review": serializer.data}, status=status.HTTP_200_OK)
            return Response({"review": None}, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
