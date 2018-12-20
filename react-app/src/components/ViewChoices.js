import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class ViewChoices extends Component{
    constructor(){
        super();
        this.state = {
            formData: {
                choicename: "",
            },
            data1: [],
            data2: [],
            data3: [],
            genre: "M",
            quizid: "",
            questionid: "",
            id: "",
            submitted: false,
        }
        this.handleGChange = this.handleGChange.bind(this);
        this.handleQChange = this.handleQChange.bind(this);
        this.handleQNChange = this.handleQNChange.bind(this);
        this.handleUChange = this.handleUChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.getQuizes = this.getQuizes.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.getChoices = this.getChoices.bind(this);
    }

    async componentDidMount(){
        await this.getQuizes();
        this.forceUpdate();
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
                await this.setState({quizid: this.state.data1[0].id*1});
                this.getQuestions();
            });
    }

    getQuestions(){
        fetch('http://localhost:8080/question/' + this.state.quizid, {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        .then(response => response.json())
            .then(async data => {
                this.setState({data2: data});
                await this.setState({questionid: this.state.data2[0].id*1});
                this.getChoices();
            });
    }

    getChoices(){
        fetch('http://localhost:8080/choice/' + this.state.questionid, {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        .then(response => response.json())
            .then(data => this.setState({data3: data}));
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost:8080/choice/'+this.state.id, {
            method: 'DELETE',
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300)
                this.setState({submitted: "Successfully deleted"});
            window.location.reload();
        });
    }

    handleUpdate(event){
        event.preventDefault();
        fetch('http://localhost:8080/choice/'+this.state.id, {
            method: 'PUT',
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
            body: JSON.stringify(this.state.formData),
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300)
                this.setState({submitted: "Successfully updated"});
            else
                this.setState({submitted: "Failed to add"});
            window.location.reload();
        });
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

    async handleQChange(event){
        event.persist();
        await this.setState({quizid: event.target.value*1});
        this.getQuestions();
    }

    async handleQNChange(event){
        event.persist();
        await this.setState({questionid: event.target.value*1});
        this.getChoices();
    }

    handleUChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, choicename: event.target.value}
        }));
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">View Choices</h1>
                </header>

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
                <form onSubmit={this.handleSubmit}>
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Choice ID</th>
                                <th>Quiz ID</th>
                                <th>Question ID</th>
                                <th>Choice Name</th>
                                <th>Correct?</th>
                                <th>Delete/Update?</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data3.map((item, key) => {
                            return(
                                <tr key = {key}>
                                    <td>{item.id}</td>
                                    <td>{item.quizid}</td>
                                    <td>{item.questionid}</td>
                                    <td>{item.choicename}</td>
                                    <td>{item.correct}</td>
                                    <td><input type="radio" name="select" value={item.id} onChange={this.handleChange}/></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="form-group">
                        <label>Update Entry</label>
                        <input type="text" className="form-control" onChange={this.handleUChange}/>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default">Delete</button>
                        <button onClick={this.handleUpdate} className="btn btn-default">Update</button>
                    </div>
                </form>
                <div>
                    <h2>{this.state.submitted}</h2>
                </div>
            </div>
        );
    }
}

export default ViewChoices;
