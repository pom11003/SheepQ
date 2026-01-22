Rails.application.routes.draw do
  post "auth/signup", to: "auth#signup"
  post "auth/login",  to: "auth#login"

  get "quizzes/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # 「GET /quizzes というお願いが来たら、QuizzesController の index に回すよ」
  resources :quizzes, only: [:index]
end
Rails.application.routes.draw do
  namespace :admin do
    resources :quizzes, only: [:index, :create]
  end
end
