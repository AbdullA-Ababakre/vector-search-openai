import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { supabaseClient } from "../../../../utils/supabaseClient";
// Initialize the Supabase client with your Supabase URL and API key
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();

  const query = body.searchTerm;

  if (!query) {
    return NextResponse.json({ error: "Empty query" });
  }

  // Create Embedding
  const openAiEmbeddings = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query,
  });

  const [{ embedding }] = openAiEmbeddings.data;
  console.log("embedding1111", embedding);

  // Search Supabase
  const { data, error } = await supabaseClient.rpc("vector_search", {
    query_embedding: embedding,
    similarity_threshold: 0.8,
    match_count: 5,
  });

  // const { data, error } = await supabaseClient.rpc("hello_world");
  // query ChatGPT via Langchain, pass the query and database results as context

  if (data) {
    console.log(data);
    return NextResponse.json({ data });
  }
  console.log(error);

  return NextResponse.json({ error });
}
