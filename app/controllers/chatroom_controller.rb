class ChatroomController < ApplicationController
  before_action :require_user
  def index
    @messages = Message.last(5)
    @message = Message.new()
  end
end
