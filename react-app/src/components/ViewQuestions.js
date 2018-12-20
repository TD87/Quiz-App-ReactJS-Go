import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class ViewQuestions extends Component{
    constructor(){
        super();
        this.state = {
            formData: {
                questionname: "",
            },
            data1: [],
            data2: [],
            id: "",
            genre: "M",
            quizid: "",
            submitted: false,
        }
        this.handleGChange = this.handleGChange.bind(this);
        this.handleQChange = this.handleQChange.bind(this);
        this.handleUChange = this.handleUChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
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
            .then(data => {
                this.setState({data2: data});
            });
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('http://localhost:8080/question/'+this.state.id, {
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
        fetch('http://localhost:8080/question/'+this.state.id, {
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

    handleUChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, questionname: event.target.value}
        }))
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">View Questions</h1>
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
                <form onSubmit={this.handleSubmit}>
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Question ID</th>
                                <th>Quiz ID</th>
                                <th>Question Name</th>
                                <th>Delete/Update?</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data2.map((item, key) => {
                            return(
                                <tr key = {key}>
                                    <td>{item.id}</td>
                                    <td>{item.quizid}</td>
                                    <td>{item.questionname}</td>
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

export default ViewQuestions;
