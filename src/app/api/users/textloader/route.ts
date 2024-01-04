
import { NextRequest,NextResponse } from "next/server";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";

export async function POST(req: NextRequest) {
    const reqData=await req.json()
    const { question }= reqData
    console.log(question);
    const source='src/data/inventory.csv'
  const loader = new TextLoader(source);
const docs = await loader.load();
console.log('docs loaded');


// Load the docs into the vector store
const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
);
console.log('Vector datas');

// Search for the most similar document

const model = new OpenAI({ temperature: 0,openAIApiKey:'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' });
const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAStuffChain(model),
    retriever: vectorStore.asRetriever(),
    returnSourceDocuments: true,
  });
  
  const res = await chain.call({
    query: question,
  });

return NextResponse.json(res)
}