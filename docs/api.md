POST /auth/signup
POST /auth/login

- response: { token, role }
  / → /quiz

## Auth

### POST /auth/login

管理者ログイン用

request:
{
"email": "admin@example.com",
"password": "password"
}

response:
{
"token": "jwt-token",
"role": "admin"
}

JWT payload:
{
"user_id": number,
"role": "admin"
}
