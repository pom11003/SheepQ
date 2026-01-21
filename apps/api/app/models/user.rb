class User < ApplicationRecord
  has_many :quiz_attempts, dependent: :destroy
end

# 1人のユーザーは何回もクイズに挑戦する
