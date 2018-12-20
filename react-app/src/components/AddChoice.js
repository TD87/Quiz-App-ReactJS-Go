import React, { Component } from 'react';
import './App.css';

class AddChoice extends Component{
    constructor(){
        super();
        this.state = {
            formData: {
                quizid: "",
                questionid: "",
                choicename: "",
                correct: "N",
            },
            genre: "M",
            data1: [],
            data2: [],
            submitted: "",
        }
        this.handleGChange = this.handleGChange.bind(this);
        this.handleQChange = this.handleQChange.bind(this);
        this.handleQNChange = this.handleQNChange.bind(this);
        this.handleCChange = this.handleCChange.bind(this);
        this.handleCHChange = this.handleCHChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getQuizes = this.getQuizes.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
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
            .then(async data => {
                this.setState({data1: data});
                await this.setState(prevState => ({
                    formData: {...prevState.formData, quizid: this.state.data1[0].id*1}
                }));
                this.getQuestions();
            });
    }

    getQuestions(){
        fetch('http://localhost:8080/question/' + this.state.formData.quizid, {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        .then(response => response.json())
            .then(data => {
                this.setState({data2: data});
                this.setState(prevState => ({
                    formData: {...prevState.formData, questionid: this.state.data2[0].id*1}
                }));
            });
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost:8080/choice/', {
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

    async handleGChange(event){
        event.persist();
        await this.setState({genre: event.target.value});
        this.getQuizes();
    }

    async handleQChange(event){
        event.persist();
        await this.setState(prevState => ({
            formData: {...prevState.formData, quizid: event.target.value*1}
        }));
        this.getQuestions();
    }

    handleQNChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, questionid: event.target.value*1}
        }));
    }

    handleCHChange(event){
        if(event.target.checked)
            this.setState(prevState => ({
                formData: {...prevState.formData, correct: "Y"}
            }));
        else
            this.setState(prevState => ({
                formData: {...prevState.formData, correct: "N"}
            }));
    }

    handleCChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, choicename: event.target.value}
        }));
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Add Choice</h1>
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
                            <select name="quiz" onChange={this.handleQChange} className="form-control" required>
                                {this.state.data1.map((item, key)=>{
                                    return(
                                        <option value={item.id} key={key}>{item.quizname}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <select name="question" onChange={this.handleQNChange} className="form-control" required>
                                {this.state.data2.map((item, key)=>{
                                    return(
                                        <option value={item.id} key={key}>{item.questionname}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Choice Name</label>
                            <input type="text" className="form-control" onChange={this.handleCChange} required/>
                            <label>Correct?</label>
                            &nbsp; <input type="checkbox" name="correct" onClick={this.handleCHChange}/>
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

export default AddChoice;
