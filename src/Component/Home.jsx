import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  console.log("BASE_URL:", BASE_URL);
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!url.trim()) return alert("Please enter a URL");

    try {
      const response = await axios.post(`${BASE_URL}/generate`, { url });
      setShortId(response.data.shortId);
      if (response.data.message) {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  // Displayed short URL for user
  const fullShortUrl = shortId ? `${BASE_URL}/${shortId}` : "";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-black text-white py-5 shadow-md">
        <h1 className="text-center text-3xl font-bold">🔗 Pro URL Shortener</h1>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <h2 className="text-4xl font-bold text-gray-800">
          Create Your Short URL
        </h2>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="mt-6 w-full max-w-xl">
          <input
            type="text"
            className="w-full p-3 rounded-lg border shadow-sm"
            placeholder="Enter your long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button className="bg-blue-600 text-white w-full py-3 mt-4 rounded-lg hover:bg-blue-700">
            Generate Short URL
          </button>
        </form>

        {/* Show Generated Short URL */}
        {shortId && (
          <div className="mt-8 bg-white shadow-lg p-5 rounded-lg w-full max-w-xl text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Your Short URL:
            </h3>

            <p className="text-blue-600 text-xl font-bold break-words">
              {fullShortUrl}
            </p>

            <div className="flex justify-center gap-4 mt-4">
              {/* COPY BUTTON */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullShortUrl);
                  alert("Copied!");
                }}
                className="bg-black text-white px-5 py-2 rounded-lg"
              >
                Copy
              </button>

              {/* OPEN URL: calls backend API to redirect */}
              <button
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
                onClick={async () => {
                  try {
                    // Call backend API to get original URL
                    const res = await axios.get(`${BASE_URL}/${shortId}`, {
                      headers: { Accept: "application/json" }, // tell backend we want JSON
                    });

                    if (res.data?.original_url) {
                      // Redirect to original URL
                      window.location.href = res.data.original_url;
                    } else {
                      alert("Original URL not found!");
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Error redirecting!");
                  }
                }}
              >
                redirect URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
