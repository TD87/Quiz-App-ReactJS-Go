import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class AdminPanel extends Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <ul className="nav navbar-nav">
                        <li><Link to={'/AddQuiz'}>Add Quiz</Link></li>
                        <li><Link to={'/ViewQuizes'}>View Quizes</Link></li>
                        <li><Link to={'/AddQuestion'}>Add Question</Link></li>
                        <li><Link to={'/ViewQuestions'}>View Questions</Link></li>
                        <li><Link to={'/AddChoice'}>Add Choice</Link></li>
                        <li><Link to={'/ViewChoices'}>View Choices</Link></li>
                        <li><Link to={'/ViewUsers'}>View Users</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default AdminPanel;
