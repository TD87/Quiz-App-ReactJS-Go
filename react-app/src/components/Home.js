import React, { Component } from 'react';
import './App.css';
import auth0 from 'auth0-js';

const AUTH0_CLIENT_ID = "2JxF2JS5F6n99xra2duonHYaQGLmcOO3";
const AUTH0_DOMAIN = "tennant.auth0.com";
const AUTH0_CALLBACK_URL = "http://localhost:3000";
const AUTH0_API_AUDIENCE = "golang-gin";

class Home extends Component{
    constructor(){
        super();
        this.authenticate = this.authenticate.bind(this);
    }

    authenticate(){
        this.WebAuth = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            scope: "openid profile",
            audience: AUTH0_API_AUDIENCE,
            responseType: "token id_token",
            redirectUri: AUTH0_CALLBACK_URL
        });
        this.WebAuth.authorize();
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to Quiz Portal</h1>
                </header>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
                            <p>Sign in or Register to get access </p>
                            <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">Log In</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
