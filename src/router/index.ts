import MiniRouter from "../components/Mini-router/index";
import Form from "../components/Form";
import DemoHook from "../hooks/demoHook";
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
    path: "/hooks/demo",
    element: DemoHook
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
      }
    ]
  },
  {
    title: "hooks",
    children: [
      {
        path: "/hooks/demo",
        label: "demoHook"
      }
    ]
  }
];
