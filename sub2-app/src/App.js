import "./App.css";
import React from "react";
import { Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Table, Card } from "antd";
// import Loadable from 'react-loadable';
import { dynamic, injectReducer } from "hsp-utils";

// import injectReducer from './utils/injectReducer';
const Home = dynamic(() => import("./Home"));
// import About from './About';

// const About = Loadable({
//   loader: () => import('./About'),
//   loading: () => <div></div>,
// });

const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
];

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
  },
];

function App({ name = "", updateUserName = () => {}, ...props }) {
  // console.log('props', name);
  return (
    <Card bordered={false}>
      sub2-app
      <ul>
        <li>
          <Link to="/sub1-app/home">Home</Link>
        </li>
      </ul>
      <p>{name}</p>
      <div style={{ marginBottom: 8, paddingBottom: 8 }}>
        <Button
          type="primary"
          onClick={() => {
            updateUserName(Math.random().toString(16).substring(2));
          }}
        >
          Click
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />
      <Route path="/sub2-app/home" component={Home} />
    </Card>
  );
}

const withReducer = injectReducer({
  key: "app",
  reducer: (state = { name: "xiaoming" }, action) => {
    const { type, payload } = action;
    switch (type) {
      case "APP.UPDATE_NAME":
        return { ...state, name: payload };
      default:
        return state;
    }
  },
});
const mapStateToProps = (state) => {
  return state.app || {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateUserName: (value) =>
      dispatch({ type: "APP.UPDATE_NAME", payload: value }),
  };
};

export default withReducer(connect(mapStateToProps, mapDispatchToProps)(App));
