import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import "./UpdatePlace.css";

const UpdatePlace = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ---------------- FETCH PLACE FROM BACKEND ----------------
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(
          `https://travelshare-mjrv.onrender.com/api/places/${pid}`
        );

        const data = await response.json();

        setTitle(data.place.title);
        setDescription(data.place.description);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPlace();
  }, [pid]);

  // ---------------- UPDATE PLACE ----------------
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await fetch(`https://travelshare-mjrv.onrender.com/api/places/${pid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth?.token
        },
        body: JSON.stringify({
          title,
          description,
          userId: auth.userId
        })
      });

      navigate(`/${auth.userId}/places`);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <h2 className="center">Loading...</h2>;
  }

  return (
    <div className="update-place">
      <h2>Update Place</h2>

      <form onSubmit={submitHandler}>
        <div className="form-control">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label>Description</label>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="update-btn">
          Update Place
        </button>
      </form>
    </div>
  );
};

export default UpdatePlace;