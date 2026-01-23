Rails.application.routes.draw do
  # 認証
  post "auth/signup", to: "auth#signup"
  post "auth/login",  to: "auth#login"

  # これ重複のため不要get "quizzes/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # 「GET /quizzes というお願いが来たら、QuizzesController の index に回すよ」
  # これ重複のため不要resources :quizzes, only: [:index]


  # 管理画面用（問題登録・一覧など）
  namespace :admin do
  resources :quizzes, only: [:index, :create, :update, :destroy]
end


 # フロント（Next.js）から叩く公開API
 scope :api do
    get "quizzes",        to: "quizzes#index"
    get "quizzes/random", to: "quizzes#random"
  end
end
