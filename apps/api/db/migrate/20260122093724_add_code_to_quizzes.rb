class AddCodeToQuizzes < ActiveRecord::Migration[8.1]
  def change
    add_column :quizzes, :code, :integer
  end
end
