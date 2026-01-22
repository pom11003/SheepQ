# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_22_091113) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "answers", force: :cascade do |t|
    t.datetime "answered_at", null: false
    t.bigint "choice_id", null: false
    t.datetime "created_at", null: false
    t.boolean "is_correct", default: false, null: false
    t.bigint "quiz_attempt_id", null: false
    t.bigint "quiz_id", null: false
    t.datetime "updated_at", null: false
    t.index ["choice_id"], name: "index_answers_on_choice_id"
    t.index ["quiz_attempt_id", "quiz_id"], name: "index_answers_on_quiz_attempt_id_and_quiz_id", unique: true
    t.index ["quiz_attempt_id"], name: "index_answers_on_quiz_attempt_id"
    t.index ["quiz_id"], name: "index_answers_on_quiz_id"
  end

  create_table "choices", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_correct"
    t.bigint "quiz_id", null: false
    t.integer "sort_order"
    t.string "text"
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_choices_on_quiz_id"
  end

  create_table "quiz_attempts", force: :cascade do |t|
    t.integer "correct_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "finished_at"
    t.datetime "started_at"
    t.integer "total_questions", default: 0, null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_quiz_attempts_on_user_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.integer "correct_index"
    t.datetime "created_at", null: false
    t.text "explanation"
    t.string "image_credit"
    t.string "image_url"
    t.boolean "is_published", default: false, null: false
    t.text "question", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name"
    t.string "password_digest"
    t.string "role", default: "user", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "answers", "choices"
  add_foreign_key "answers", "quiz_attempts"
  add_foreign_key "answers", "quizzes"
  add_foreign_key "choices", "quizzes"
  add_foreign_key "quiz_attempts", "users"
end
