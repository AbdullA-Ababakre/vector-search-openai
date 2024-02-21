import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { supabaseClient } from "../../../../utils/supabaseClient";

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

  console.log("embedding11", embedding);

  // Search Supabase
  const { data, error } = await supabaseClient.rpc("vector_search", {
    query_embedding: embedding,
    similarity_threshold: 0.8,
    match_count: 5,
  });

  console.log("dataRes11", data);

  if (data) {
    console.log("dataResponse", data);
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error });
}
