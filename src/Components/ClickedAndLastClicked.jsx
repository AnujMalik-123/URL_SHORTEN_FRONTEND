import React, { useState } from "react";
import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();
export default function ClickedAndLastClicked() {
  const [shortId, setShortId] = useState("");
  const [clicks, setClicks] = useState(null);
  const [lastClicked, setLastClicked] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL; // your backend base URL

  const handleFetchStats = async () => {
    if (!shortId.trim()) return alert("Please enter a Short URL code");

    try {
      // Fetch number of clicks
      const clicksRes = await axios.get(`${BASE_URL}/clicks/${shortId}`);
      // Fetch last clicked time
      const lastClickedRes = await axios.get(
        `${BASE_URL}/last-clicked/${shortId}`
      );

      setClicks(clicksRes.data.clicks);
      setLastClicked(lastClickedRes.data.lastClicked);
    } catch (error) {
      console.error(error);
      alert("Error fetching click stats!");
      setClicks(null);
      setLastClicked(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">URL Click Stats</h1>

      <input
        type="text"
        className="w-full max-w-md p-3 rounded-lg border shadow-sm mb-4"
        placeholder="Enter Short URL code"
        value={shortId}
        onChange={(e) => setShortId(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-6"
        onClick={handleFetchStats}
      >
        Fetch Stats
      </button>

      {clicks !== null && (
        <div className="bg-white shadow-lg p-5 rounded-lg w-full max-w-md text-center">
          <p className="text-lg font-semibold">
            Total Clicks: <span className="text-blue-600">{clicks}</span>
          </p>
          <p className="text-lg font-semibold mt-2">
            Last Clicked:{" "}
            <span className="text-blue-600">
              {lastClicked ? new Date(lastClicked).toLocaleString() : "N/A"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
