class AddIsCorrectToChoices < ActiveRecord::Migration[8.1]
  def change
    unless column_exists?(:choices, :is_correct)
      add_column :choices, :is_correct, :boolean
    end
  end
end
