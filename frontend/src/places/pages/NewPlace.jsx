import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/AuthContext";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/util/validators";

import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!title || !description || !address || !image) {
      alert("All fields are required!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("image", image);

      const response = await fetch("https://travelshare-mjrv.onrender.com/api/places", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + auth.token
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add place");
      }

      // Navigate to user places
      navigate(`/${auth.userId}/places`);

    } catch (err) {
      console.error(err);
      alert(err.message || "Creating place failed!");
    }

    setIsSubmitting(false);
  };

  return (
    <form className="place-form" onSubmit={submitHandler}>

      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter at least 5 characters."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        id="address"
        element="input"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <ImageUpload
        id="image"
        onInput={(id, file, isValid) => {
          setImage(file);
        }}
        className="image-upload-field"
      />

      <div className="place-action-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Place"}
        </Button>

        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="cancel-btn"
        >
          Cancel
        </Button>
      </div>

    </form>
  );
};

export default NewPlace;