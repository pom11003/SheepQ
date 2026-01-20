class Answer < ApplicationRecord
  belongs_to :quiz_attempt
  belongs_to :quiz
  belongs_to :choice
end

# 「この回答は、ある1回の挑戦に属します」

# 「この回答は、ある1問のクイズに属します」

# 「この回答は、ある1つの選択肢に属します」
