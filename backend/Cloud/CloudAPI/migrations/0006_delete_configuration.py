# Generated by Django 5.2 on 2025-04-26 10:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('CloudAPI', '0005_alter_log_time_off'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Configuration',
        ),
    ]
