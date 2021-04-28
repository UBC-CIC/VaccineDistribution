import {Grid} from "semantic-ui-react";
import './App.css';
import Login from "./components/Authentication/Login";
import {Hub} from "aws-amplify";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {updateLoginState} from "./actions/loginActions";


import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import AdminLayout from "layouts/Admin.js";


function App(props) {
    const {loginState, updateLoginState} = props;
    const [currentLoginState, updateCurrentLoginState] = useState(loginState);


    useEffect(() => {
        setAuthListener();
    }, []);


    useEffect(() => {
        updateCurrentLoginState(loginState);
    }, [loginState]);


    async function setAuthListener() {
        Hub.listen('auth', (data)=> {
            switch(data.payload.event) {
                case "signOut":
                    updateLoginState("signIn");
                    break;
                default:
                    break;
            }
        })
    }


    return (
      <Grid style={{width: "100vw", height: "100vh"}}>
        <Grid.Row style={{width: "100vw", height: "100vh"}}>
          <Grid.Column style={{width: "100vw", height: "100vh"}}>
              {
                  currentLoginState !== "signedIn" && (
                      /* Login component options:
                      *
                      * [logo: "custom", "none"]
                      * [type: "video", "image", "static"]
                      * [themeColor: "standard", "#012144" (color hex value in quotes) ]
                      *  Suggested alternative theme colors: #037dad, #5f8696, #495c4e, #4f2828, #ba8106, #965f94
                      * [animateTitle: true, false]
                      * [title: string]
                      * [darkMode (changes font/logo color): true, false]
                      * [disableSignUp: true, false]
                      * */
                      <Login logo={"custom"} type={"static"} themeColor={"standard"} animateTitle={true}
                             title={"Vaccine distribution"} darkMode={true}
                             disableSignUp={false}
                      />
                  )
              }
              {
                  currentLoginState === "signedIn" && (
                      <BrowserRouter>
                          <Switch>
                            <Route path="/admin" render={props => <AdminLayout {...props} />} />
                            {/*<Route path="/auth" render={props => <AuthLayout {...props} />} />*/}
                            <Redirect from="/" to="/admin/index" />
                        </Switch>
                </BrowserRouter>
                  )
              }
          </Grid.Column>
        </Grid.Row>
      </Grid>
  );
}

const mapStateToProps = (state) => {
    return {
        loginState: state.loginState.currentState,
    };
};

const mapDispatchToProps = {
    updateLoginState,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
