import styled from "styled-components";
import { callAPI } from "../utils/axios";
import { useSetRecoilState } from "recoil";
import { globalOverlayStatus } from "../utils/recoils";
import { useRef, useState } from "react";

function TweetCard({
  id,
  userId,
  text,
  createdAt,
  url,
  username,
  setRerender,
}) {
  const inputRef = useRef();
  const myUserId = localStorage.getItem("userId");

  const [updateMode, setUpdateMode] = useState(false);
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);

  const switchToUpdateMode = () => setUpdateMode(true);
  const endUpdateMode = () => setUpdateMode(false);

  const deleteTweet = () => {
    callAPI
      .delete(`/tweet`, { data: { id } })
      .then((response) => {
        console.log(response);
        if (response.status === 204) {
          setRerender((prev) => prev + 1);
        } else {
          setGlobalOverlay({
            isOpen: true,
            title: response.status,
            message: response.statusText,
          });
        }
      })
      .catch((error) => {
        setGlobalOverlay({
          isOpen: true,
          title: "트윗 삭제 실패",
          message: error.response.data.message,
        });
      });
  };

  const updateTweet = () => {
    callAPI
      .put(`/tweet`, { id, text: inputRef.current.value })
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
          message: error.response.data.message,
        });
      });
  };

  return (
    <CardContainer>
      {myUserId === userId ? (
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
      ) : null}
      <Profile>
        <ProfileImg src={url}></ProfileImg>
      </Profile>
      <Message>
        <Username>@{username}</Username>
        {updateMode ? (
          <Textarea type="text" defaultValue={text} ref={inputRef} />
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
  background-color: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
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
  line-height: 1.4;
  width: 80%;
  gap: 10px;
`;
const Textarea = styled.textarea`
  resize: none;
  border-radius: 8px;
  padding: 8px;
  line-height: 1.4;
`;
const Username = styled.button`
  background-color: transparent;
  border: none;
  align-self: flex-start;
  padding: 0;
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
