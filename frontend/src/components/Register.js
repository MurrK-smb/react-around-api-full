import React from "react";
import AuthForm from "./AuthForm";

function Register({ handleRegisterSubmit }) {
  const [inputs, setInputs] = React.useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = inputs;
    handleRegisterSubmit(email, password);
  }

  return (
    <AuthForm
      title="Sign up"
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      inputs={inputs}
      text="Already have an account? "
      link="/signin"
      linkText="Log in here!"
    />
  );
}

export default Register;
