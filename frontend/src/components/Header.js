import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import around from "../images/around.svg";

function Header({ handleLogout, email }) {
  return (
    <header className="header">
      <img className="header__logo" src={around} alt="'Around The U.S.' logo" />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <div className="header__wrapper">
                <p className="header__email">{email}</p>
                <Link
                  className="header__link"
                  onClick={handleLogout}
                  to="/signin"
                >
                  Sign out
                </Link>
              </div>
            </>
          }
        />
        <Route
          path="/signin"
          element={
            <Link className="header__link" to="/signup">
              Sign up
            </Link>
          }
        />
        <Route
          path="/signup"
          element={
            <Link className="header__link" to="/signin">
              Sign in
            </Link>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
