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
  const { name, score } = await req.json();

  if (!name || typeof score !== "number") {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const { error } = await supabase
    .from("leaderboard")
    .insert([{ name, score }]);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
