import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-green-500`}
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cg id='checker'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zm20 0h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E");
`;

const Form = styled.form`
  ${tw`flex flex-col items-center bg-white bg-opacity-80 rounded-lg p-12`}
`;

const Label = styled.label`
  ${tw`mb-2 text-gray-700 font-semibold`}
`;

const Input = styled.input`
  ${tw`my-4 py-2 px-4 w-full rounded-lg border-none bg-gray-100 shadow-inner`}
`;

const Button = styled.button`
  ${tw`mt-6 py-2 px-6 rounded-lg border-none bg-gradient-to-r from-green-500 to-green-700 text-black font-bold cursor-pointer shadow-md transition-all duration-300`}

  &:hover {
    ${tw`bg-gradient-to-r from-green-700 to-green-500 shadow-lg`}
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      window.location.replace("home");
    } catch (error) {
      // Handle login error
      console.error(error);
    }
  };

  return (
    <Container>
      <h1 className="text-4xl text-white mb-12">Login</h1>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;
