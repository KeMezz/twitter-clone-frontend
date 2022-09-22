import styled from "styled-components";
import TwitterImg from "../images/logo.png";

function Header() {
  return (
    <Container>
      <Logo src={TwitterImg} alt="트위터" />
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: solid 1px ${({ theme }) => theme.cardColor};
`;
const Logo = styled.img`
  width: 30px;
`;

export default Header;
