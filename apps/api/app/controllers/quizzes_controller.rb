# 「問題文＋4択」を取得
class QuizzesController < ApplicationController
  def index
    quizzes = Quiz
      .where(is_published: true)
      .includes(:choices)
      .order(created_at: :desc)

    render json: quizzes.as_json(include: { choices: { only: [:id, :text, :sort_order] } })
  end
end
