import { createClient } from "@/utils/supabase/client";

export default async function Page() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase.from("portfolio").select();
  console.log(projects);
  if (error) {
    console.error("Connection failed: ", error);
    return <div>Failed to load projects</div>;
  }

  return (
    <>
      <></>
    </>
  );
}
