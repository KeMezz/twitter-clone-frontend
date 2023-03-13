import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import Header from "../components/Header";
import { callAPI } from "../utils/axios";
import { globalOverlayStatus } from "../utils/recoils";

function SignUp() {
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSignUpSubmit = (form) => {
    callAPI
      .post("/auth/signup", form)
      .then(({ data }) => {
        callAPI.defaults.headers["Authorization"] = `Bearer ${data.token}`;
        return navigate("/");
      })
      .catch((error) => {
        console.error(error);
        if (error.message !== "canceled") {
          return setGlobalOverlay({
            isOpen: true,
            title: "회원가입 실패",
            message: error.response.data.message ?? error.message,
            buttonClose: true,
          });
        }
      });
  };
  return (
    <>
      <Header />
      <Container>
        <Title>환영해요! 🎉</Title>
        <Form onSubmit={handleSubmit(onSignUpSubmit)}>
          <Input
            type="text"
            placeholder="유저명..."
            {...register("username", { required: "유저명을 입력하세요." })}
          />
          <Input
            type="password"
            placeholder="비밀번호..."
            {...register("password", { required: "비밀번호를 입력하세요." })}
          />
          <Input
            type="url"
            placeholder="프로필 이미지 URL... (선택)"
            {...register("url")}
          />
          <SignUpBtn>회원 등록</SignUpBtn>
        </Form>
      </Container>
    </>
  );
}

const Container = styled.section`
  padding: 24px;
`;
const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Input = styled.input`
  padding: 8px;
  border-radius: 8px;
  border: solid 2px #ccc;
`;
const SignUpBtn = styled.button`
  padding: 8px 12px;
  margin: 0 auto;
  margin-top: 12px;
  width: 100px;
  background-color: #74b9ff;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;

export default SignUp;
