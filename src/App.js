import styled from "styled-components";
import NavBar from "./components/NavBar";
import "./styles/reset.css";

function App() {
  return (
    <Container>
      <NavBar />
    </Container>
  );
}

const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  background-color: #333;
  color: #fff;
`;

export default App;
