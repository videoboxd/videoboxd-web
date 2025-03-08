import type { Route } from "./+types/home";
import { Form, useSubmit } from "react-router";

export default function NewVideo() {
    return (
      <div>
        <h1 className="text-3xl">Create Review</h1>
        <Form method="post">
          <label>Video Link</label>
          <input
            name="video"
            type="text"
            placeholder="Paste your video link here"
          />
          <label>Description</label>
          <textarea 
            name="description"
            placeholder="Please describe the video"
          />
          <label>Platform</label>
          <select>
            <option>Youtube</option>
          </select>
          <label>Tags</label>
          <input
            name="tags"
            type="text"
            placeholder="e.g. podcast"
          />
          <label>Comments</label>
          <textarea
            name="comments"
            placeholder="add your review here"
          />
          <div>
            Rating
          </div>
          <div>
            Like
          </div>
          <button>Save</button>
          <div>
            <img alt="input image"></img>
          </div>
        </Form>
      </div>
    );
  }
  