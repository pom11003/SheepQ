class AddImageCreditToQuizzes < ActiveRecord::Migration[8.1]
  def change
    add_column :quizzes, :image_credit, :string
  end
end
