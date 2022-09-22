import { useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Header from "./components/Header";
import TweetCard from "./components/TweetCard";
import TweetInput from "./components/TweetInput";
import "./styles/reset.css";
import { lightTheme } from "./styles/theme";

function App() {
  const [tweets, setTweets] = useState([]);

  const getTweets = async () => {
    const data = await (await fetch(`http://localhost:8080/tweets`)).json();
    console.log(data);
    setTweets(data);
  };

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <Container>
        <Header />
        <TweetInput />
        <TweetsBoard>
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} {...tweet} />
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
