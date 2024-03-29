import styled from "styled-components";
import { callAPI } from "../utils/axios";
import { useSetRecoilState } from "recoil";
import { globalOverlayStatus } from "../utils/recoils";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function TweetCard({ id, text, createdAt, url, username, setRerender }) {
  const inputRef = useRef();
  const navigate = useNavigate();
  const myUsername = localStorage.getItem("username");

  const [updateMode, setUpdateMode] = useState(false);
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);

  const switchToUpdateMode = () => setUpdateMode(true);
  const endUpdateMode = () => setUpdateMode(false);

  const goToUserPage = () => {
    navigate(`/user/${username}`);
  };

  const deleteTweet = () => {
    callAPI
      .delete(`/tweet`, { data: { id } })
      .then((response) => {
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
        if (error.response?.status === 401) {
          return navigate("/login");
        }
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
        setUpdateMode(false);
        setRerender((prev) => prev + 1);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          return navigate("/login");
        }
        setGlobalOverlay({
          isOpen: true,
          title: "트윗 수정 실패",
          message: error.response.data.message,
        });
      });
  };

  return (
    <CardContainer>
      {myUsername === username ? (
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
        <Username onClick={goToUserPage}>@{username}</Username>
        {updateMode ? (
          <Textarea type="text" defaultValue={text} ref={inputRef} />
        ) : (
          text
        )}
        <CreatedAt>
          {`${new Date(createdAt).toLocaleDateString()} ${new Date(
            createdAt
          ).toLocaleTimeString()}`}
        </CreatedAt>
      </Message>
    </CardContainer>
  );
}

const CardContainer = styled.section`
  display: flex;
  gap: 16px;
  padding: 24px 14px;
  background-color: #fff;
  position: relative;
  border-bottom: solid 1px #ccc;
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
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileImg = styled.img`
  height: 100%;
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
