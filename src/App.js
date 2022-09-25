import { useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import GlobalOverlay from "./components/GlobalOverlay";
import Header from "./components/Header";
import TweetCard from "./components/TweetCard";
import TweetInput from "./components/TweetInput";
import { useSetRecoilState } from "recoil";
import "./styles/reset.css";
import { lightTheme } from "./styles/theme";
import { callAPI } from "./utils/axios";
import { globalOverlayStatus } from "./utils/recoils";

function App() {
  const [tweets, setTweets] = useState([]);
  const [rerender, setRerender] = useState(0);
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);

  const getTweets = () => {
    callAPI
      .get("/tweets")
      .then(({ data }) => {
        console.log(data);
        setTweets(data);
      })
      .catch((error) => {
        console.log(error);
        setGlobalOverlay({
          isOpen: true,
          title: "트윗 불러오기 실패",
          message: error.message,
          buttonClose: true,
        });
      });
  };

  useEffect(() => {
    getTweets();
  }, [rerender]);

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalOverlay />
      <GlobalStyles />
      <Container>
        <Header />
        <TweetInput setRerender={setRerender} />
        <TweetsBoard>
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} {...tweet} setRerender={setRerender} />
          ))}
        </TweetsBoard>
      </Container>
    </ThemeProvider>
  );
}

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.bgColor};
    color: ${({ theme }) => theme.textColor};
  } 
  `;
const Container = styled.main`
  max-width: 600px;
  min-height: 100vh;
  background-color: #fff;
  margin: 0 auto;
  border-left: solid 1px ${({ theme }) => theme.cardColor};
  border-right: solid 1px ${({ theme }) => theme.cardColor};
`;
const TweetsBoard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 18px;
`;

export default App;
