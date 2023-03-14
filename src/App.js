import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import GlobalOverlay from "./components/GlobalOverlay";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/reset.css";
import { lightTheme } from "./styles/theme";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/user/:userId",
      element: <User />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ]);

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalOverlay />
      <GlobalStyles />
      <Container>
        <RouterProvider router={router} />
      </Container>
    </ThemeProvider>
  );
}

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.bgColor};
    color: ${({ theme }) => theme.textColor};
  } 
  `;
const Container = styled.main`
  max-width: 600px;
  min-height: 100vh;
  background-color: #fff;
  margin: 0 auto;
  border-left: solid 1px ${({ theme }) => theme.cardColor};
  border-right: solid 1px ${({ theme }) => theme.cardColor};
`;

export default App;
