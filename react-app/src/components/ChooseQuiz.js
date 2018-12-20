import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class ChooseQuiz extends Component{
    constructor(){
        super();
        this.state = {
            data: [],
            id: "",
            genre: "M",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleGChange = this.handleGChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getQuizes = this.getQuizes.bind(this);
    }

    componentDidMount(){
        this.getQuizes();
    }

    getQuizes(){
        fetch('http://localhost:8080/quiz/' + this.state.genre, {
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

    handleSubmit(event){
        event.preventDefault();
        window.localStorage.setItem('quiz', this.state.id);
        window.location.reload();
    }

    handleChange(event){
        event.persist();
        this.setState({id: event.target.value});
    }

    async handleGChange(event){
        event.persist();
        await this.setState({genre: event.target.value});
        this.getQuizes();
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Quizes</h1>
                </header>

                <div className="form-group">
                    <label>Genre</label>
                    <select name="genre" onChange={this.handleGChange} className="form-control">
                        <option value="M">Movies</option>
                        <option value="G">Games</option>
                    </select>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Quiz Name</th>
                                <th>Choose Quiz</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data.map((item, key) => {
                            return(
                                <tr key = {key}>
                                    <td>{item.quizname}</td>
                                    <td><input type="radio" name="quiz" value={JSON.stringify({id: item.id, name: item.quizname, genre: this.state.genre})} onChange={this.handleChange}/></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default">Attempt Quiz</button>
                    </div>
                </form>
                <div>
                    <h2>{this.state.submitted}</h2>
                </div>
            </div>
        );
    }
}

export default ChooseQuiz;
