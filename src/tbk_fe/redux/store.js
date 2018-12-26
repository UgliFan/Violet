import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '&/redux/reducers';

const finalCreateStore = applyMiddleware(thunk)(createStore);
//从window对象中获取redux谷歌浏览器插件对象如果存在就使用
const store = finalCreateStore(
    reducer, typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;