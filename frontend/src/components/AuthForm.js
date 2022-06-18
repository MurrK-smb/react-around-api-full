import React from "react";
import { Link } from "react-router-dom";

function AuthForm({
  title,
  handleSubmit,
  handleChange,
  inputs,
  text,
  link,
  linkText,
}) {
  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <h3 className="auth-form__title">{title}</h3>
        <input
          type="text"
          name="email"
          id="email"
          className="auth-form__input"
          placeholder="Email"
          onChange={handleChange}
          value={inputs.email}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          className="auth-form__input"
          placeholder="Password"
          onChange={handleChange}
          value={inputs.password}
          required
        />
        <button className="auth-form__submit">{title}</button>
      </form>
      <p className="auth-form__text">
        {text}
        <Link className="auth-form__text_link" to={link}>
          {linkText}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;
