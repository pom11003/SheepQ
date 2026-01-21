class CreateQuizzes < ActiveRecord::Migration[8.1]
  def change
    create_table :quizzes do |t|
      t.string :image_url
      t.text :question, null: false # null禁止
      t.text :explanation
      t.boolean :is_published, null: false, default: false # defaultは非公開(下書き)

      t.timestamps
    end
  end
end
