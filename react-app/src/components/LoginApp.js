import React, { Component } from 'react';
import AdminPanel from './AdminPanel';
import AddQuiz from './AddQuiz';
import ViewHistory from './ViewHistory';
import Leaderboard from './Leaderboard';
import ViewQuizes from './ViewQuizes';
import AddQuestion from './AddQuestion';
import ViewQuestions from './ViewQuestions';
import AddChoice from './AddChoice';
import ViewChoices from './ViewChoices';
import Quizes from './Quizes';
import ViewUsers from './ViewUsers';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const AUTH0_CLIENT_ID = "9fMxZOTJbmCaqDWINioygvSqFRWnHmYz";
const AUTH0_CLIENT_SECRET = "-r4_JHURa2PO-Zr2s0R5_46XrSa2GOGBEkRIpsoyzAeOTgho5rlUBI5bJayP8vKS";
const AUTH0_DOMAIN = "tennant.auth0.com";
const AUTH0_GRANT_TYPE = "client_credentials"

class LoginApp extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.admin = this.admin.bind(this);
    }

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("profile");
        localStorage.removeItem("quiz");
        localStorage.removeItem("token");
        window.location.replace("http://localhost:3000/");
    }

    admin() {
        var uname = JSON.parse(window.localStorage.getItem('profile')).name;
        fetch('http://localhost:8080/admin/',{
            method: "POST",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
            body: JSON.stringify(uname)
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300)
                fetch('https://' + AUTH0_DOMAIN + '/oauth/token', {
                    method: "POST",
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify({
                        grant_type: AUTH0_GRANT_TYPE,
                        client_id: AUTH0_CLIENT_ID,
                        client_secret: AUTH0_CLIENT_SECRET,
                        audience: "https://tennant.auth0.com/api/v2/"
                    })
                })
                .then(response => response.json())
                    .then(data => {
                        window.localStorage.setItem('token', data.access_token);
                        window.location.reload();
                    });
        })
    }

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <nav className="navbar navbar-default">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <Link className="navbar-brand" to={'/Quizes'}>React App</Link>
                                </div>
                                <ul className="nav navbar-nav">
                                    <li><Link to={'/Quizes'}>Quizes</Link></li>
                                    <li><Link to={'/ViewHistory'}>View History</Link></li>
                                    <li><Link to={'/Leaderboard'}>Leaderboard</Link></li>
                                    <li><a onClick={this.admin}>Get Admin Panel</a></li>
                                    <li><a onClick={this.logout}>Logout</a></li>
                                </ul>
                            </div>
                        </nav>
                        {(() => {
                            switch(window.localStorage.getItem('token')){
                                case null: break;
                                default: return <AdminPanel />;
                            }
                        })()}

                        <Switch>
                            <Route exact path='/Quizes' component={Quizes} />
                            <Route exact path='/ViewHistory' component={ViewHistory} />
                            <Route exact path='/Leaderboard' component={Leaderboard} />
                            <Route exact path='/AddQuiz' component={AddQuiz} />
                            <Route exact path='/ViewQuizes' component={ViewQuizes} />
                            <Route exact path='/AddQuestion' component={AddQuestion} />
                            <Route exact path='/ViewQuestions' component={ViewQuestions} />
                            <Route exact path='/AddChoice' component={AddChoice} />
                            <Route exact path='/ViewChoices' component={ViewChoices} />
                            <Route exact path='/ViewUsers' component={ViewUsers} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default LoginApp;
