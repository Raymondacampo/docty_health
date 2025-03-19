from django.urls import path
from .views import get_data, LoginView, UserProfileView, SignupView, LogoutView, GoogleLogin, DoctorSignupView
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView, TokenObtainPairView


urlpatterns = [
    path('data/', get_data),

    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/signup/", SignupView.as_view(), name="signup"),
    path('auth/doctor_signup/', DoctorSignupView.as_view(), name='doctor_signup'),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", UserProfileView.as_view(), name="user_profile"),
    path('auth/google/', GoogleLogin.as_view(), name='google-login'),

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # Login (returns access & refresh tokens)
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # ✅ Refresh access token
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),  # ✅ Verify if token is valid

]
