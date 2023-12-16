import { NextRequest, NextResponse } from "next/server";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { OpenAIApi } from "openai";

export async function POST(req: NextRequest) {
  const reqData = await req.json();

  const { websiteLink ,question} = reqData;
  console.log(websiteLink,question);

  // Load data from the web
  const loader = new CheerioWebBaseLoader(websiteLink,
    {
      selector: "p",
    });
  const data = await loader.load();

console.log(data);

  // Split the data into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
  });


  const splitDocs = await textSplitter.splitDocuments(data);

  // Initialize embeddings
  const embeddings = new OpenAIEmbeddings();

  // Initialize FaissStore


  console.log("Saving vector data...");
  
  //THIS  IS CAUSING ERRORS 
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    
  );
console.log(vectorStore,'this is vector store');
const defaultPrompt =
  "You are a customer support AI assistant that provides information about the products available in your business. Ask me anything related to our products!";
  const model = new OpenAI({ temperature: 0, openAIApiKey: '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' });

    
const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(model),
  retriever: vectorStore.asRetriever(),
  returnSourceDocuments: true,
});

const res = await chain.call({
  query: question,
});
console.log(res.text);
  
console.log("Vector data saved successfully.");
return new NextResponse(JSON.stringify({ response: res.text }), {
  headers: { "Content-Type": "application/json" },
});
  // Save the vector data to a file
 
}
