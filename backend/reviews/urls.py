from django.urls import path
from .views import ReviewsDetailView, CreateReviewView, UpdateReviewView, DeleteReviewView,UserReviewView

urlpatterns = [
    path('reviews/<int:doctor_id>/', ReviewsDetailView.as_view(), name='reviews_detail'),
    path('create/<int:doctor_id>/', CreateReviewView.as_view(), name='create_review'),
    path('update/<int:review_id>/', UpdateReviewView.as_view(), name='update-review'),
    path('delete/<int:review_id>/', DeleteReviewView.as_view(), name='delete-review'),
    path('user_review/<int:doctor_id>/', UserReviewView.as_view(), name='user-review')
]