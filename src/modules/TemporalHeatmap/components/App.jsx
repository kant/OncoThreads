/**
 * Created by theresa on 30.01.18.
 */
import React from "react";
import {observer} from 'mobx-react';
import {Navbar,Nav} from 'react-bootstrap';

import GetStudy from "./GetStudy";
import Content from "./Content"
import DefaultView from "./DefaultView"
import RootStore from "../../RootStore";

const App = observer(class App extends React.Component {
    constructor(props){
        super();
        this.rootStore=new RootStore(props.cbioAPI,"",true);
        this.setRootStore=this.setRootStore.bind(this);
    }
    setRootStore(study,firstLoad){
        this.rootStore.constructor(this.props.cbioAPI,study,firstLoad);
        this.rootStore.parseCBio();
    }
    getNavbarContent() {
        if (this.rootStore.parsed) {
            return (
                <GetStudy setRoot={this.setRootStore} cbioAPI={this.props.cbioAPI} studies={this.props.studyapi.studies}/>
            )
        }
        else {
            return null;
        }
    }

    getMainContent() {
        if (this.rootStore.parsed) {
            return (
                <Content rootStore={this.rootStore}/>
            )
        }
        else {
            if (this.rootStore.firstLoad) {
                return (
                    <DefaultView setRoot={this.setRootStore} cbioAPI={this.props.cbioAPI}
                                 studies={this.props.studyapi.studies}/>
                )
            }
            else {
                return (
                    <h1 className="defaultView">Loading study...</h1>
                )
            }
        }
    }

    render() {
        this.props.studyapi.getStudies();
        return (
            <div><Navbar style={{margin:0}}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a>Onco Threads</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Nav>
                {this.getNavbarContent()}
                </Nav>
            </Navbar>
                {this.getMainContent()}
            </div>
        )
    }
});

export default App;
