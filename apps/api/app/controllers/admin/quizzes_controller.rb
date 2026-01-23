# frozen_string_literal: true

module Admin
  class QuizzesController < ApplicationController
    # GET /admin/quizzes
    def index
      quizzes = Quiz.includes(:choices).order(created_at: :desc)
      render json: { data: quizzes.as_json(include: :choices) }
    end

    # POST /admin/quizzes
    def create
      q = quiz_create_params
      choices_param = q[:choices] || []

      # 4択固定
      if choices_param.length != 4
        return render_error(message: "選択肢は4つ必要です", status: :unprocessable_entity)
      end

      # 正解は1つだけ
      correct_positions = choices_param.each_index.select do |i|
        ActiveModel::Type::Boolean.new.cast(choices_param[i][:is_correct])
      end

      if correct_positions.length != 1
        return render_error(message: "正解の選択肢は1つだけにしてください", status: :unprocessable_entity)
      end

      correct_index = correct_positions.first
      quiz = nil

      ActiveRecord::Base.transaction do
        quiz = Quiz.new(
          question: q[:question],
          explanation: blank_to_nil(q[:explanation]),
          image_url: blank_to_nil(q[:image_url]),
          image_credit: blank_to_nil(q[:image_credit]),
          is_published: cast_bool(q[:is_published]),
          correct_index: correct_index
        )

        choices_param.each_with_index do |c, i|
          quiz.choices.build(
            text: c[:text],
            sort_order: (c[:sort_order] || (i + 1)),
            is_correct: (i == correct_index)
          )
        end

        quiz.save!
      end

      render json: { data: quiz.as_json(include: :choices) }, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render_error(
        message: "Validation failed",
        details: e.record.errors.full_messages,
        status: :unprocessable_entity
      )
    end

#----- PATCH /admin/quizzes/:id -----#
def update
  quiz = Quiz.includes(:choices).find(params[:id])
  q = quiz_update_params
  choices_param = q[:choices] || []

  # choices を送ってきた時だけ、編集として扱う（公開切替だけPATCHにも対応）
  updating_choices = q.key?(:choices)

  if updating_choices
    if choices_param.length != 4
      return render_error(message: "選択肢は4つ必要です", status: :unprocessable_entity)
    end

    correct_positions = choices_param.each_index.select { |i|
      ActiveModel::Type::Boolean.new.cast(choices_param[i][:is_correct])
    }

    if correct_positions.length != 1
      return render_error(message: "正解の選択肢は1つだけにしてください", status: :unprocessable_entity)
    end
  end

  ActiveRecord::Base.transaction do
    # クイズ本体の更新（来たものだけ反映）
    quiz.assign_attributes(
      question: q[:question] ? q[:question] : quiz.question,
      explanation: q.key?(:explanation) ? blank_to_nil(q[:explanation]) : quiz.explanation,
      image_url: q.key?(:image_url) ? blank_to_nil(q[:image_url]) : quiz.image_url,
      image_credit: q.key?(:image_credit) ? blank_to_nil(q[:image_credit]) : quiz.image_credit,
      is_published: q.key?(:is_published) ? cast_bool(q[:is_published]) : quiz.is_published
    )

    if updating_choices
      correct_index = correct_positions.first # 0..3
      quiz.correct_index = correct_index

      # いちばん簡単で事故りにくい：いったん choices 全入れ替え
      quiz.choices.destroy_all

      choices_param.each_with_index do |c, i|
        quiz.choices.build(
          text: c[:text],
          sort_order: (c[:sort_order] || (i + 1)),
          is_correct: (i == correct_index) # correct_index と整合
        )
      end
    end

    quiz.save!
  end

  render json: { data: quiz.reload.as_json(include: :choices) }
rescue ActiveRecord::RecordNotFound
  render_error(message: "Not Found", status: :not_found)
rescue ActiveRecord::RecordInvalid => e
  render_error(message: "Validation failed", details: e.record.errors.full_messages, status: :unprocessable_entity)
end


    #----- DELETE -----#
    # DELETE /admin/quizzes/:id
    def destroy
      quiz = Quiz.find(params[:id])
      quiz.destroy!
      render json: { data: { id: quiz.id } }
    rescue ActiveRecord::RecordNotFound
      render_error(message: "Not Found", status: :not_found)
    rescue ActiveRecord::RecordInvalid => e
      render_error(message: "Delete failed", details: [ e.message ], status: :unprocessable_entity)
    end

    private

    def quiz_create_params
      params.permit(
        :question,
        :explanation,
        :image_url,
        :image_credit,
        :is_published,
        choices: %i[text is_correct sort_order]
      )
    end

    def quiz_update_params
  params.permit(
    :question,
    :explanation,
    :image_url,
    :image_credit,
    :is_published,
    choices: [ :text, :is_correct, :sort_order ]
  )
end


    # --- helpers（型・空文字・エラー統一） ---

    # true / false / "true" / "false" を安全に boolean にする
    def cast_bool(v)
      ActiveModel::Type::Boolean.new.cast(v)
    end

    def blank_to_nil(v)
      v.is_a?(String) && v.strip == "" ? nil : v
    end

    def render_error(message:, status:, details: [])
      render json: { error: { message: message, details: details } }, status: status
    end
  end
end
