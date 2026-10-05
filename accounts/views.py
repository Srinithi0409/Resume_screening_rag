from django.shortcuts import render, redirect
from .models import Student, Recruiter,Job, Application
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Avg
import json



def login_view(request):
    message = ""

    if request.method == "POST":
        role = request.POST.get("role")
        username = request.POST.get("username")
        password = request.POST.get("password")

        # ---------- STUDENT ----------
        if role == "student":
            student = Student.objects.filter(username=username).first()

            if not student:
                message = "Student username not found"
            elif password != student.password:
                message = "Wrong student password"
            else:
                request.session["student_id"] = student.id
                return redirect("jobs")

        # ---------- RECRUITER ----------
        elif role == "recruiter":
            recruiter = Recruiter.objects.filter(username=username).first()

            if not recruiter:
                message = "Recruiter username not found"
            elif password != recruiter.password:
                message = "Wrong recruiter password"
            else:
                request.session["recruiter_id"] = recruiter.id 
                return redirect("job_manage")   

    return render(request, "accounts/login.html", {"message": message})



def student_dashboard(request):

    student_id = request.session.get("student_id")

    if not student_id:
        return redirect("login")

    jobs = Job.objects.filter(status="Active").order_by("-date_posted")

    return render(request, "accounts/jobs.html", {
        "jobs": jobs
    })



def profile_view(request):
    student_id = request.session.get("student_id")

    if not student_id:
        return redirect("login")

    student = Student.objects.get(id=student_id)

    return render(request, "accounts/profile.html", {"student": student})

def apply_job_page(request, job_id):

    student_id = request.session.get("student_id")

    if not student_id:
        return redirect("login")

    job = Job.objects.get(id=job_id)

    return render(request, "accounts/apply_job.html", {
        "job": job
    })


def submit_application(request, job_id):

    student_id = request.session.get("student_id")

    if not student_id:
        return redirect("login")

    student = Student.objects.get(id=student_id)
    job = Job.objects.get(id=job_id)

    if request.method == "POST":

        Application.objects.create(
            job=job,
            student=student,
            name=request.POST.get("name"),
            email=request.POST.get("email"),
            phone=request.POST.get("phone"),
            college=request.POST.get("college"),
            department=request.POST.get("department"),
            experience=request.POST.get("experience"),
            resume=request.FILES.get("resume")
        )

        return redirect("jobs")



def recruiter_jobs_for_applicants(request):

    recruiter_id = request.session.get("recruiter_id")

    if not recruiter_id:
        return redirect("login")

    recruiter = Recruiter.objects.get(id=recruiter_id)

    jobs = Job.objects.filter(recruiter=recruiter)

    return render(request, "accounts/applicant_jobs.html", {
        "jobs": jobs
    })
    
def job_applicants(request, job_id):

    recruiter_id = request.session.get("recruiter_id")

    if not recruiter_id:
        return redirect("login")

    job = Job.objects.get(id=job_id)

    applicants = Application.objects.filter(job=job)

    return render(request, "accounts/applicants.html", {
        "job": job,
        "applicants": applicants
    })


def job_manage_view(request):

    recruiter_id = request.session.get("recruiter_id")

    recruiter = Recruiter.objects.get(id=recruiter_id)

    jobs = Job.objects.filter(recruiter=recruiter).order_by("-date_posted")

    # ---------- PAGINATION ----------

    paginator = Paginator(jobs, 5)

    page_number = request.GET.get("page")

    page_obj = paginator.get_page(page_number)

    # ---------- DASHBOARD STATS (INITIAL 0) ----------

    avg_applicants = 0
    shortlisted = 0
    rejected = 0

    screening = 0
    interview = 0
    offered = 0

    context = {
        "jobs": page_obj,

        "avg_applicants": avg_applicants,
        "shortlisted": shortlisted,
        "rejected": rejected,

        "screening": screening,
        "interview": interview,
        "offered": offered,
    }

    return render(request, "accounts/job_manage.html", context)

def edit_job(request, job_id):

    recruiter_id = request.session.get("recruiter_id")

    if not recruiter_id:
        return redirect("login")

    job = Job.objects.get(id=job_id)

    if request.method == "POST":

        job.title = request.POST.get("title")
        job.department = request.POST.get("department")
        job.job_type = request.POST.get("job_type")
        job.location = request.POST.get("district")
        job.company = request.POST.get("company")
        job.description = request.POST.get("description")
        job.skills = request.POST.get("skills")
        job.salary_min = request.POST.get("salary_min")
        job.salary_max = request.POST.get("salary_max")
        job.salary_type = request.POST.get("salary_type")
        

        job.save()

        return redirect("job_manage")

    return render(request,"accounts/create_job.html",{
        "job": job
    })

def recruiter_profile(request):

    recruiter_id = request.session.get("recruiter_id")

    if not recruiter_id:
        return redirect("login")

    recruiter = Recruiter.objects.get(id=recruiter_id)

    return render(request, "accounts/profiler.html", {
        "recruiter": recruiter
    })

def logout_view(request):
    request.session.flush()
    return redirect("login")
def job_create(request):

    if request.method == "POST":
        
        Job.objects.create(
    recruiter_id=request.session["recruiter_id"],
    title=request.POST.get("title"),
    department=request.POST.get("department"),
    job_type=request.POST.get("job_type"),
    salary_min=request.POST.get("salary_min"),
    salary_max=request.POST.get("salary_max"),
    company=request.POST.get("company"),
    salary_type=request.POST.get("salary_type"),
    location=request.POST.get("district"),
    skills=request.POST.get("skills"),
    description=request.POST.get("description"),
    status="Active"
)

        return redirect("job_create")

    return render(request,"accounts/create_job.html")
def save_profile(request):
    if request.method == "POST":
        data = json.loads(request.body)

        student_id = request.session.get("student_id")

        if not student_id:
            return JsonResponse({"error": "Not logged in"}, status=401)

        student = Student.objects.get(id=student_id)

        student.name = data.get("name", student.name)
        student.role = data.get("role", student.role)
        student.place = data.get("place", student.place)
        student.email = data.get("email", student.email)
        student.phone = data.get("phone", student.phone)
        student.linkedin = data.get("linkedin", student.linkedin)
        student.institution = data.get("institution", student.institution)
        student.degree = data.get("degree", student.degree)
        student.year = data.get("year", student.year)

        student.save()

        return JsonResponse({"status": "success"})
    
def save_recruiter_profile(request):

    if request.method == "POST":

        data = json.loads(request.body)

        recruiter_id = request.session.get("recruiter_id")

        if not recruiter_id:
            return JsonResponse({"error": "Not logged in"}, status=401)

        recruiter = Recruiter.objects.get(id=recruiter_id)

        recruiter.full_name = data.get("full_name")
        recruiter.work_email = data.get("work_email")
        recruiter.company_name = data.get("company_name")
        recruiter.company_website = data.get("company_website")
        recruiter.industry = data.get("industry")
        recruiter.company_size = data.get("company_size")

        recruiter.save()

        return JsonResponse({"status": "success"})
    
def delete_job(request, job_id):

    recruiter_id = request.session.get("recruiter_id")

    if not recruiter_id:
        return redirect("login")

    job = Job.objects.get(id=job_id)

    job.delete()

    return redirect("job_manage")



