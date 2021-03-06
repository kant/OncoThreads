import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import studyAPI from "../../../studyAPI";
import RootStore from "../../RootStore";
import UndoRedoStore from "../../UndoRedoStore";
import UIStore from "../../UIStore";
import {Provider} from "mobx-react";

it('renders without crashing', () => {
    const uiStore = new UIStore();
    const rootStore = new RootStore(uiStore);
    const undoRedoStore = new UndoRedoStore(rootStore, uiStore);
    const studyapi = new studyAPI();
      const div = document.createElement('div');
    ReactDOM.render(<Provider rootStore={rootStore} uiStore={uiStore} undoRedoStore={undoRedoStore} studyapi={studyapi}><App
        studyapi={studyapi} parsed="false"
        firstload="false"/></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});
