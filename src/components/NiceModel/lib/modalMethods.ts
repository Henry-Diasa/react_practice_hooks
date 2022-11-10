// overload

import { FC, useCallback, useContext, useEffect } from "react";
import {
  dispatch,
  MODAL_REGISTRY,
  NiceModalContext,
  NiceModalIdContext,
  register
} from ".";
import {
  NiceModalArgs,
  NiceModalHandler,
  NiceModalCallbacks,
  NiceModalAction
} from "./interface";
let uidSeed = 0;
const symModalId = Symbol("NiceModalId");
const getUid = () => `_nice_modal_${uidSeed++}`;
const getModalId = (modal: string | FC<any>): string => {
  if (typeof modal === "string") return modal as string;
  if (!modal[symModalId]) {
    modal[symModalId] = getUid();
  }
  return modal[symModalId];
};
const modalCallbacks: NiceModalCallbacks = {};
const hideModalCallbacks: NiceModalCallbacks = {};
function showModal(
  modalId: string,
  args?: Record<string, unknown>
): NiceModalAction {
  return {
    type: "nice-modal/show",
    payload: {
      modalId,
      args
    }
  };
}
function hideModal(modalId: string): NiceModalAction {
  return {
    type: "nice-modal/hide",
    payload: {
      modalId
    }
  };
}
function removeModal(modalId: string): NiceModalAction {
  return {
    type: "nice-modal/remove",
    payload: {
      modalId
    }
  };
}
export function useModal(): NiceModalHandler;
export function useModal(
  modal: string,
  args?: Record<string, unknown>
): NiceModalHandler;
export function useModal<
  T extends FC<any>,
  ComponentProps extends NiceModalArgs<T>,
  PreparedProps extends Partial<ComponentProps> = {} | ComponentProps,
  RemainingProps = Omit<ComponentProps, keyof PreparedProps> &
    Partial<ComponentProps>
>(
  modal: T,
  args?: PreparedProps
): Omit<NiceModalHandler, "show"> & {
  show: Partial<RemainingProps> extends RemainingProps
    ? (args?: RemainingProps) => Promise<unknown>
    : (args: RemainingProps) => Promise<unknown>;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useModal(modal?: any, args?: any): any {
  const modals = useContext(NiceModalContext);
  const contextModalId = useContext(NiceModalIdContext);
  let modalId: string | null = null;
  const isUseComponent = modal && typeof modal !== "string";
  if (!modal) {
    modalId = contextModalId;
  } else {
    modalId = getModalId(modal);
  }
  if (!modalId) throw new Error("No modal id found in NiceModal.useModal.");
  const mid = modalId as string;

  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY[mid]) {
      register(mid, modal as React.FC, args);
    }
  }, [isUseComponent, mid, modal, args]);
  const modalInfo = modals[mid];
  const showCallback = useCallback(
    (args?: Record<string, unknown>) => show(mid, args),
    [mid]
  );
  const hideCallback = useCallback(() => hide(mid), [mid]);
  const removeCallback = useCallback(() => remove(mid), [mid]);
  const resolveCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.resolve(args);
      delete modalCallbacks[mid];
    },
    [mid]
  );
  const rejectCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.reject(args);
      delete modalCallbacks[mid];
    },
    [mid]
  );
  const resolveHide = useCallback(
    (args?: unknown) => {
      hideModalCallbacks[mid]?.resolve(args);
      delete hideModalCallbacks[mid];
    },
    [mid]
  );

  return {
    id: mid,
    args: modalInfo?.args,
    visible: !!modalInfo?.visible,
    keepMounted: !!modalInfo?.keepMounted,
    show: showCallback,
    hide: hideCallback,
    remove: removeCallback,
    resolve: resolveCallback,
    reject: rejectCallback,
    resolveHide
  };
}
export function show<T extends any>(
  modal: FC<any>,
  args?: NiceModalArgs<FC<any>>
): Promise<T>;

export function show<T extends any>(
  modal: string,
  args?: Record<string, unknown>
): Promise<T>;
export function show<T extends any, P extends any>(
  modal: string,
  args: P
): Promise<T>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function show(
  modal: FC<any> | string,
  args?: NiceModalArgs<FC<any>> | Record<string, unknown>
) {
  const modalId = getModalId(modal);
  if (typeof modal !== "string" && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as React.FC);
  }
  dispatch(showModal(modalId, args));
  if (!modalCallbacks[modalId]) {
    let theResolve!: (args?: unknown) => void;
    let theReject!: (args?: unknown) => void;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise
    };
  }
  return modalCallbacks[modalId].promise;
}

export function hide<T>(modal: string | FC<any>): Promise<T>;
export function hide(modal: string | FC<any>) {
  const modalId = getModalId(modal);
  dispatch(hideModal(modalId));
  delete modalCallbacks[modalId];
  if (!hideModalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void;
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise
    };
  }
  return hideModalCallbacks[modalId].promise;
}

export function remove(modalId: string): void {
  dispatch(removeModal(modalId));
  delete modalCallbacks[modalId];
  delete hideModalCallbacks[modalId];
}
