import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class ViewHistory extends Component{
    constructor(){
        super();
        this.state = {
            data: [],
        }
    }

    componentDidMount(){
        var uname = JSON.parse(window.localStorage.getItem('profile')).name;
        fetch('http://localhost:8080/uhistory/' + uname, {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        .then(response => response.json())
            .then(data => {
                this.setState({data: data});
            });
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">View History</h1>
                </header>

                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Quiz Name</th>
                            <th>Genre</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>{this.state.data.map((item, key) => {
                        return(
                            <tr key = {key}>
                                <td>{item.quizname}</td>
                                <td>{item.genre}</td>
                                <td>{item.score}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ViewHistory;
