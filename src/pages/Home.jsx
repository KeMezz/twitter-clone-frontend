import { useEffect } from "react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { callAPI } from "../utils/axios";
import { globalOverlayStatus } from "../utils/recoils";
import TweetsContainer from "../components/TweetContainer";
import { useNavigate } from "react-router-dom";
import { socketIO } from "../connection/socket";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [rerender, setRerender] = useState(0);
  const setGlobalOverlay = useSetRecoilState(globalOverlayStatus);
  const navigate = useNavigate();

  socketIO.on("tweetUpdated", () => {
    setRerender((prev) => prev + 1);
  });

  useEffect(() => {
    const controller = new AbortController();
    callAPI
      .get("/tweet", { signal: controller.signal })
      .then(({ data }) => {
        console.log(data);
        setTweets(data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 401) {
          return navigate("/login");
        }
        if (error.message !== "canceled") {
          return setGlobalOverlay({
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
  }, [setGlobalOverlay, rerender, navigate]);

  return (
    <TweetsContainer setRerender={setRerender} tweets={tweets} renderInput />
  );
};

export default Home;
