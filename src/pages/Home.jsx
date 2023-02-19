import { useEffect } from "react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { callAPI } from "../utils/axios";
import { globalOverlayStatus } from "../utils/recoils";
import TweetsContainer from "../components/TweetContainer";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [rerender, setRerender] = useState(0);
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);

  useEffect(() => {
    const controller = new AbortController();
    callAPI
      .get("/tweets", { signal: controller.signal })
      .then(({ data }) => {
        console.log(data);
        setTweets(data);
      })
      .catch((error) => {
        console.log(error);
        if (error.message !== "canceled") {
          setGlobalOverlay({
            isOpen: true,
            title: "트윗 불러오기 실패",
            message: error.message,
            buttonClose: true,
          });
        }
      });
    return () => {
      controller.abort();
    };
  }, [setGlobalOverlay, rerender]);

  return (
    <TweetsContainer setRerender={setRerender} tweets={tweets} renderInput />
  );
};

export default Home;
