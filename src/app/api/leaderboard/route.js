import { supabase } from "@/lib/supabase";

// Get leaderboard
export async function GET() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// Add points to leaderboard
export async function POST(req) {
  const { name, score, action } = await req.json();

  if (!name || typeof score !== "number") {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  // See if player already exist
  const { data: existingPlayer, error: fetchError } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("name", name)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return Response.json({ error: fetchError.message }, { status: 500 });
  }

  if (existingPlayer && action === "add") {
    // Player exists - add stars to existing score
    const { error } = await supabase
      .from("leaderboard")
      .update({ score: existingPlayer.score + score })
      .eq("name", name);

    if (error) return Response.json({ error: error.message }, { status: 500 });
  } else {
    // New player - create new entry
    const { error } = await supabase
      .from("leaderboard")
      .insert([{ name, score }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
