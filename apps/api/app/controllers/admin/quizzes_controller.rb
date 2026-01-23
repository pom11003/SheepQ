# frozen_string_literal: true

# index：クイズ一覧を返す（選択肢も一緒に）
# create：クイズを新規作成（4択・正解1つを検証）
# update：クイズを更新（選択肢を送った時だけ4択・正解1つを検証し、choicesは全入れ替え）
# destroy：クイズ削除
# privateから下：受け取っていいパラメータ制限と便利関数

#---------- ルール ----------#
# ・Quiz は has_many :choices
# ・choices は 必ず4件
# ・choices のうち is_correct=true は1つだけ
# ・Quiz.correct_index は 0〜3（配列の位置）で正解を持つ
# ・各 Choice は sort_order（表示順 1〜4）を持つ

# Admin という「箱（名前空間）」の中にQuizzesController というクラスを作る
module Admin
  class QuizzesController < ApplicationController

    #----- GET /admin/quizzes -----#
    def index
      quizzes = Quiz.includes(:choices).order(created_at: :desc) # quizzes という箱に「クイズ一覧＋各クイズの選択肢」を入れる
      render json: { data: quizzes.as_json(include: :choices) } # JSON に変換して{ data: ... } という形でフロントに返す
    end
    # includes(:choices) 
    # ・クイズ一覧を取るSQL（1回）
    # ・choicesをまとめて取るSQL（1回）
    # → 2回で済むように動く。

    #----- POST /admin/quizzes -----#
    def create
      q = quiz_create_params 
      choices_param = q[:choices] || []
      # q は「問題文・解説・choices など全部入った箱」
      # quiz_create_params は「受け取っていいデータだけ」を集める関数
      # choices_param は「選択肢の配列」、もし choices が送られてこなかったら、空配列 [] にする。

      # 4択固定（もし選択肢の数が4じゃなかったら、エラーを返して、ここで処理を終わる。）
      if choices_param.length != 4
        return render_error(message: "選択肢は4つ必要です", status: :unprocessable_entity)
      end

      correct_positions = choices_param.each_index.select do |i|
        ActiveModel::Type::Boolean.new.cast(choices_param[i][:is_correct])
      end
      # 0番目は正解？ → false
      # 1番目は正解？ → true
      # 2番目は正解？ → false
      # 3番目は正解？ → false　→ correct_positions = [1]となる。

      # ちょうど1個だけOK
      if correct_positions.length != 1
        return render_error(message: "正解の選択肢は1つだけにしてください", status: :unprocessable_entity)
      end

      # 正解の位置（0〜3）を correct_index に入れる
      correct_index = correct_positions.first
      quiz = nil

      # ここからここまでの処理は、途中で失敗したら全部なかったことにする
      ActiveRecord::Base.transaction do

        #----- クイズ本体を作る -----#
        # ・新しい Quiz を1つ作る
        # ・まだDBには保存していない（メモリ上だけ）
        quiz = Quiz.new(
          question: q[:question],
          explanation: blank_to_nil(q[:explanation]),
          image_url: blank_to_nil(q[:image_url]),
          image_credit: blank_to_nil(q[:image_credit]),
          is_published: cast_bool(q[:is_published]),
          correct_index: correct_index
        )

        #----- 選択肢を4つ作る -----#
        # ・0番目〜3番目までループする①
        # ・各 choice を quiz にくっつけて作る②
        # ・is_correct は i が correct_index と同じ時だけ true → サーバ側で正解を決め直す
        choices_param.each_with_index do |c, i| # ①
          quiz.choices.build( # ②
            text: c[:text], # choicesの文章をそのまま入れる
            sort_order: (c[:sort_order] || (i + 1)), # || は「左が空っぽ（nilなど）なら右を使う」
            is_correct: (i == correct_index) # いま作ってるchoiceの位置 i が correct_index と同じなら true、違うなら false
          )
        end
        #--- choices_param.each_with_index do |c, i| ---#
        # choices_param（配列）を上から順に見ていく
        # ・c に「要素（1つの選択肢データ）」
        # ・i に「順番（0,1,2,3...）」
        #  入れて繰り返す

        # クイズと選択肢をまとめてDBに保存。失敗したら例外が飛ぶ → rescueへ
        quiz.save!
      end

      # 「作成に成功したので、作ったデータをJSONで返すよ」そしてHTTPステータスは 201 Created にするよ
      render json: { data: quiz.as_json(include: :choices) }, status: :created
    rescue ActiveRecord::RecordInvalid => # e もし save! が失敗して例外が起きたら、ここで受け止める
      render_error(
        message: "Validation failed",
        details: e.record.errors.full_messages, # バリデーションエラーの文章一覧を配列で取る
        status: :unprocessable_entity
      )
    end

