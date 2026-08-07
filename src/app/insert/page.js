"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export default function Insert() {
  const supabase = createClient();
  const router = useRouter();

  const INITIAL_PORTFOLIO = {
    title: "",
    content: "",
    url: "",
    reviewer: "",
    review: "",
  };
  const createInitialImages = () => [
    { file: null, description: "", displayOrder: 1 },
    { file: null, description: "", displayOrder: 2 },
  ];

  const [user, setUser] = useState(null);
  const [authForm, setAuthform] = useState({
    email: "",
    password: "",
  });

  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);
  const [thumbnail, setThumbnail] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState(createInitialImages);

  const fileRef = useRef({ thumbnail: null, image1: null, image2: null });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    })();
  }, [supabase.auth]);

  async function insertData(e) {
    e.preventDefault();
    let thumbnailPath = null;
    if (thumbnail) {
      thumbnailPath = await uploadThumbnail(thumbnail);
      if (!thumbnailPath) {
        alert("Failed to upload thumbnail");
        return;
      }
    }

    const { error } = await supabase.from("portfolio").insert({ ...portfolio, thumbnail: thumbnailPath });
    if (error) {
      console.error(error);
      await supabase.storage.from("portfolio").remove(thumbnailPath);
    } else {
      console.log("Data insertion successful");
      router.push("/");
    }
  }
  async function uploadThumbnail(file) {
    const ext = file.name.split(".").pop();
    const filePath = `thumbnail/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("portfolio").upload(filePath, file);
    if (error) {
      console.error("썸네일 업로드 실패: " + error);
      return null;
    } else {
      console.log("썸네일 업로드 성공");
      return filePath;
    }
  }

  const handleAuthChange = e => {
    const { name, value } = e.target;
    setAuthform({
      ...authForm,
      [name]: value,
    });
  };
  const handleLogin = async e => {
    e.preventDefault();
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword(authForm);
    if (error) {
      alert("로그인 실패: ", error.message);
    } else {
      alert("로그인 성공");
      setUser(user);
      router.refresh();
    }
  };

  const handlePortfolioChange = e => {
    const { name, value } = e.target;
    setPortfolio({
      ...portfolio,
      [name]: value,
    });
  };
  const handleThumbnailFileChange = e => {
    setThumbnail(e.target.files[0]);
  };
  const handlePortfolioFileChange = index => e => {
    const selectedFile = e.target.files?.[0] ?? null;
    setPortfolioImages(prev =>
      prev.map((img, idx) =>
        index === idx
          ? {
              ...img,
              file: selectedFile,
            }
          : img,
      ),
    );
  };
  const handlePortfolioDescChange = index => e => {
    const { value } = e.target;
    setPortfolioImages(prev =>
      prev.map((img, idx) =>
        index === idx
          ? {
              ...img,
              description: value,
            }
          : img,
      ),
    );
  };

  if (!user) {
    return (
      <div className="about_content shadow">
        <h2>Auth Login</h2>
        <div className="contact_form">
          <form onSubmit={handleLogin}>
            <p className="field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required onChange={handleAuthChange} />
            </p>
            <p className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleAuthChange}
              />
            </p>
            <p className="submit">
              <input type="submit" className="primary-btn" value="Submit" />
            </p>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="about_content shadow">
      <h2>Input Portfolio Data</h2>
      <div className="contact_form">
        <form onSubmit={insertData}>
          <p className="field">
            <label htmlFor="title">Project Name</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Project Name"
              required
              onChange={handlePortfolioChange}
            />
          </p>
          <p className="field">
            <label htmlFor="content">Project Description</label>
            <textarea
              name="content"
              id="content"
              cols="30"
              rows="10"
              placeholder="Project Description"
              required
              onChange={handlePortfolioChange}
            ></textarea>
          </p>
          <p className="field">
            <label htmlFor="thumbnail">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/"
              required
              onChange={handleThumbnailFileChange}
              ref={fileRef.current.thumbnail}
            />
          </p>
          <hr />
          <p className="field">
            <label htmlFor="url">Project URL</label>
            <input type="url" name="url" id="url" placeholder="Project URL" onChange={handlePortfolioChange} />
          </p>
          <p className="field">
            <label htmlFor="reviewer">Project Reviewer</label>
            <input
              type="text"
              name="reviewer"
              id="reviewer"
              placeholder="Project Reviewer"
              onChange={handlePortfolioChange}
            />
          </p>
          <p className="field">
            <label htmlFor="review">Project Review</label>
            <textarea
              name="review"
              id="review"
              cols="30"
              rows="10"
              placeholder="Project Review"
              onChange={handlePortfolioChange}
            ></textarea>
          </p>
          <hr />
          <p className="field">
            <label htmlFor="rep1_img">Rep. Image 1</label>
            <input
              type="file"
              name="rep1_img"
              id="rep1_img"
              accept="image/"
              onChange={handlePortfolioFileChange(0)}
              ref={fileRef.current.image1}
            />
          </p>
          <p className="field">
            <label htmlFor="rep1_desc">Rep.1 Description</label>
            <input
              type="text"
              name="rep1_desc"
              id="rep1_desc"
              placeholder="Representative Image 1 Description"
              onChange={handlePortfolioDescChange(0)}
            />
          </p>
          <p className="field">
            <label htmlFor="rep2_img">Rep. Image 2</label>
            <input
              type="file"
              name="rep2_img"
              id="rep2_img"
              accept="image/"
              onChange={handlePortfolioFileChange(1)}
              ref={fileRef.current.image2}
            />
          </p>
          <p className="field">
            <label htmlFor="rep2_desc">Rep.2 Description</label>
            <input
              type="text"
              name="rep2_desc"
              id="rep2_desc"
              placeholder="Representative Image 2 Description"
              onChange={handlePortfolioDescChange(1)}
            />
          </p>
          <p className="submit">
            <input type="submit" className="primary-btn" value="Submit" />
          </p>
        </form>
      </div>
    </div>
  );
}
