from django.contrib import admin
from .models import Student, Recruiter, Job, Application

admin.site.register(Student)
admin.site.register(Recruiter)
admin.site.register(Job)
admin.site.register(Application)