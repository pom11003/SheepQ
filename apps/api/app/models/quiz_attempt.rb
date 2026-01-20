
class QuizAttempt < ApplicationRecord
  belongs_to :user
  has_many :answers, dependent: :destroy
end

# belongs_to :user
# 「この挑戦は、1人のユーザーのものです」
# has_many :answers
# 「この挑戦には、たくさんの回答があります」
# dependent: :destroy
# 「この挑戦を消したら、中の回答も全部一緒に消す」
