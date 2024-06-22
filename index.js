import express from "express";
import axios from "axios";
import { parseBuffer } from "music-metadata";

const app = express();
app.use(express.json());

app.post("/get-audio-duration", async (req, res) => {
  const { url } = req.body;

  try {
    // Fetch the audio file from the URL
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    // Parse metadata from the audio file buffer
    const metadata = await parseBuffer(
      buffer,
      response.headers["content-type"]
    );
    let duration = metadata.format.duration;
    try {
      duration = Math.floor(duration);
    } catch (err) {
      null;
    }

    res.json({ duration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
