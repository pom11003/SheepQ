module Admin
  class QuizzesController < ApplicationController
    #----- GET /admin/quizzes -----#
    def index
      quizzes = Quiz.includes(:choices).order(created_at: :desc)
      render json: { data: quizzes.as_json(include: :choices) }
    end
    # ・N+1問題（クイズごとにchoicesを取りに行って遅くなる）を避けるため、まとめてchoicesも読み込む。
    # ・order(created_at: :desc)　…新しいクイズが上にくるように並べる。
    # ・render json: { data: ... }　…レスポンス形式を統一して、フロントが扱いやすい形に。

    #----- POST /admin/quizzes ------#
def create
  q = quiz_create_params
  choices_param = q[:choices] || []

  # 4択固定ならここでチェック（運用に合わせて）
  if choices_param.length != 4
    return render_error(message: "選択肢は4つ必要です", status: :unprocessable_entity)
  end

  # 「選択肢が4つあること」を保証
  correct_positions = choices_param.each_index.select { |i|
    ActiveModel::Type::Boolean.new.cast(choices_param[i][:is_correct])
  }

  if correct_positions.length != 1
    return render_error(message: "正解の選択肢は1つだけにしてください", status: :unprocessable_entity)
  end

  # 「正解が1つだけであること」を保証
  correct_index = correct_positions.first # 0..3

  quiz = nil

  # 途中で失敗したら 全部なかったことにする（quizだけ保存されてchoicesが保存されない、みたいな中途半端を防ぐ）
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
        # is_correct は correct_index から自動で整合（矛盾防止）
        is_correct: (i == correct_index)
      )
    end

    # 失敗の時にエラーを揃える
    quiz.save!
  end

  render json: { data: quiz.as_json(include: :choices) }, status: :created
rescue ActiveRecord::RecordInvalid => e
  render_error(message: "Validation failed", details: e.record.errors.full_messages, status: :unprocessable_entity)
end


    #----- PATCH /admin/quizzes/:id -----#
    # 公開/非公開の切替など
    def update
      quiz = Quiz.includes(:choices).find(params[:id])
      q = quiz_update_params

      if quiz.update(is_published: cast_bool(q[:is_published]))
        render json: { data: quiz.as_json(include: :choices) }
      else
        render_error(
          message: "Validation failed",
          details: quiz.errors.full_messages,
          status: :unprocessable_entity
        )
      end
    rescue ActiveRecord::RecordNotFound
      render_error(message: "Not Found", status: :not_found)
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
      render_error(message: "Delete failed", details: [e.message], status: :unprocessable_entity)
    end

    

    # --------------------#
    #   ここから private
    # --------------------#

    private 

    # --- Strong Parameters（create用） ---
    def quiz_create_params
      params.permit(
        :question,
        :explanation,
        :image_url,
        :image_credit,
        :is_published,
        choices: [:text, :is_correct, :sort_order]
      )
    end

    # --- Strong Parameters（update用） ---
    def quiz_update_params
      params.permit(:is_published)
    end

    # --- helpers（型・空文字・エラー統一） ---

    # true / false / "true" / "false" を安全に boolean にする
    def cast_bool(v)
      ActiveModel::Type::Boolean.new.cast(v)
    end

    # "" を nil に変換してDBに入れる用
    def blank_to_nil(v)
      v.is_a?(String) && v.strip == "" ? nil : v
    end

    # エラーJSONの統一出力
    def render_error(message:, status:, details: [])
      render json: { error: { message: message, details: details } }, status: status
    end
  end
end



# ------


# module Admin
#   class QuizzesController < ApplicationController
#     # GET /admin/quizzes
#     def index
#       quizzes = Quiz.includes(:choices).order(created_at: :desc)
#       render json: quizzes.as_json(include: :choices)
#     end

#     # POST /admin/quizzes
#     def create
#       quiz = Quiz.new(question: quiz_params[:question])

#       quiz_params[:choices]&.each_with_index do |c, i|
#         quiz.choices.build(
#           text: c[:text],
#           is_correct: c[:is_correct],
#           sort_order: c[:sort_order] || (i + 1)
#         )
#       end

#       unless quiz.choices.any?(&:is_correct)
#         return render json: { error: "正解の選択肢が1つ以上必要です" }, status: :unprocessable_entity
#       end

#       if quiz.save
#         render json: quiz.as_json(include: :choices), status: :created
#       else
#         render json: { error: quiz.errors.full_messages }, status: :unprocessable_entity
#       end
#     end

#     private

#     def quiz_params
#       params.permit(:question, choices: [ :text, :is_correct, :sort_order ])
#     end
#     # PATCH /admin/quizzes/:id
#     def update
#       quiz = Quiz.find(params[:id])
      
#       if quiz.update(quiz_update_params)
#         render json: quiz.as_json(include: :choices)
#       else
#         render json: { error: quiz.errors.full_messages }, status: :unprocessable_entity
#       end
#     end
#     private
#     def quiz_update_params
#       params.permit(:is_published)
#     end

#   end
# end
