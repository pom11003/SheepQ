require "rails_helper"

RSpec.describe "Auth login", type: :request do
  describe "POST /auth/login" do
    before do
      host! "localhost:3001" # ← これがHost Authorization対策
      ENV["JWT_SECRET"] = "test-secret"
    end

    let!(:user) do
      User.find_or_create_by!(email: "admin@example.com") do |u|
        u.password = "password"
        u.role = "admin"
      end
    end

    it "成功: 200で message=ok / token / user が返る" do
      post "/auth/login",
           params: { email: user.email, password: "password" },
           as: :json

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json["message"]).to eq("ok")
      expect(json["token"]).to be_present
      expect(json["user"]).to include("email" => "admin@example.com", "role" => "admin")
      expect(json["user"]["id"]).to be_a(Integer)
    end

    it "失敗: パスワード違いは401" do
      post "/auth/login",
           params: { email: user.email, password: "wrong" },
           as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
