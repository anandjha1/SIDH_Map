import "./styles.css";
import { useState } from "react";
import axios from "axios";
import ProfileCard from "./components/ProfileCard";
import Loader from "./components/Loader";

export default function App() {
  const baseUrl =
    "https://script.google.com/macros/s/AKfycbx0n1pb0MvYHKKZHBSH_j4hIL6MGjjYkCvjTK5-OehH3Cn9pDzTSxs7aznNMLJPl8Nc/exec";
  const [link, setLink] = useState("");
  const [sidJsonArr, setSidJsonArr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSidData = async () => {
    if (!link) return;

    const idMatch = link.match(/([^/?]+)\?/);
    const id = idMatch ? idMatch[1] : null;

    if (id) {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${baseUrl}?linkId=${id}`);
        setSidJsonArr(res.data);
      } catch (error) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid URL format");
    }
  };

  return (
    <div className="App">
      <h1>SID Details Mapping</h1>
      <input
        type="text"
        value={link}
        placeholder="Paste Profile link here."
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={getSidData}>Submit</button>
      {loading && <Loader />}
      {error && <div className="error">{error}</div>}
      {sidJsonArr && (
        <ProfileCard
          data={sidJsonArr}
          setData={setSidJsonArr}
          link={link}
          setLink={setLink}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
}
