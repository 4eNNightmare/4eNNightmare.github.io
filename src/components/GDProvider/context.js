import { createContext } from "react";

export const defaultValue = {
  theme: {
    primary: "rgba(100, 0, 150, 0.8)"
  }
};
const GDContext = createContext(defaultValue);
export default GDContext;
