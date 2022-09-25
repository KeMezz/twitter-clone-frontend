import styled from "styled-components";
import { callAPI } from "../utils/axios";
import { useSetRecoilState } from "recoil";
import { globalOverlayStatus } from "../utils/recoils";
import { useRef, useState } from "react";

function TweetCard({ id, text, createdAt, url, username, setRerender }) {
  const [updateMode, setUpdateMode] = useState(false);
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);
  const inputRef = useRef();

  const deleteTweet = async () => {
    callAPI
      .delete(`/tweets/${id}`)
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        setGlobalOverlay({
          status: true,
          title: "트윗 삭제 실패",
          message: error.message,
        });
      });
    setRerender((prev) => prev + 1);
  };

  const switchToUpdateMode = () => setUpdateMode(true);
  const endUpdateMode = () => setUpdateMode(false);

  const updateTweet = () => {
    callAPI
      .put(`/tweets/${id}`, { text: inputRef.current.value })
      .then((response) => {
        console.log(response);
        setUpdateMode(false);
        setRerender((prev) => prev + 1);
      })
      .catch((error) => {
        console.error(error);
        setGlobalOverlay({
          isOpen: true,
          title: "트윗 수정 실패",
          message: error.message,
        });
      });
  };

  return (
    <CardContainer>
      <Buttons>
        {updateMode ? (
          <>
            <Btn onClick={endUpdateMode}>취소</Btn>
            <Btn onClick={updateTweet}>수정 완료</Btn>
          </>
        ) : (
          <>
            <Btn color="blue" onClick={switchToUpdateMode}>
              수정
            </Btn>
            <Btn onClick={deleteTweet} color="crimson">
              삭제
            </Btn>
          </>
        )}
      </Buttons>
      <Profile>
        <ProfileImg src={url}></ProfileImg>
      </Profile>
      <Message>
        <Username>@{username}</Username>
        {updateMode ? (
          <input type="text" defaultValue={text} ref={inputRef} />
        ) : (
          text
        )}
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
`;
const Btn = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 12px;
  color: ${({ color }) => color};
`;
const Profile = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
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
  /* width: calc(100% - 60px); */
  line-height: 1.4;
  width: 80%;
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
