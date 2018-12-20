import React, { Component } from 'react';
import Home from './Home';
import LoginApp from './LoginApp';
import auth0 from 'auth0-js';

const AUTH0_CLIENT_ID = "2JxF2JS5F6n99xra2duonHYaQGLmcOO3";
const AUTH0_DOMAIN = "tennant.auth0.com";

class App extends Component {
    setLogin(){
        if(localStorage.getItem("id_token"))
            this.loggedIn = true;
        else
            this.loggedIn = false;
    }

    setTokens(){
        this.auth0 = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID
        });
        this.auth0.parseHash({hash: window.location.hash}, (error, token) => {
            if(!error && token != null && token.accessToken != null && token.idToken != null){
                localStorage.setItem("profile", JSON.stringify(token.idTokenPayload));
                localStorage.setItem("id_token", token.idToken);
                localStorage.setItem("access_token", token.accessToken);
                window.location.reload();
            }
        });
    }

    componentWillMount(){
        this.setTokens();
        this.setLogin();
    }

    render(){
        if(this.loggedIn)
            return <LoginApp />;
        else
            return <Home />;
    }
}

export default App;
