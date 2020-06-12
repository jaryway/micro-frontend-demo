import { createActions } from 'redux-actions';
import account from './account';
// import app from "./app";

const actions = createActions({ ACCOUNT: account });

export default actions;
