import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import Header from "../components/Header";
import { callAPI } from "../utils/axios";
import { globalOverlayStatus } from "../utils/recoils";

function Login() {
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onLoginSubmit = (form) => {
    callAPI
      .post("/auth/login", form)
      .then(({ data }) => {
        callAPI.defaults.headers["Authorization"] = `Bearer ${data.token}`;
        return navigate("/");
      })
      .catch((error) => {
        console.error(error);
        if (error.message !== "canceled") {
          return setGlobalOverlay({
            isOpen: true,
            title: "로그인 실패",
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
        <Title>서비스를 이용하려면 로그인이 필요해요.</Title>
        <Form onSubmit={handleSubmit(onLoginSubmit)}>
          <Input
            type="text"
            placeholder="유저명..."
            {...register("username", { required: "유저명을 입력해주세요." })}
          />
          <Input
            type="password"
            placeholder="비밀번호..."
            {...register("password", { required: "비밀번호를 입력해주세요." })}
          />
          <LoginBtn>로그인</LoginBtn>
        </Form>
        <GoToSignUp>
          <span>아직 계정이 없나요?</span>
          <Link to="/signup">회원가입하기</Link>
        </GoToSignUp>
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
const LoginBtn = styled.button`
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
const GoToSignUp = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 14px;
  a {
    text-decoration: underline;
  }
`;

export default Login;
