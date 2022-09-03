import MiniRouter from "../components/Mini-router/index";
import Form from "../components/Form";
import Modal from "../components/Modal";
import DemoUseLog from "../hooks/useLog/demo";
export const routes = [
  {
    path: "/components/mini-router",
    element: MiniRouter
  },
  {
    path: "/components/form",
    element: Form
  },
  {
    path: "/components/modal",
    element: Modal
  },
  {
    path: "/hooks/useLog",
    element: DemoUseLog
  }
];

export const menus = [
  {
    title: "组件类",
    children: [
      // {
      //   path: "/components/mini-router",
      //   label: "Mini-Router"
      // },
      {
        path: "/components/form",
        label: "Form"
      },
      {
        path: "/components/modal",
        label: "Modal"
      }
    ]
  },
  {
    title: "hooks",
    children: [
      {
        path: "/hooks/useLog",
        label: "useLog"
      }
    ]
  }
];
