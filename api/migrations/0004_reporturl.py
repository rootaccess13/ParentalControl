# Generated by Django 4.1.2 on 2023-01-14 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_urlblacklist'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportURL',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(blank=True, max_length=50, null=True)),
                ('url', models.URLField(blank=True, null=True)),
                ('type', models.CharField(choices=[('malware', 'malware'), ('phishing', 'phishing'), ('adult', 'adult')], default='adult', max_length=20)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
