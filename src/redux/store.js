import { createStore } from "redux";
import { combineReducer } from "./combineReducer";
import { persistStore } from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "persist-store",
    storage
};

const persistReducers = persistReducer(persistConfig,combineReducer);

const store = createStore( persistReducers);

export const persistedstore= persistStore(store) ;

export default store; 