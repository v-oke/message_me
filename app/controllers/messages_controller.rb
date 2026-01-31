class MessagesController < ApplicationController
  before_action :require_user

  def create
    @message = current_user.messages.build(message_params)
    if @message.save
      ActionCable.server.broadcast(
      "chatroom_channel",
      { html: render_to_string(partial: "messages/message", locals: { message: @message }) }
    )
    head :ok
    else
      flash[:error] = "Message cannot be blank"
      redirect_to root_path
    end
  end

  private
  def message_params
    params.require(:message).permit(:body)
  end
end
