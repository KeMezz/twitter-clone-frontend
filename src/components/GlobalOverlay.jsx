import styled from "styled-components";
import { globalOverlayStatus } from "../utils/recoils";
import { useRecoilState } from "recoil";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

function GlobalOverlay() {
  const [globalOverlay, setGlobalOverlay] = useRecoilState(globalOverlayStatus);
  const { isOpen, title, message } = globalOverlay;

  useEffect(() => {
    document.activeElement.blur();
  }, [globalOverlay]);

  const closeOverlay = () => {
    setGlobalOverlay((prev) => {
      return { ...prev, isOpen: false };
    });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <Container>
            <ModalBox
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Title>{title}</Title>
              <Message>{message}</Message>
              <Buttons>
                <OverlayButton onClick={closeOverlay}>닫기</OverlayButton>
              </Buttons>
            </ModalBox>
          </Container>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </>
      ) : null}
    </AnimatePresence>
  );
}

const Container = styled(motion.section)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;
const ModalBox = styled(motion.div)`
  min-width: 300px;
  z-index: 100;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const Overlay = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 99;
`;
const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
const Message = styled.p`
  font-size: 14px;
`;
const Buttons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;
const OverlayButton = styled.button`
  background-color: ${({ theme }) => theme.accentColor};
  color: #fff;
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default GlobalOverlay;
