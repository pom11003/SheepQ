# 「問題文＋4択」を取得
class QuizzesController < ApplicationController
  def index
    quizzes = Quiz
      .where(is_published: true) # 公開中のクイズだけ取り出す
      .includes(:choices)# そのクイズに紐づく「4択」も一緒に取り出す
      .order(created_at: :desc) # 新しい順に並べたい

      # JSONで「問題文＋4択」までまとめて返す。ただしchoices は id, text, sort_order だけを含める。
    render json: quizzes.as_json(include: { choices: { only: [:id, :text, :sort_order] } }) 
  end
end
