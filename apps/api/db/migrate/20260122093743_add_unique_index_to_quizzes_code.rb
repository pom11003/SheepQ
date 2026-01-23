class AddUniqueIndexToQuizzesCode < ActiveRecord::Migration[8.1]
  def change
    add_index :quizzes, :code, unique: true
  end
end
