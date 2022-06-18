import React from "react";
import AuthForm from "./AuthForm";

function Login({ handleLoginSubmit }) {
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
    handleLoginSubmit(email, password);
  }

  return (
    <AuthForm
      title="Log in"
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      inputs={inputs}
      text="Don't have an account? "
      link="/signup"
      linkText="Sign up here!"
    />
  );
}

export default Login;
