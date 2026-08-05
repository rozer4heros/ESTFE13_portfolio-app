import { createClient } from "@/utils/supabase/client";

export default async function PortfolioSingle({ params }) {
  const supabase = createClient();
  const { id } = await params;
  const { data, error } = await supabase.from("portfolio").select().eq("id", id).limit(1).single();
  if (error) {
    console.error(error);
  }

  // 이전 글 조회
  const { data: prev } = await supabase
    .from("portfolio")
    .select()
    .lt("id", id)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 다음 글 조회
  const { data: next } = await supabase
    .from("portfolio")
    .select()
    .gt("id", id)
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <div className="portoflio-single">
      <div className="row">
        <div className="col-md-8 decription">
          <div className="contents shadow">
            {/* <img src="images/portfolio_single_img1.jpg" alt="img1" /> */}
            <p>{data?.rep1_desc ?? ""}</p>
          </div>
          <div className="contents shadow">
            {/* <img src="images/portfolio_single_img2.jpg" alt="img2" /> */}
            <p>{data?.rep2_desc ?? ""}</p>
          </div>
        </div>
        <div className="col-md-4 portfolio_info">
          <div className="contents shadow">
            <h2>{data?.title ?? "Title"}</h2>
            <div>{data?.content ?? "Description"}</div>
            <p className="link">
              <a href={data?.url ?? ""}>Visit site &rarr;</a>
            </p>
            <hr className="double" />
            <blockquote>
              <p>{data?.review ?? ""}</p>
              <small>{data?.reviewer ? `- ${data.reviewer} -` : ""}</small>
            </blockquote>
            <p className="nav">
              {prev ? (
                <a href={`/portfolio/${prev.id}`} className="secondary-btn">
                  &larr; {prev.title}
                </a>
              ) : (
                <button className="secondary-btn" disabled>
                  처음 글입니다.
                </button>
              )}
              {next ? (
                <a href={`/portfolio/${next.id}`} className="secondary-btn">
                  {next.title} &rarr;
                </a>
              ) : (
                <button className="secondary-btn" disabled>
                  마지막 글입니다.
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
