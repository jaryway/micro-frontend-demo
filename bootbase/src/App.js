import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Menu, Icon, Spin, message, Button } from "antd";
import { dynamic, injectReducer } from "hsp-utils";
import { registerSubApps } from "./utils/singleSpaHelper";

// import actions from "@/_global/actions";
// import appReducer from "@/_global/reducers/app";
// import accountReducer from "@/_global/reducers/account";

const getCurrent = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "xiaoming", name: "xiaoming" });
    }, 1000);
  });
};

const { Header, Sider, Content } = Layout;
const menuList = [
  { key: "k1", icon: "home", title: "Home", link: "/" },
  { key: "k2", icon: "user", title: "User", link: "/user" },
  { key: "k3", icon: "message", title: "About", link: "/about" },
  {
    key: "k4",
    icon: "appstore",
    title: "Sub1App",
    link: "/sub1-app",
    children: [{ key: "k3-0", title: "/Sub1App/Home", link: "/sub1-app/home" }],
  },
  { key: "k5", icon: "shop", title: "Sub2App", link: "/sub2-app" },
  { key: "k6", icon: "shop", title: "HomeApp", link: "/homepage-app" },
];

const { SubMenu } = Menu;

function renderMenu(menus) {
  return menus.map((item) => {
    const { key, icon, title, link, children } = item;
    if (children && children.length) {
      return (
        <SubMenu
          key={key}
          title={
            <>
              <Icon type="mail" />
              <span>{title}</span>
            </>
          }
        >
          {renderMenu(children)}
        </SubMenu>
      );
    }

    return (
      <Menu.Item key={key} link={link}>
        {icon && <Icon type={icon} />}
        <span> {title} </span>
      </Menu.Item>
    );
  });
}

const User = dynamic(() => import("./User"));
const About = dynamic(() => import("./About"));

function getHomeUrl() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("/user");
    }, 1000);
  });
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState("");
  console.log("这是什么鬼啊");

  useEffect(() => {
    setLoading(true);
    getHomeUrl().then((path) => {
      setLoading(false);
      setPath(path);
    });
  }, []);

  if (loading) return <Spin />;

  if (path) return <Redirect to={path} />;

  return (
    <div>
      <h2>Hello,Home</h2>
    </div>
  );
}

// function SubApp() {
//   console.log("match-subapp");
//   return <div id="subapp"></div>;
// }

function App({
  loading,
  history,
  globalEventDistributor,

  ...rest
}) {
  const [collapsed, setCollapsed] = useState(false);
  // const [loading, setLoading] = useState(true);
  console.log("rest", rest);
  useEffect(() => {
    // setLoading(true);
    // getCurrent().then((currentUser) => {
    //   setLoading(false);
    //   registerSubApps(globalEventDistributor, () => {
    //     globalEventDistributor.dispatch({
    //       type: "CURRENT_EMP",
    //       payload: currentUser,
    //     });
    //     globalEventDistributor.dispatch({
    //       type: "APP_LOADING",
    //       payload: false,
    //     });
    //   });
    //   mountApp();
    // });
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const onMenuClick = useCallback((key, link) => {
    history.push(link);
    globalEventDistributor.dispatch({
      type: "CHANGE_ROOT_ACTIVE_MENU_KEY",
      payload: key,
    });
  }, []);

  if (loading)
    return (
      <div style={{ margin: "60px auto", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <Layout id="components-layout-demo-custom-trigger">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["k1"]}
          onClick={({ key, item }) => {
            // console.log('onMenuClick', key, item);
            onMenuClick(key, item.props["link"]);
          }}
        >
          {renderMenu(menuList)}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <Icon
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={toggle}
          />
          {/* <Button
            onClick={() => {
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(menuList);
                  globalEventDistributor.dispatch({
                    type: "ROOT_MENU_LIST",
                    payload: menuList,
                  });
                }, 1500);
              });
            }}
          >
            Click
          </Button> */}
        </Header>
        <Content
          id="subapp"
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "calc(100vh - 112px)",
            position:"relative"
          }}
        >
          <Switch>
            <Route path="/user" component={User} />
            <Route path="/about" component={About} />
            <Route
              path={"/*-app"}
              render={({ location }) => {
                console.log("sub-app", "命中子站点路由");

                // globalEventDistributor.dispatch({
                //   type: 'to',
                //   path: location.pathname,
                //   owner: 'base',
                // });
                // return <Spin spinning={} size='large' />;
                return <div />;
              }}
            />
            {/* <Route exact path="/" component={Home} /> */}
            <Route component={Home} />
            {/* <Route render={() => <div id='maincontent'></div>} /> */}
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}

// const withReducer = injectReducer([
//   { key: "account", reducer: accountReducer },
// ]);
const mapStateToProps = (state) => {
  console.log("base-app.state", state);
  return { loading: state._root.appLoading };
};
const mapDispatchToProps = {
  // getCurrent: actions.account.getCurrent,
  // setCurrentMenuKey: payload => ({ type: 'REGISTER_APP', payload }),
  // registerApp: (payload) => ({ type: "REGISTER_APP", payload }),
  // mountApp: () => ({ type: "MOUNT_APP" }),
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
