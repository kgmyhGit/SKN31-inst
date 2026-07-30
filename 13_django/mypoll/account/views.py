# account/views.py
from django.shortcuts import render


from .models import CustomUser
from .forms import CustomUserCreationForm

######################################################
# 가입 처리
#
# 요청 URL: account/create
# View함수: create
#   - GET: 가입양식 화면, POST: 가입 처리
# 응답:
#    - GET: templates/account/create.html
#    - POST: (Redirect) 메인화면 -> (/polls/welcome)
######################################################
def create(request):

    if request.method == "GET":
        # 빈 Form객체를 context value로 전달.
        return render(request, "account/create.html", {"form":CustomUserCreationForm()})
    
    elif request.method == "POST":
        pass