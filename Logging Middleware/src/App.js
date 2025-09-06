import React, { useState } from "react";
import { Log } from "./LogMiddleware";

function App() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(30); // default 30 mins
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortUrl = async () => {
    if (!url) {
      await Log("generateShortUrl", "ERROR", "App", "Empty URL input");
      return;
    }
    if (!isValidUrl(url)) {
      await Log("generateShortUrl", "ERROR", "App", "Invalid URL format");
      return;
    }
    if (!Number.isFinite(validity) || validity <= 0) {
      await Log("generateShortUrl", "ERROR", "App", "Invalid validity value");
      return;
    }

    // Generate unique short id
    const shortId = Math.random().toString(36).substring(2, 8);
    const shortLink = `${window.location.origin}/${shortId}`;

    const newUrl = {
      original: url,
      short: shortLink,
      validity: validity,
    };

    setUrls([...urls, newUrl]);
    setShortUrl(shortLink);

    await Log(
      "generateShortUrl",
      "INFO",
      "App",
      `Generated short link for ${url} → ${shortLink} (valid ${newUrl.validity} mins)`
    );

    setUrl("");
    setValidity(30);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>React URL Shortener</h2>

      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />
      <input
        type="number"
        placeholder="Validity (mins)"
        value={validity}
        min={1}
        onChange={(e) => setValidity(Number(e.target.value))}
        style={{ marginRight: "1rem", padding: "0.5rem", width: "120px" }}
      />
      <button onClick={generateShortUrl} style={{ padding: "0.5rem 1rem" }}>
        Shorten
      </button>

      {shortUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Shortened URL:</strong>{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </p>
        </div>
      )}

      <h3>Generated Links</h3>
      <ul>
        {urls.map((item, index) => (
          <li key={index}>
            {item.original} →{" "}
            <a href={item.short} target="_blank" rel="noreferrer">
              {item.short}
            </a>{" "}
            (valid {item.validity} mins)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;