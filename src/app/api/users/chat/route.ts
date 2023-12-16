import { ChatOpenAI } from "langchain/chat_models/openai";
import { NextRequest, NextResponse } from "next/server";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
  
} from "langchain/prompts";

import {
  BufferMemory
} from "langchain/memory";

export const runtime = "edge";
export const preferredRegion = "auto";

export async function POST(req: NextRequest) {

  const data = await req.json();

  const { PROMPT,previous_messages,a,u } = data;

  const chat = new ChatOpenAI({ temperature: 0 });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);



  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    
    llm: chat,
  });
  const response = await chain.call({
    input: PROMPT,
  });
  console.log(response);

  return new NextResponse(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });



 
}
