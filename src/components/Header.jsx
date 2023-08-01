import { Link } from "react-router-dom";
import styled from "styled-components";
import { CgChevronLeft, CgLogOut, CgTwitter } from "react-icons/cg";

function Header({ canGoBack, canLogOut, showProfile }) {
  const url = localStorage.getItem("url") ?? "";
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <Container>
      <Left>
        {canGoBack ? (
          <TopBtn>
            <CgChevronLeft />
          </TopBtn>
        ) : null}
      </Left>
      <Link to="/">
        <Logo>
          <CgTwitter />
        </Logo>
      </Link>
      <Right>
        {canLogOut ? (
          <TopBtn onClick={logout}>
            <CgLogOut />
          </TopBtn>
        ) : null}
        {showProfile ? (
          <Profile>
            <ProfileImg src={url} />
          </Profile>
        ) : null}
      </Right>
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
  position: relative;
`;
const Left = styled.div`
  position: absolute;
  left: 14px;
`;
const TopBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  font-size: 20px;
  color: #636e72;
  cursor: pointer;
  &:hover {
    color: #74b9ff;
  }
`;
const Logo = styled.div`
  font-size: 30px;
  color: #74b9ff;
`;
const Right = styled.div`
  position: absolute;
  right: 14px;
  display: flex;
  gap: 8px;
`;
const Profile = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.cardColor};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileImg = styled.img`
  height: 100%;
`;

export default Header;
