class JwtService
  ALGORITHM = "HS256"

  def self.encode(payload)
    secret = ENV.fetch("JWT_SECRET")
    exp_hours = ENV.fetch("JWT_EXP_HOURS", "24").to_i
    exp = exp_hours.hours.from_now.to_i

    JWT.encode(payload.merge(exp: exp), secret, ALGORITHM)
  end

  def self.decode(token)
    secret = ENV.fetch("JWT_SECRET")
    decoded, = JWT.decode(token, secret, true, { algorithm: ALGORITHM })
    decoded.with_indifferent_access
  end
end
