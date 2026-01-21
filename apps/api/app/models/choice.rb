class Choice < ApplicationRecord
  belongs_to :quiz
  has_many :answers
end

# Choice は「1つの quiz に属する」
