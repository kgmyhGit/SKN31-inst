# 장고 프로젝트 생성
1. mypoll  프로젝트 디렉토리 생성
2. 가상환경을 생성 (mypoll안에서 생성)
    - `uv venv .venv --python=3.13`
    - 활성화
3. django 설치
    -`uv pip install django`

4. 장고 프로젝트 생성
    - `django-admin startproject config .`
    - `config`: 전체 시스템(proejct)의 설정파일들을 저장할 디렉토리 이름
    - `.`: 디렉토리 생성할 위치 (`.`: 현재 디렉토리)
    - `manage.py`: 장고프로젝트를 관리하는 툴(too) 스크립트
5. 개발서버 실행
    - `python manage.py runserver`
    - Web Browser: `http://127.0.0.1:8000` 
    - 서버종료: `control+c`
6. APP생성
    - `python manage.py startapp APP이름`
    - `python manage.py startapp polls`
    - 생성된 APP을 프로젝트에 등록
        - config/settings.py(프로젝트 설정파일) 열기
        - `INSTALLED_APP=[]` 리스트에 APP이름을 추가.
7. (Project) 관리자 계정
    - `python manage.py migrate` (관리자를 저장할 수 있는 DB 생성)
    - `python manage.py createsuperuser` (관리자 계정 생성)
        - username: 계정명 (admin)
        - email: 이메일주소 (a@a.com)
        - password: 비밀번호 (1111)
    - 관리자 app에 접속
        - 서버실행 후 (`python manage.py runserver`)
        -`http://127.0.0.1:8000/admin`


## tempate 생성
- 위치
    - `app/templates` 하위에 작성.
        - `polls/templates/polls`
    - 일반적으로 `app이름` 디렉토리를 만들고 그 아래 구현.
        - `app/templates/app`
    - 파일명: `xxxxx.html`, html기반으로 작성.
    - **template은 HTML이 아님.**
        - html, css, javascript + django template문법

# account APP 구현 (사용자 관리)
- APP 생성
    - `python manage.py startapp account`
    - config/settings.py에 `INSTALLED_APPS` 에 등록 ("account")
    - url config에 account URL 매핑 설정
        - config/urls.py (ROOT URLConfig) 에 account -> account/urls.py 호출하도록 설정
        - account/urls.py 생성.
    - templates 디렉토리 생성:
        - `account/templates/account`

## 사용자관리 
### Model 정의
- AbstractUser 상속
    - Django의 기존 User Model의 Field들을 이용.
    - 기존 Model Field들을 상속해서 추가
- config/settings 에 사용자 관리시 사용할 모델로 등록
    - admin app에서 사용하는 User Model를 우리가 정의한 User Model로 변경
    - AUTH_USER_MODEL = 'account.CustomUser'
- `account/admin.py` 에 CustomUser 모델을 등록 -> 관리자앱에서 관리가능.

- DB에 적용
    - `mypoll/db.sqlite3` 삭제(DB삭제)
    - `python manage.py makemigrations`
    - `python manage.py migrate`
    - `python manage.py createsuperuser` (admin/1111)

    python manage.py runserver

