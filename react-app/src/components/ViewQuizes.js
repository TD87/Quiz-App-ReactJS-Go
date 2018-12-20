import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class ViewQuizes extends Component{
    constructor(){
        super();
        this.state = {
            formData: {
                quizname: "",
            },
            data: [],
            id: "",
            genre: "M",
            submitted: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleGChange = this.handleGChange.bind(this);
        this.handleUChange = this.handleUChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
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
        fetch('http://localhost:8080/quiz/'+this.state.id, {
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
        fetch('http://localhost:8080/quiz/'+this.state.id, {
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

    handleUChange(event){
        event.persist();
        this.setState(prevState => ({
            formData: {...prevState.formData, quizname: event.target.value}
        }))
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">View Quizes</h1>
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
                                <th>Quiz ID</th>
                                <th>Quiz Name</th>
                                <th>Delete/Update?</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data.map((item, key) => {
                            return(
                                <tr key = {key}>
                                    <td>{item.id}</td>
                                    <td>{item.quizname}</td>
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

export default ViewQuizes;
