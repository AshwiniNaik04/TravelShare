import { useState } from "react";
import { useHttp } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const Signup = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null
  });

  const changeHandler = (event) => {
    if (event.target.name === "image") {
      setFormData({
        ...formData,
        image: event.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const responseData = await sendRequest(
        "https://travelshare-mjrv.onrender.com/api/users/signup",
        "POST",
        data
      );

      console.log("Signup Success:", responseData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Show error modal */}
      <ErrorModal error={error} onClear={clearError} />

      {/* Show loading spinner */}
      {isLoading && <LoadingSpinner />}

      <form onSubmit={submitHandler}>
        <h2>Signup</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={changeHandler}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={changeHandler}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={changeHandler}
          required
        />

        <input
          type="file"
          name="image"
          accept=".jpg,.png,.jpeg"
          onChange={changeHandler}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "SIGNUP"}
        </button>
      </form>
    </>
  );
};

export default Signup;