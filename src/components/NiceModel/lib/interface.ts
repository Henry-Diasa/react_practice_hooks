export interface NiceModalAction {
  type: string;
  payload: {
    modalId: string;
    args?: Record<string, unknown>;
    flags?: Record<string, unknown>;
  };
}
export interface NiceModalState {
  id: string;
  args?: Record<string, unknown>;
  visible?: boolean;
  delayVisible?: boolean;
  keepMounted?: boolean;
}
export interface NiceModalStore {
  [key: string]: NiceModalState;
}
export interface NiceModalHocProps {
  id: string;
  defaultVisible?: boolean;
  keepMounted?: boolean;
}
/** omit id and partial all required props */
export type NiceModalArgs<T> = T extends
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>
  ? Omit<React.ComponentProps<T>, "id">
  : Record<string, unknown>;

export interface NiceModalHandler<Props = Record<string, unknown>>
  extends NiceModalState {
  // Whether a modal is visible
  visible: boolean;
  // If you don't want to remove the modal from the tree after hide when using helpers, set it to true.
  keepMounted: boolean;
  show: (args?: Props) => Promise<unknown>;
  hide: () => Promise<unknown>;
  resolve: (args?: unknown) => void;
  reject: (args?: unknown) => void;
  remove: () => void;
  resolveHide: (args?: unknown) => void;
}

export interface NiceModalCallbacks {
  [modalId: string]: {
    resolve: (args: unknown) => void;
    reject: (args: unknown) => void;
    promise: Promise<unknown>;
  };
}
