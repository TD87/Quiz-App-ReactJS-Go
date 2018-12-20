import React, { Component } from 'react';
import './App.css';

class AddQuiz extends Component{
    constructor(){
        super();
        this.state = {
            formData: {
                genre: "M",
                quizname: "",
            },
            submitted: "",
        }
        this.handleGChange = this.handleGChange.bind(this);
        this.handleQChange = this.handleQChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost:8080/quiz/', {
            method: 'POST',
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
            body: JSON.stringify(this.state.formData),
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300)
                this.setState({submitted: "Successfully added"});
            else
                this.setState({submitted: "Failed to add"});
            window.location.reload();
        });
    }

    handleGChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, genre: event.target.value}
        }));
    }

    handleQChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, quizname: event.target.value}
        }));
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Add Quiz</h1>
                </header>
                <br/><br/>
                <div className="formContainer">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Genre</label>
                            <select name="genre" onChange={this.handleGChange} className="form-control">
                                <option value="M">Movies</option>
                                <option value="G">Games</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quiz Name</label>
                            <input type="text" className="form-control" onChange={this.handleQChange} required/>
                        </div>
                        <button type="submit" className="btn btn-default">Submit</button>
                    </form>
                </div>
                <div>
                    <h2>{this.state.submitted}</h2>
                </div>
            </div>
        );
    }
}

export default AddQuiz;
