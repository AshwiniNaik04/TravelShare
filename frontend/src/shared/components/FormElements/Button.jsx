import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {

  if (props.to) {
    return (
      <Link
        to={props.to}
        className={`button button--${props.size || "default"} 
        button--${props.inverse ? "inverse" : "primary"}`}
      >
        {props.children}
      </Link>
    );
  }

  if (props.href) {
    return (
      <a
        href={props.href}
        className={`button button--${props.size || "default"} 
        button--${props.inverse ? "inverse" : "primary"}`}
      >
        {props.children}
      </a>
    );
  }

  return (
    <button
      className={`button button--${props.size || "default"} 
      button--${props.inverse ? "inverse" : "primary"}`}
      onClick={props.onClick}
      type={props.type || "button"}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;