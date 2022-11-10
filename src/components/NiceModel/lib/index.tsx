/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentType,
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useReducer
} from "react";
import {
  NiceModalAction,
  NiceModalArgs,
  NiceModalHocProps,
  NiceModalStore
} from "./interface";
import { hide, remove, show, useModal } from "./modalMethods";
// 注册的modals
export const MODAL_REGISTRY: {
  [id: string]: {
    comp: FC<any>;
    props?: Record<string, unknown>;
  };
} = {};
// 已经挂载
const ALREADY_MOUNTED: Record<string, unknown> = {};
const initialState: NiceModalStore = {};
export const NiceModalContext = createContext<NiceModalStore>(initialState);
export const NiceModalIdContext = createContext<string | null>(null);
export let dispatch: Dispatch<NiceModalAction> = () => {
  throw new Error("没有传递dispatch, 请用NiceModal.Provider包括你的App");
};
export const register = <T extends FC<any>>(
  id: string,
  comp: T,
  props?: Partial<NiceModalArgs<T>>
): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id];
};
export const ModalDef = ({
  id,
  component
}: {
  id: string;
  component: FC<any>;
}) => {
  useEffect(() => {
    register(id, component);
    return () => {
      unregister(id);
    };
  }, [id, component]);
  return null;
};
export const reducer = (
  state: NiceModalStore = initialState,
  action: NiceModalAction
): NiceModalStore => {
  switch (action.type) {
    case "nice-modal/show": {
      const { modalId, args } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          visible: !!ALREADY_MOUNTED[modalId],
          delayVisible: !!ALREADY_MOUNTED[modalId]
        }
      };
    }
    case "nice-modal/hide": {
      const { modalId } = action.payload;
      if (!state[modalId]) return state;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          visible: false
        }
      };
    }
    case "nice-modal/remove": {
      const { modalId } = action.payload;
      const newState = { ...state };
      delete newState[modalId];
      return newState;
    }
    case "nice-modal/set-flags": {
      const { modalId, flags } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags
        }
      };
    }
    default:
      return state;
  }
};
const NiceModalPlaceholder = () => {
  const modals = useContext(NiceModalContext);
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id]);
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      console.warn(
        `No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`
      );
      return;
    }
  });
  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[id]
    }));

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} {...t.props} />
      ))}
    </>
  );
};
const InnerContextProvider = ({ children }) => {
  const arr = useReducer(reducer, initialState);
  const modals = arr[0];
  dispatch = arr[1];
  return (
    <NiceModalContext.Provider value={modals}>
      {children}
      <NiceModalPlaceholder />
    </NiceModalContext.Provider>
  );
};
const Provider = ({
  children,
  dispatch: givenDispatch,
  modals: givenModals
}: {
  children: ReactNode;
  dispatch?: Dispatch<NiceModalAction>;
  modals?: NiceModalStore;
}) => {
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider>{children}</InnerContextProvider>;
  }
  dispatch = givenDispatch;
  return (
    <NiceModalContext.Provider value={givenModals}>
      {children}
      <NiceModalPlaceholder />
    </NiceModalContext.Provider>
  );
};
const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  dispatch(setModalFlags(modalId, flags));
};
function setModalFlags(
  modalId: string,
  flags: Record<string, unknown>
): NiceModalAction {
  return {
    type: "nice-modal/set-flags",
    payload: {
      modalId,
      flags
    }
  };
}
export const create = <P extends {}>(
  Comp: ComponentType<P>
): FC<P & NiceModalHocProps> => {
  // eslint-disable-next-line react/display-name
  return ({ defaultVisible, keepMounted, id, ...props }) => {
    const { args, show } = useModal(id);
    const modals = useContext(NiceModalContext);
    const shouldMount = !!modals[id];

    useEffect(() => {
      if (defaultVisible) {
        show();
      }
      ALREADY_MOUNTED[id] = true;
      return () => {
        delete ALREADY_MOUNTED[id];
      };
    }, [id, show, defaultVisible]);

    useEffect(() => {
      if (keepMounted) setFlags(id, { keepMounted: true });
    }, [id, keepMounted]);
    const delayVisible = modals[id]?.delayVisible;
    useEffect(() => {
      if (delayVisible) show(args);
    }, [delayVisible, args, show]);
    if (!shouldMount) return null;
    return (
      <NiceModalIdContext.Provider value={id}>
        <Comp {...(props as P)} {...args} />
      </NiceModalIdContext.Provider>
    );
  };
};
const NiceModal = {
  Provider,
  ModalDef,
  NiceModalContext,
  create,
  register,
  show,
  hide,
  remove,
  useModal,
  reducer
};

export default NiceModal;
