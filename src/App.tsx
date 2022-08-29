import { Menu } from "antd";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";

import { routes, menus } from "./router";

function App() {
  return (
    <div className="container">
      <div className="sider">
        <Menu mode="inline">
          {menus.map((menu, index) => (
            <Menu.SubMenu key={index} title={menu.title}>
              {menu.children.map((child) => (
                <Menu.Item key={child.path}>
                  <Link to={child.path}>{child.label}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </div>
      <div className="content">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.element />} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
