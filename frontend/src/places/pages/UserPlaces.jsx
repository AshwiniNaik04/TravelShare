import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/AuthContext";

const UserPlaces = () => {
  const { userId } = useParams();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPlaces = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/places/user/${userId}`
      );
      const data = await response.json();
      setLoadedPlaces(data.places || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [userId]);

  // Delete place handler
  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((p) => p.id !== deletedPlaceId)
    );
  };

  if (loadedPlaces.length === 0) {
    return (
      <Card className="no-places-card">
        <h2>No places found!</h2>

        {auth.userId === userId ? (
          <>
            <p>Maybe create one now?</p>
            <Button
              onClick={() => navigate("/places/new")}
              style={{ marginTop: "10px" }}
            >
              Share Place
            </Button>
          </>
        ) : (
          <p>This user has not added any places yet.</p>
        )}
      </Card>
    );
  }

  return (
    <PlaceList
      items={loadedPlaces}
      onDeletePlace={deletePlaceHandler}
    />
  );
};

export default UserPlaces;