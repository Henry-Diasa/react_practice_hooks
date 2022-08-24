import { AttributifyAttributes } from "windicss/types/jsx";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface HTMLAttributes extends AttributifyAttributes {}
}
