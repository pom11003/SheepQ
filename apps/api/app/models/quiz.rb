class Quiz < ApplicationRecord
  has_many :choices, dependent: :destroy
  has_many :answers
end

# Quiz は「たくさんの(4つ) choices を持つ」
