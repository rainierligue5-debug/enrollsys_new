import requests

ADMIN_EMAIL = 'admin0@gmail.com'
ADMIN_PASSWORD = 'admin123'

LOGIN_URL = 'http://127.0.0.1:8000/api/auth/login/'

r = requests.post(LOGIN_URL, json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
print('Status:', r.status_code)
try:
    print('Body:', r.json())
except Exception:
    print('Body:', r.text)

