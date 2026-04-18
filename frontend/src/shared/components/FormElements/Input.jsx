import React from "react";
import "./Input.css";

const Input = (props) => {

  //Password validation
  let errorText = "";

  if (props.type === "password") {

    if (
      props.value &&
      props.value.length > 0 &&
      props.value.length < 8
    ) {

      errorText =
        "Password must be at least 8 characters";

    }

  }

  const element =
    props.element === "textarea" ? (

      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />

    ) : (

      <input
        id={props.id}
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />

    );

  return (

    <div
      className={`form-control ${errorText
          ? "form-control--invalid"
          : ""
        }`}
    >

      <label htmlFor={props.id}>
        {props.label}
      </label>

      {element}

      {/*Error Message */}
      {errorText && (

        <p className="error-text">
          {errorText}
        </p>

      )}

    </div>

  );

};

export default Input;