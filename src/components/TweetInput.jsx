import styled from "styled-components";
import { useForm } from "react-hook-form";
import { globalOverlayStatus } from "../utils/recoils";
import { useSetRecoilState } from "recoil";
import { callAPI } from "../utils/axios";

function TweetInput({ setRerender }) {
  const { register, handleSubmit, reset } = useForm();
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);

  const onSubmit = ({ text }) => {
    callAPI
      .post("/tweet", { text })
      .then(({ status }) => {
        console.log(status);
        setRerender((prev) => prev + 1);
        reset();
      })
      .catch((error) => {
        console.error(error);
        setGlobalOverlay({
          isOpen: true,
          title: "트윗 업로드 오류",
          message: error.message,
        });
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        type="text"
        placeholder="오늘 하루는 어땠나요?"
        rows="4"
        {...register("text", { required: "빈 트윗은 업로드 할 수 없어요." })}
      />
      <SubmitBtn>트윗</SubmitBtn>
    </Form>
  );
}

const Form = styled.form`
  background-color: #fff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: solid 1px ${({ theme }) => theme.cardColor};
`;
const Textarea = styled.textarea`
  padding: 12px;
  border: solid 1px ${({ theme }) => theme.cardColor};
  border-radius: 8px;
  width: 100%;
  resize: none;
`;
const SubmitBtn = styled.button`
  margin-left: auto;
  padding: 8px 12px;
  background-color: #74b9ff;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;

export default TweetInput;
