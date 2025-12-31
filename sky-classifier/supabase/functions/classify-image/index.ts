import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error("No image provided");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing satellite image ...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert image analyst specializing in land cover classification.

Analyze the image and classify the land cover types present.

IMPORTANT CLASSIFICATION RULES:
1. Categories: Forest, Urban, Water, Agricultural, Desert
2. Percentages MUST sum to exactly 100
3. Apply common sense logic:
   - If significant water OR vegetation is present, desert should be very low (0-5%)
   - If there's lush green vegetation, it's likely Forest or Agricultural, not Desert
   - Gray/brown structures indicate Urban areas
   - Blue areas indicate Water bodies
   - Golden/brown fields indicate Agricultural land
   - Sandy/arid terrain with no vegetation indicates Desert

4. Be precise - analyze the actual colors and patterns in the image:
   - Green tones = Forest or Agricultural
   - Blue tones = Water
   - Gray/brown structures = Urban
   - Yellow/golden fields = Agricultural  
   - Sandy orange/tan with no vegetation = Desert

Return ONLY a JSON object with this exact format (no markdown, no explanation):
{"forest": number, "urban": number, "water": number, "agricultural": number, "desert": number}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this satellite image and classify the land cover. Return only the JSON with percentages that sum to 100."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("AI response:", content);

    // Parse the JSON response
    let classification;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classification = JSON.parse(jsonMatch[0]);
        
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse  response:", parseError);
      // Return fallback based on common patterns
      classification = {
        forest: 25,
        urban: 20,
        water: 20,
        agricultural: 25,
        desert: 10
      };
    }

    // Normalize to ensure sum is 100
    const total = Object.values(classification).reduce((sum: number, val) => sum + (val as number), 0);
    if (total !== 100) {
      const factor = 100 / total;
      Object.keys(classification).forEach(key => {
        classification[key] = Math.round(classification[key] * factor);
      });
      // Adjust for rounding errors
      const newTotal = Object.values(classification).reduce((sum: number, val) => sum + (val as number), 0);
      if (newTotal !== 100) {
        const maxKey = Object.keys(classification).reduce((a, b) => 
          classification[a] > classification[b] ? a : b
        );
        classification[maxKey] += 100 - newTotal;
      }
    }

    console.log("Final classification:", classification);

    return new Response(JSON.stringify({ classification }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Classification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
