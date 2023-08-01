import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import GlobalOverlay from "./components/GlobalOverlay";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/reset.css";
import { lightTheme } from "./styles/theme";
import Home from "./pages/Home";
import User from "./pages/User";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalOverlay />
      <GlobalStyles />
      <Container>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/:username" element={<User />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
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
