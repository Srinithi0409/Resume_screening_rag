from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path("", login_view, name="login"),

    path("student/dashboard/", student_dashboard, name="jobs"),

    path("profile/", profile_view, name="profile"),

    path("job_manage/", job_manage_view, name="job_manage"),

    path("jobs/create/", job_create, name="job_create"),

    path("jobs/delete/<int:job_id>/", delete_job, name="delete_job"),

    path("recruiter/profile/", recruiter_profile, name="recruiter_profile"),

    path("recruiter/save-profile/", save_recruiter_profile, name="save_recruiter_profile"),

    path("save-profile/", save_profile, name="save_profile"),

    path("logout/", logout_view, name="logout"),
    
    path("jobs/edit/<int:job_id>/", edit_job, name="edit_job"),
    
    path("applicants/", recruiter_jobs_for_applicants, name="recruiter_jobs_for_applicants"),
    
    path("applicants/<int:job_id>/", job_applicants, name="job_applicants"),
    
    path("apply-job/<int:job_id>/", apply_job_page, name="apply_job_page"),
    
    path("submit-application/<int:job_id>/", submit_application, name="submit_application"),
    
    

]

urlpatterns += static(settings.MEDIA_URL,
document_root=settings.MEDIA_ROOT)
