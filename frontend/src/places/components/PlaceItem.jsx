import { useContext, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/AuthContext";
import { Link } from "react-router-dom";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [likes, setLikes] = useState(props.likes?.length || 0);

  // ---------------- MAP ----------------
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  // ---------------- DELETE ----------------
  const deleteHandler = () => setShowConfirm(true);
  const cancelDeleteHandler = () => setShowConfirm(false);

  const confirmDeleteHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/places/${props.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.token
          }
        }
      );

      console.log("DELETE STATUS:", response.status);

      const data = await response.json();
      console.log("DELETE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      props.onDelete(props.id);
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }

    setShowConfirm(false);
  };

  // ---------------- LIKE ----------------
  const likeHandler = async () => {

    console.log("LIKE CLICKED");

    try {

      const response = await fetch(
        `http://localhost:5000/api/places/${props.id}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + auth.token
          }
        }
      );

      console.log("Status:", response.status);

      const data = await response.json();

      console.log("Response Data:", data);

      setLikes(data.likes);

    } catch (err) {

      console.log("ERROR:", err);

    }

  };

  return (
    <>
      {/* DELETE CONFIRMATION */}
      <Modal
        show={showConfirm}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footer={
          <>
            <Button onClick={cancelDeleteHandler}>Cancel</Button>
            <Button onClick={confirmDeleteHandler}>Confirm</Button>
          </>
        }
      >
        <p>This action cannot be undone.</p>
      </Modal>

      {/* MAP MODAL */}
      {/* MAP MODAL */}
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <iframe
            title="map"
            width="100%"
            height="300"
            src={`https://www.google.com/maps?q=${encodeURIComponent(props.address)}&z=15&output=embed`}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </Modal>

      {/* PLACE CARD */}
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          </div>

          <div className="place-item__info">
            <h2>{props.title}</h2>

            <hr />

            <p>{props.description}</p>

            <hr />

            <h3>{props.address}</h3>
          </div>

          <div className="place-item__actions">
            {/* MAP */}
            <Button onClick={openMapHandler}>View on Map</Button>

            {/* LIKE */}
            {auth.isLoggedIn && <Button onClick={likeHandler}>❤️ {likes}</Button>}

            {/* OWNER ACTIONS */}
            {auth.userId === props.creatorId && (
              <>
                <Link to={`/places/${props.id}`}>
                  <Button>Edit</Button>
                </Link>
                <Button onClick={deleteHandler}>Delete</Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;