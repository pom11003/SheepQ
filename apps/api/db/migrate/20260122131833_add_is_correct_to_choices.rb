class AddIsCorrectToChoices < ActiveRecord::Migration[8.1]
  def change
    add_column :choices, :is_correct, :boolean
  end
end
