class AuthController < ApplicationController
 def signup
    user = User.new(user_params)

    if user.save
      render json: { message: "User created" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end


  # POST /auth/login
  def login
    email = params[:email].to_s.downcase.strip
    password = params[:password].to_s

    # 入力チェック（最低限）
    if email.blank? || password.blank?
      return render json: { message: "email と password は必須です" }, status: :bad_request
    end

    user = User.find_by(email: email)

    # has_secure_password 前提（password_digest + authenticate）
    if user&.authenticate(password)
      # AuthController の login 成功時に token を返す
      token = ::JwtService.encode(user_id: user.id, role: user.role)

      render json: {
        message: "ok",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }, status: :ok
    else
      render json: { message: "メールアドレスまたはパスワードが違います" }, status: :unauthorized
    end
  end

  # private より下に定義された login は private メソッド扱いになる
  private

  def user_params
   params.require(:user).permit(:email, :password)
  end
end
