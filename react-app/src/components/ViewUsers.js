import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

const AUTH0_DOMAIN = "tennant.auth0.com";

class ViewUsers extends Component{
    constructor(){
        super();
        this.state = {
            data: [],
            id: "",
            submitted: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch('https://' + AUTH0_DOMAIN + '/api/v2/users', {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("token"),
                'content-type': 'application/json',
            },
        })
        .then(response => response.json())
            .then(data => {
                this.setState({data: data});
            });
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('https://' + AUTH0_DOMAIN + '/api/v2/users/' + this.state.id, {
            method: "DELETE",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("token"),
                'content-type': 'application/json',
            },
        })
        .then(response => {
            if(response.status == 204)
                this.setState({submitted: "Successfully deleted"});
            else
                this.setState({submitted: "Failed to deleted"});
            window.location.reload();
        });
    }

    handleChange(event){
        event.persist();
        this.setState({id: event.target.value});
    }

    render(){
        return(
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">View Users</h1>
                </header>

                <form onSubmit={this.handleSubmit}>
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Nickname</th>
                                <th>Email ID</th>
                                <th>User ID</th>
                                <th>Delete?</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data.map((item, key) => {
                            return(
                                <tr key = {key}>
                                    <td>{item.name}</td>
                                    <td>{item.nickname}</td>
                                    <td>{item.email}</td>
                                    <td>{item.user_id}</td>
                                    <td><input type="radio" name="select" value={item.user_id} onChange={this.handleChange}/></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="form-group">
                        <button type="submit" className="btn btn-default">Delete</button>
                    </div>
                </form>
                <div>
                    <h2>{this.state.submitted}</h2>
                </div>
            </div>
        );
    }
}

export default ViewUsers;
