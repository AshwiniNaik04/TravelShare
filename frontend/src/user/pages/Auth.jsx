import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/AuthContext";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import "./Auth.css";

const Auth = () => {
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const submitHandler = async (event) => {

    event.preventDefault();

    try {

      const url = isLoginMode
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/users/signup";

      let response;

      if (isLoginMode) {

        response = await fetch(url, {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })

        });

      }

      else {

        const formData =
          new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);

        response = await fetch(url, {

          method: "POST",
          body: formData

        });

      }

      const responseData =
        await response.json();

      if (!response.ok) {

        throw new Error(
          responseData.message
        );

      }

      auth.login(
        responseData.userId,
        responseData.token
      );

      navigate("/");

    } catch (err) {

      setError(err.message || "Something went wrong");

    }

  };

  return (
    <div className="auth-page">

      <Card className="auth">

        <h2>{isLoginMode ? "Login" : "Signup"}</h2>

        <form onSubmit={submitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              type="text"
              label="Name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {!isLoginMode && (
            <Input
              element="input"
              type="file"
              label="Image"
              accept=".jpg,.png,.jpeg"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />
          )}
          <Input
            element="input"
            type="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />

          <Input
            element="input"
            type="password"
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />

          {error && (
            <p className="form-error">{error}</p>
          )}
          <Button type="submit" disabled={password.length < 8}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>

        <button className="auth__switch" onClick={switchModeHandler}>
          {isLoginMode ? "Switch to Signup" : "Switch to Login"}
        </button>
      </Card>
    </div>
  );
};

export default Auth;