import React, { Component } from 'react';
import './ViewAnything.css';
import './App.css';

class AttemptQuiz extends Component{
    constructor(){
        super();
        this.state = {
            data: [],
            cdata: [],
            selected: [],
            id: "",
            loading: true,
            score: "",
            powerup: false,
            startTime: (new Date()).getTime(),
            timeTrial: false,
        }
        this.handleCChange = this.handleCChange.bind(this);
        this.handleTChange = this.handleTChange.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.getChoices = this.getChoices.bind(this);
    }

    async componentDidMount(){
        await this.setState({id: JSON.parse(window.localStorage.getItem('quiz')).id});
        await this.getQuestions();
        var len = this.state.data.length;
        this.setState({cdata: new Array(len)});
        for(let i=0; i<len; i++)
            await this.getChoices(this.state.data[i].id, i);
        this.setState({loading:false});
    }

    async getQuestions(){
        let response = await fetch('http://localhost:8080/question/' + this.state.id, {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        let data = await response.json();
        this.setState({data: data});
    }

    async getChoices(qid, i){
        let response = await fetch('http://localhost:8080/choice/' + qid, {
            method: "GET",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
        })
        let data = await response.json();
        this.state.cdata[i]=data;
    }

    handleReturn(event){
        window.localStorage.removeItem('quiz');
        window.location.reload();
    }

    async handleSubmit(event){
        var len = this.state.data.length;
        var score = [0];
        var time = (new Date()).getTime() - this.state.startTime;

        for(var i=0; i<len; i++){
            var len2 = this.state.cdata[i].length;
            for(var j=0; j<len2; j++){
                if(this.state.cdata[i][j].correct == "Y" && this.state.selected.indexOf(this.state.cdata[i][j].id*1)==-1){
                    score[0]=score[0]-10;
                    break;
                }
                else if(this.state.cdata[i][j].correct == "N" && this.state.selected.indexOf(this.state.cdata[i][j].id*1)!=-1){
                    score[0]=score[0]-10;
                    break;
                }
            }
            score[0]=score[0]+10;
        }
        if(this.state.timeTrial && score[0]==this.state.data.length*10)
            score[0]=score[0]+Math.ceil(10000000/time);
        else if(this.state.timeTrial)
            score[0]=0;
        if(this.state.powerup)
            score[0]=score[0]+5;

        this.setState({score: "Your score is: "+score[0]});
        var uname = JSON.parse(window.localStorage.getItem('profile')).name;
        var quizname = JSON.parse(window.localStorage.getItem('quiz')).name;
        var genre = JSON.parse(window.localStorage.getItem('quiz')).genre;
        var obj = {uname: uname, quizname: quizname, genre: genre, score: score[0]};

        let response = await fetch('http://localhost:8080/history/', {
            method: 'POST',
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
            },
            body: JSON.stringify(obj),
        })
        // if(response.status >= 200 && response.status < 300)
        //     console.log("Successfully added");
        // else
        //     console.log("Failed to add");
    }

    handleCChange(event){
        if(event.target.checked)
            this.state.selected.push(event.target.value*1)
        else{
            var index = this.state.selected.indexOf(event.target.value*1);
            if(index > -1)
                this.state.selected.splice(index, 1)
        }
    }

    handleTChange(event){
        var obj = JSON.parse(event.target.name);
        if(event.target.value == obj.choicename)
            this.state.selected.push(obj.id*1)
        else{
            var index = this.state.selected.indexOf(obj.id*1);
            if(index > -1)
                this.state.selected.splice(index, 1)
        }
    }

    handleRemove(event){
        if(this.state.powerup)
            return;
        var num = Math.floor(Math.random() * 5);
        this.state.data.splice(num, 1);
        this.state.cdata.splice(num, 1);
        this.setState({powerup: true});
        this.forceUpdate();
    }

    handleTime(event){
        this.setState({timeTrial: true});
    }

    render(){
        if(!this.state.loading)
            return(
                <div className="App">
                    <header className="App-header">
                        <h1 className="App-title">Attempt Quiz</h1>
                    </header>

                    {this.state.data.map((item,key) => {
                        return(
                            <div key={key}>
                                {(() => {
                                    switch(item.questionname.startsWith("http://") || item.questionname.startsWith("https://")){
                                        case true: return(<img src={item.questionname} />)
                                        default: return(<h2>{item.questionname}</h2>);
                                }})()}
                                <form>
                                    <table className="table-hover">
                                        <tbody>{this.state.cdata[key].map((item, key2) => {
                                            if(this.state.cdata[key].length==1){
                                                return(
                                                    <tr key={key2}>
                                                        <td colSpan="2"><input type="text" className="form-control" name={JSON.stringify({choicename: item.choicename, id:item.id})} onChange={this.handleTChange}/></td>
                                                    </tr>
                                                );
                                            }
                                            else{
                                                return(
                                                    <tr key={key2}>
                                                        <td>{item.choicename}</td>
                                                        <td><input type="checkbox" name="choice" value={item.id} onClick={this.handleCChange}/></td>
                                                    </tr>
                                                );
                                            }
                                        })}
                                        </tbody>
                                    </table>
                                </form>
                                <br/>
                            </div>
                        )
                    })}

                    <div className="form-group">
                        <button onClick={this.handleSubmit} className="btn btn-default">Submit</button>
                        <button onClick={this.handleReturn} className="btn btn-default">Return</button>
                        <button onClick={this.handleRemove} className="btn btn-default">Remove a question</button>
                        <button onClick={this.handleTime} className="btn btn-default">Time Trial</button>
                    </div>
                    <div>
                        <h2>{this.state.score}</h2>
                    </div>
                </div>
            );
        else
            return(<p>loading</p>);
    }
}

export default AttemptQuiz;
