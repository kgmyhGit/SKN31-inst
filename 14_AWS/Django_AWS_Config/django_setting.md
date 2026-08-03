- AWS RDS 시간이 좀 걸린다. (5-10분정도)

# 파일명
- **gunicorn systemd 등록 파일 경로**
  - "/etc/systemd/system/mypoll_chat-wsgi.service"
- **nginx 설정파일 경로**
  - "/etc/nginx/sites-available/mypoll_chat"
- **socket file 디렉토리 경로**
  - "/run/mypoll_chat"
  - 소유: ubuntu:www-data
- **static, media Root 경로**
  - '/var/www/mypoll_chat/static'
  - '/var/www/mypoll_chat/media'
  - 소유: ubuntu:ubuntu

# RDS mysql 서버에 데이터베이스 생성

- **EC2에서 RDS 연결**
    - **mysqlclient 설치** (05_RDS.ipynb 맨 아래 참고)
    - **RDS 연결**
        - `mysql -u admin -p -h 앤드포인트`
- **데이터베이스 생성**
    - `CREATE DATABASES mypoll`
- **USER 생성**
    - `CREATE USER 'playdata'@'%' IDENTIFIED BY 'mypassword';`
    - `GRANT ALL PRIVILEGES ON mypoll.* TO 'playdata'@'%';`

# 장고 프로젝트 mypoll github에 올리기
- local에서 settings.py의 내용을 수정하고 github에 올린다.

## settings.py  수정

- `ALLOWED_HOST = ["*"]` 로 설정
- DEBUG=False
- STATIC_ROOT = '/var/www/mypoll_chat/static'
- MEDIA_ROOT = '/var/www/mypoll_chat/media'

- MYSQL DB 설정

    ```python
    DATABASES = {
        'sqlite3': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        },
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DATABASE_NAME'),
            'USER': os.getenv('DATABASE_USER'),
            'PASSWORD': os.getenv('DATABASE_PASSWORD'),
            'HOST': os.getenv('DATABASE_HOST'),
            'PORT': '3306',
        }
    }
    ```
- `.env` 환경변수 설정
- git hub에 올리기

# EC2 에서 작업
- `~/workspace` 에서 작업한다.
  - `mkdir workspace`
  
1. **git hub에서 장고 프로젝트 clone**
2. **Repoitory에 가상환경 생성 후 lib 설치**

    ```
    uv venv .venv --python=3.13
    source .venv/bin/activate
    uv pip install django django-bootstrap5 pillow langchain langchain-openai python-dotenv gunicorn mysqlclient
    ```

3. **STATIC_ROOT 디렉토리 생성 및 collectstatic**
     ```bash
      sudo mkdir -p /var/www/mypoll_chat/static
      sudo chown $USER:$USER /var/www/mypoll_chat/static/
     ```
    - `python manage.py collectstatic`
    - makemigration, migrate, createsuperuser 까지 실행
    - **개발서버 실행**
        - `python manage.py runserver 0.0.0.0:8000`
  
4. **MEDIA_ROOT 디렉토리 생성 및 설정**
   ```bash
    sudo mkdir -p /var/www/mypoll_chat/
    sudo chown $USER:$USER /var/www/mypoll_chat/media/
    ```
    > `chown`(change owner):  파일/디렉토리의 소유자를 바꾸는 명령어.   
    >  위 명령어는 지정한 디렉토리의 소유자를 현재 사용자($USER)로 변경하는 명령어이다.

5. **gunicorn 설정**
    - Gunicorn 서비스 등록
        - 서비스 설정 파일(systemd 서비스 유닛 파일) 작성
            - `sudo nano /etc/systemd/system/mypoll_chat-wsgi.service`
                - AWS_Config/wsgi_config.txt 내용을 복붙 (**주석이 있으면 안된다.**)
    - socket 파일을 저장 디렉토리 생성 및 설정 (/run/mypoll_chat)
        ```bash
        sudo mkdir -p /run/mypoll_chat
        sudo chown $USER:www-data /run/mypoll_chat
        sudo chmod 775 /run/mypoll_chat
        ```

    - 서비스 시작 (mypoll_chat-wsgi.service 를 서비스로 시작 및 등록)
        ```bash
        sudo systemctl start mypoll_chat-wsgi      # 서비스로 시작
        sudo systemctl enable mypoll_chat-wsgi     # 서버 시작시 자동으로 실행되도록 등록
        sudo systemctl status mypoll_chat-wsgi     # 상태확인
        ```
    - 문제가 있어서 수정하게 되면
        ```bash
        sudo systemctl daemon-reload              # 설정 다시 읽기
        sudo systemctl restart mypoll_chat-wsgi   # 서비스 재시작
        sudo systemctl status mypoll_chat-wsgi    # 상태확인
        ```
    > socket으로 접속했기 때문에 직접 로컬에서는 지금 요청이 안된다. (nginx 연동 후 가능)


4. **nginx 설정**
    - ngix 설치
        ```bash
        sudo apt update
        sudo apt upgrade
        sudo apt install nginx
        ```
        - http://ip 로 확인
    - **nginx 설정**
        - `sudo nano /etc/nginx/sites-available/mypoll_chat` 실행
        - AWS_Config/nginx.txt 의 내용을 붙여 넣는다.

    - **활성화**
        ```bash
        sudo ln -s /etc/nginx/sites-available/mypoll_chat /etc/nginx/sites-enabled/mypoll_chat
        sudo nginx -t                       # 설정파일 문법 오류 체크
        sudo systemctl reload nginx         # nginx 서버 재시작
        ```
