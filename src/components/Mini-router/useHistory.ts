import { useContext } from "react";
import { RouterContext } from "./Router";

export default function useHistory() {
  return useContext(RouterContext).history;
}
