class CreateQuizAttempts < ActiveRecord::Migration[8.1]
  def change
    create_table :quiz_attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :total_questions, null: false, default: 0
      t.integer :correct_count, null: false, default: 0
      t.datetime :started_at
      t.datetime :finished_at

      t.timestamps
    end
  end
end

