import { atom } from "recoil";

export const globalOverlayStatus = atom({
  key: "globalOverlayStatus",
  default: {
    isOpen: false,
    title: "",
    message: "",
    buttonClose: false,
  },
});
