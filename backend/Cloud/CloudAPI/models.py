
from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User nếu bạn muốn quản lý ví tiền
class User(AbstractUser):
    wallet = models.BigIntegerField(default=10000000)

    def __str__(self):
        return self.username

class VirtualMachine(models.Model):
    name = models.CharField(max_length=255)
    vm_id = models.CharField(max_length=255, default='')
    status = models.CharField(max_length=100)
    date_release = models.DateTimeField()
    date_end = models.DateTimeField()
    unit_price = models.BigIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vms')

    def __str__(self):
        return self.name

class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    virtual_machine = models.ForeignKey(VirtualMachine, on_delete=models.CASCADE)
    time_start = models.DateTimeField()
    time_off = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username} log VM {self.virtual_machine.name}"

class Invoice(models.Model):
    virtual_machine = models.ForeignKey(VirtualMachine, on_delete=models.CASCADE)
    total_amount = models.BigIntegerField()

    def __str__(self):
        return f"Invoice for {self.virtual_machine.name}"

class Configuration(models.Model):
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
