class User < ApplicationRecord
  has_many :quiz_attempts, dependent: :destroy

  # authenticate(password) が使える
  has_secure_password

  # 空メール防止、同一メールの二重登録防止
  validates :email, presence: true, uniqueness: true
end

# 1人のユーザーは何回もクイズに挑戦する
