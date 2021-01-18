import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { ConversationQueryRenderer as Conversation } from "./Screens/Conversation"

export const ConversationNavigator: React.FC<{ conversationID: string }> = ({ conversationID }) => {
  const initialRoute = { component: Conversation, passProps: { conversationID } }

  return <NavigatorIOS initialRoute={initialRoute} />
}
