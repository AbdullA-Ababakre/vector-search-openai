import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseClient } from "@/utils/supabaseClient";
import { text } from "stream/consumers";
export async function POST(req: NextRequest) {
  // const body = await req.json();
  // const { builders } = body;

  const { data: builders, error } = await supabaseClient
    .from("builders")
    .select();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  // Function to generate OpenAI embeddings for a given text
  async function generateOpenAIEmbeddings(profile: any) {
    // console.log("textToEmbed111", textToEmbed);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: profile,
    });
    return response.data[0].embedding;
  }

  try {
    // Map over the array and process each item
    if (builders) {
      const processedDataArray = await Promise.all(
        builders.map(async (item: any) => {
          const embeddings = await generateOpenAIEmbeddings(item.summary);
          // const modifiedItem = { ...item, embeddings };
          // const { data, error } = await supabaseClient
          //   .from("builders")
          //   .upsert({ id: item.id });

          const { data, error } = await supabaseClient
            .from("builders")
            .update({ embeddings: embeddings })
            .eq("id", item.id)
            .select();

          // Check for errors
          if (error) {
            console.error("Error inserting data into Supabase:", error.message);
            return NextResponse.json({
              success: false,
              status: 500,
              result: error,
            });
          }

          return NextResponse.json({
            success: true,
            status: 200,
            result: data,
          });
        })
      );

      // Check if any insertions failed
      const hasError = processedDataArray.some((result) => !result.success);

      if (hasError) {
        return NextResponse.json({
          error: "One or more insertions failed",
          status: 500,
        });
      }

      // Data successfully inserted for all items

      return NextResponse.json({
        status: 200,
        success: true,
        results: processedDataArray,
      });
    }
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    return NextResponse.json({
      status: 500,
      success: false,
      results: error,
      message: "Internal Server Error",
    });
  }
}
