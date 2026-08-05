"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export default function Insert() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    url: "",
    reviewer: "",
    review: "",
    rep1_img: "",
    rep1_desc: "",
    rep2_img: "",
    rep2_desc: "",
  });

  async function insertData(e) {
    e.preventDefault();
    const { error } = await supabase.from("portfolio").insert(formData);
    if (error) {
      console.error(error);
    } else {
      console.log("Data insertion successful");
      router.push("/");
    }
  }
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="about_content shadow">
      <h2>Input Portfolio Data</h2>
      <div className="contact_form">
        <form onSubmit={insertData}>
          <p className="field">
            <label htmlFor="title">Project Name:</label>
            <input type="text" name="title" id="title" placeholder="Project Name" required onChange={handleChange} />
          </p>
          <p className="field">
            <label htmlFor="content">Project Description:</label>
            <textarea
              name="content"
              id="content"
              cols="30"
              rows="10"
              placeholder="Project Description"
              required
              onChange={handleChange}
            ></textarea>
          </p>
          <p className="field">
            <label htmlFor="thumbnail">Thumbnail:</label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/"
              required={false}
              onChange={handleChange}
            />
          </p>
          <p className="field">
            <label htmlFor="url">Project URL:</label>
            <input type="url" name="url" id="url" placeholder="Project URL" onChange={handleChange} />
          </p>
          <p className="field">
            <label htmlFor="reviewer">Project Reviewer:</label>
            <input type="text" name="reviewer" id="reviewer" placeholder="Project Reviewer" onChange={handleChange} />
          </p>
          <p className="field">
            <label htmlFor="review">Project Review:</label>
            <textarea
              name="review"
              id="review"
              cols="30"
              rows="10"
              placeholder="Project Review"
              onChange={handleChange}
            ></textarea>
          </p>
          <p className="field">
            <label htmlFor="rep1_img">Rep. Image 1:</label>
            <input type="file" name="rep1_img" id="rep1_img" accept="image/" onChange={handleChange} />
          </p>
          <p className="field">
            <label htmlFor="rep1_desc">Rep.1 Description:</label>
            <input
              type="text"
              name="rep1_desc"
              id="rep1_desc"
              placeholder="Representative Image 1 Description"
              onChange={handleChange}
            />
          </p>
          <p className="field">
            <label htmlFor="rep2_img">Rep. Image 2:</label>
            <input type="file" name="rep2_img" id="rep2_img" accept="image/" onChange={handleChange} />
          </p>
          <p className="field">
            <label htmlFor="rep2_desc">Rep.2 Description:</label>
            <input
              type="text"
              name="rep2_desc"
              id="rep2_desc"
              placeholder="Representative Image 2 Description"
              onChange={handleChange}
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
