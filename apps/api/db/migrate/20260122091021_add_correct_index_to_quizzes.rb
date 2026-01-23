class AddCorrectIndexToQuizzes < ActiveRecord::Migration[8.1]
  def change
    add_column :quizzes, :correct_index, :integer
  end
end
