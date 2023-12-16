import {
    HumanMessage,
    SystemMessage,
    AIMessage,
    
  } from "langchain/schema"
  
  export default function formatMessages(
    userList: string[],
    assistantList: string[],
    PROMPT: string
  ) {
    const formatted_messages: (
      | HumanMessage
      | SystemMessage
      | AIMessage
    )[] = [new SystemMessage(PROMPT)]
  
    for (let i = 0; i < assistantList.length; i++) {
      formatted_messages.push(new AIMessage(assistantList[i]))
      if (i < userList.length) {
        formatted_messages.push(new HumanMessage(userList[i]))
      }
    }
  
    if (userList.length > assistantList.length) {
      formatted_messages.push(new HumanMessage(userList[userList.length - 1]))
    }
  
    return formatted_messages
  }