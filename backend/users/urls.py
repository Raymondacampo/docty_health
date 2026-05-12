from django.urls import path
from .views import (LoginView, UserProfileView, SignupView, LogoutView, GoogleLogin, PasswordResetRequestView, PasswordChangeView,
                     ValidateTokenView, ToggleFavoriteDoctorView, IsDoctorView, Me, GoogleCallbackView, DoctorInFavorite, )

from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView, TokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path('auth/google/', GoogleLogin.as_view(), name='google-login'),
    path('auth/google/callback/', GoogleCallbackView.as_view(), name='google-callback'),
    path('auth/password_reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password_change/', PasswordChangeView.as_view(), name='password_change'),
    path('auth/validate_token/', ValidateTokenView.as_view(), name='validate_token'),

    path("personal-data/", UserProfileView.as_view(), name="user_profile"),
    path("me/", Me.as_view(), name="user_profile"),
    path('is_doctor/', IsDoctorView.as_view(), name='is_doctor'),
    path('toggle_favorite/<int:doctor_id>/', ToggleFavoriteDoctorView.as_view(), name='toggle_favorite_doctor'),
    path('doctor_in_favorite/<int:doctor_id>/', DoctorInFavorite.as_view(), name='doctor_in_favorite'),
    path('auth/personal-data/', UserProfileView.as_view(), name='update_user_profile'),

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),


]