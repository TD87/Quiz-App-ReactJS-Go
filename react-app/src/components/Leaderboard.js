import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class Leaderboard extends Component{
    constructor(){
        super();
        this.state = {
            data: [],
            genre: "",
        }
        this.handleGChange = this.handleGChange.bind(this);
        this.getLeaderboard = this.getLeaderboard.bind(this);
    }

    componentDidMount(){
        this.getLeaderboard();
    }

    getLeaderboard(){
        fetch('http://localhost:8080/history/' + this.state.genre, {
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

    async handleGChange(event){
        event.persist();
        await this.setState({genre: event.target.value});
        this.getLeaderboard();
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Leaderboard</h1>
                </header>

                <div className="form-group">
                    <label>Genre</label>
                    <select name="genre" onChange={this.handleGChange} className="form-control">
                        <option value="">All Genres</option>
                        <option value="M">Movies</option>
                        <option value="G">Games</option>
                    </select>
                </div>
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Quiz Name</th>
                            <th>Genre</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>{this.state.data.map((item, key) => {
                        return(
                            <tr key = {key}>
                                <td>{item.uname}</td>
                                <td>{item.quizname}</td>
                                <td>{item.genre}</td>
                                <td>{item.score}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div>
                    <h2>{this.state.submitted}</h2>
                </div>
            </div>
        );
    }
}

export default Leaderboard;
