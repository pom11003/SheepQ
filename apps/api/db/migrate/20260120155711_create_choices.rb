class CreateChoices < ActiveRecord::Migration[8.1]
  def change
    create_table :choices do |t|
      t.references :quiz, null: false, foreign_key: true # 外部キー（FK）
      t.string :text, null: false
      t.boolean :is_correct, null: false, default: false # defaultは不正解
      t.integer :sort_order, null: false

      t.timestamps
    end

    add_index :choices, [:quiz_id, :sort_order], unique: true
  end
end
