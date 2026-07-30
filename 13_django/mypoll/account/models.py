# account/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# AbstractUser는 기존 UserModel을 사용할 수 있도록 제공하는 클래스.
# 1. AbstractUser 상속
# 2. 기존 Field들에 **추가할 Field들을 정의** (name, birthday)

class CustomUser(AbstractUser):

    name = models.CharField(
        max_length=100,
        verbose_name="이름" # Form 관련 설정(Label). - ModelForm과 연결할 Model의 경우.
    )
    birthday = models.DateField( # DB: date타입, python: datetime.date
        null=True, # Nullable(Null허용) 컬럼 (default: False - Not Null)
        blank=True, # Form 설정: (입력폼에서) required=False
        verbose_name="생일", # Form 설정

    )

    def __str__(self):
        return f"{self.pk}. {self.username}-{self.name}" # 1. myid-홍길동

