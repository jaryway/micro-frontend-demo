import { createActions } from "redux-actions";
import account from "./account";
import app from "./app";

const actions = createActions({ ACCOUNT: account, APP: app });

export default actions;
