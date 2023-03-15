import styled from "styled-components";
import Header from "./Header";
import TweetCard from "./TweetCard";
import TweetInput from "./TweetInput";

const User = ({ setRerender, tweets, renderInput }) => {
  return (
    <>
      <Header canLogOut showProfile />
      {renderInput ? <TweetInput setRerender={setRerender} /> : null}
      <TweetsBoard>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} setRerender={setRerender} />
        ))}
      </TweetsBoard>
    </>
  );
};

const TweetsBoard = styled.section`
  display: flex;
  flex-direction: column;
`;

export default User;
