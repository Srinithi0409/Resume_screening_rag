from django.db import models

class Student(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)

    name = models.CharField(max_length=200, blank=True, null=True)
    role = models.CharField(max_length=200, blank=True, null=True)
    place = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)

    institution = models.CharField(max_length=255, blank=True, null=True)
    degree = models.CharField(max_length=255, blank=True, null=True)
    year = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.username


class Recruiter(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)

    full_name = models.CharField(max_length=200, blank=True, null=True)
    work_email = models.EmailField(blank=True, null=True)

    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=200, blank=True, null=True)
    company_size = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.username


class Job(models.Model):

    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE)

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50)

    company = models.CharField(max_length=200)
    location = models.CharField(max_length=100)

    description = models.TextField()

    skills = models.TextField(null=True, blank=True)

    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)

    salary_type = models.CharField(max_length=50, null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[("Active","Active"),("Inactive","Inactive")],
        default="Inactive"
    )

    date_posted = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title
    
class Application(models.Model):

    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    college = models.CharField(max_length=255)
    department = models.CharField(max_length=255)

    experience = models.CharField(max_length=20)

    resume = models.FileField(upload_to="resumes/")

    applied_at = models.DateTimeField(auto_now_add=True)