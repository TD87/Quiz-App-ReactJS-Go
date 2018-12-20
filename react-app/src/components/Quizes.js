import React, { Component } from 'react';
import ChooseQuiz from './ChooseQuiz';
import AttemptQuiz from './AttemptQuiz';
import './ViewAnything.css';
import './App.css';

class Quizes extends Component{
    render(){
        if(window.localStorage.getItem('quiz'))
            return <AttemptQuiz />;
        else
            return <ChooseQuiz />;
    }
}

export default Quizes;
