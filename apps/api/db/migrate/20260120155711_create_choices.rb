class CreateChoices < ActiveRecord::Migration[8.1]
  def change
    create_table :choices do |t|
      t.references :quiz, null: false, foreign_key: true
      t.string :text
      t.boolean :is_correct
      t.integer :sort_order

      t.timestamps
    end
  end
end
