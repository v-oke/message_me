require "test_helper"

class MessagesControllerTest < ActionDispatch::IntegrationTest
  test "should get creae" do
    get messages_creae_url
    assert_response :success
  end
end
