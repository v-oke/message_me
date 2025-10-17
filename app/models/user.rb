class User < ActiveRecord::Base
    has_secure_password
    validates :username, presence: true, uniqueness: { case_sensitive: false }, length: { minimum: 3 }
    validates :password, presence: true, length: { minimum: 6 }
    has_many :messages, dependent: :destroy
end
