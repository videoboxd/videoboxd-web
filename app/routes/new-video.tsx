import type { Route } from "./+types/home";
import { useState } from "react";
import { Form, useSubmit } from "react-router";
"use client";

export default function NewVideo() {
    const [rating, setRating] = useState(0);

    return (
      <div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row m-2">
            <img alt="create-logo"></img>
            <h1 className="text-3xl">Create Review</h1>
          </div>
          <div className="m-2">
            <h3 className="text-lg">Close</h3>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="grid grid-cols-1 flex-2/3">
            <Form method="post">
              <div className="flex flex-col">
                <label className="m-2">Video Link</label>
                <input
                  name="video"
                  type="text"
                  placeholder="Paste your video link here"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="m-2">Description</label>
                <textarea 
                  name="description"
                  placeholder="Please describe the video"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="m-2">Platform</label>
                <select
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                >
                  <option>Youtube</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="m-2">Tags</label>
                <input
                  name="tags"
                  type="text"
                  placeholder="e.g. podcast"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-col">
                <label className="m-2">Comments</label>
                <textarea
                  name="comments"
                  placeholder="add your review here"
                  className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                />
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col item-start m-2">
                  <div className="text-sm m-1 mb-3">
                    Rating
                  </div>
                </div>
                <div className="flex flex-col item-end m-2">
                  <div className="text-sm m-1 mb-3">
                    Like
                  </div>
                </div>
              </div>
              <button>
                <div className="bg-sky-400 rounded-full px-3 py-2 m-2 text-black font-medium">
                  Save
                </div>
              </button>
            </Form>
          </div>
          <div className="flex-1/3">
            <div className="border border-white min-h-1/2 m-3">
              <img alt="input image"></img>
            </div>
          </div>
        </div>
      </div>
    );
  }
  