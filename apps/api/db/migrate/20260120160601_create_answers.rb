class CreateAnswers < ActiveRecord::Migration[8.1]
  def change
    create_table :answers do |t|
      t.references :quiz_attempt, null: false, foreign_key: true # quiz_attempt / quiz / choice に紐づく
      t.references :quiz, null: false, foreign_key: true
      t.references :choice, null: false, foreign_key: true
      t.boolean :is_correct, null: false, default: false
      t.datetime :answered_at, null: false

      t.timestamps
    end

    add_index :answers, [:quiz_attempt_id, :quiz_id], unique: true
  end
end