#----- PATCH /admin/quizzes/:id -----#
# 「choices が送られてきた時だけ」4択チェックする
def update
  quiz = Quiz.includes(:choices).find(params[:id])
  q = quiz_update_params
  choices_param = q[:choices] || []

  # choices を送ってきた時だけ、編集として扱う（公開切替だけPATCHにも対応）
  updating_choices = q.key?(:choices)
   # 今回の更新リクエストに choices というキーがある？
   # ある → 選択肢も編集する
   # ない → 問題文や公開フラグだけ編集する
   # 公開フラグだけ変えたい、問題文だけ直したい時に、choicesを毎回送らなくていい

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

    # クイズ本体は「来た項目だけ」上書きしたい
    quiz.assign_attributes(
      question: q[:question] ? q[:question] : quiz.question,
      explanation: q.key?(:explanation) ? blank_to_nil(q[:explanation]) : quiz.explanation,
      image_url: q.key?(:image_url) ? blank_to_nil(q[:image_url]) : quiz.image_url,
      image_credit: q.key?(:image_credit) ? blank_to_nil(q[:image_credit]) : quiz.image_credit,
      is_published: q.key?(:is_published) ? cast_bool(q[:is_published]) : quiz.is_published
    )

    # choicesを更新する時は「全部消して作り直す」
    if updating_choices
      correct_index = correct_positions.first # 0..3 正解位置を計算
      quiz.correct_index = correct_index # quiz本体の correct_index に保存する


      # いまある選択肢を全部削除して
      quiz.choices.destroy_all

      # 新しい4択を、もう一度最初から作る
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

  # 最後に確実に最新を返すために reload する
  render json: { data: quiz.reload.as_json(include: :choices) }
rescue ActiveRecord::RecordNotFound
  render_error(message: "Not Found", status: :not_found) # Quiz.find(params[:id]) が見つからなかった時のエラーを受ける
rescue ActiveRecord::RecordInvalid => e
  render_error(message: "Validation failed", details: e.record.errors.full_messages, status: :unprocessable_entity)
end # 削除できなかった時、422で理由を返す


    #----- DELETE -----#
    # DELETE /admin/quizzes/:id
    def destroy
      quiz = Quiz.find(params[:id]) # 1.IDでクイズを探す
      quiz.destroy! # 2.見つかったら削除
      render json: { data: { id: quiz.id } } # 3.削除したIDを返す

    # 見つからなかった場合
    rescue ActiveRecord::RecordNotFound
      render_error(message: "Not Found", status: :not_found)
    rescue ActiveRecord::RecordInvalid => e
      render_error(message: "Delete failed", details: [ e.message ], status: :unprocessable_entity)
    end

    private

    # params.permit(...)
    # 意味：ここに書いたキーだけ受け取ってそれ以外は無視する
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

    # APIでは型がバラバラで来るので、正規化する
    # "true" → true
    # "false" → false
    # true → true
    # false → false
    def cast_bool(v)
      ActiveModel::Type::Boolean.new.cast(v)
    end

    # blank_to_nil（" " や "" が来たらnilに）
    # 「空欄で送ったら、DBではNULLにしたい」時に◎
    def blank_to_nil(v)
      v.is_a?(String) && v.strip == "" ? nil : v
    end

    def render_error(message:, status:, details: [])
      render json: { error: { message: message, details: details } }, status: status
    end
  end
end
