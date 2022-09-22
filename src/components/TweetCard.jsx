import styled from "styled-components";

function TweetCard({ id, text, createdAt, url, username }) {
  return (
    <CardContainer>
      <Buttons>
        <button>수정</button>
        <button>삭제</button>
      </Buttons>
      <Profile>
        <ProfileImg src={url} alt={username}></ProfileImg>
      </Profile>
      <Message>
        <Username>@{username}</Username>
        {text}
        <CreatedAt>
          {new Date(createdAt).toLocaleDateString()}에 작성됨.
        </CreatedAt>
      </Message>
    </CardContainer>
  );
}

const CardContainer = styled.section`
  display: flex;
  gap: 16px;
  padding: 12px;
  background-color: ${({ theme }) => theme.bgColor};
  border-radius: 12px;
  position: relative;
`;
const Buttons = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  right: 12px;
  button {
    cursor: pointer;
  }
`;
const Profile = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: ${({ theme }) => theme.cardColor};
  overflow: hidden;
`;
const ProfileImg = styled.img`
  width: 100%;
`;
const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;
const Username = styled.p`
  color: ${({ theme }) => theme.cardColor};
  font-size: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const CreatedAt = styled.p`
  color: ${({ theme }) => theme.cardColor};
  font-size: 8px;
`;

export default TweetCard;
