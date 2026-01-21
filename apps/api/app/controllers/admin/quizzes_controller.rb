module Admin
  class QuizzesController < ApplicationController
    # GET /admin/quizzes
    def index
      quizzes = Quiz.includes(:choices).order(created_at: :desc)
      render json: quizzes.as_json(include: :choices)
    end

    # POST /admin/quizzes
    def create
      quiz = Quiz.new(question: quiz_params[:question])

      quiz_params[:choices]&.each_with_index do |c, i|
        quiz.choices.build(
          text: c[:text],
          is_correct: c[:is_correct],
          sort_order: c[:sort_order] || (i + 1)
        )
      end

      unless quiz.choices.any?(&:is_correct)
        return render json: { error: "正解の選択肢が1つ以上必要です" }, status: :unprocessable_entity
      end

      if quiz.save
        render json: quiz.as_json(include: :choices), status: :created
      else
        render json: { error: quiz.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def quiz_params
      params.permit(:question, choices: [:text, :is_correct, :sort_order])
    end
  end
end
