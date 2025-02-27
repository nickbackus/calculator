import React, { Component } from 'react';

const BOOTSTRAP_STYLE_CLASSES = {
  CALCULATOR: "App col-10 col-sm-8 col-md-6 col-lg-4 bg-secondary rounded mx-auto shadow-lg my-5 p-4 text-nowrap",
  DISPLAY_WRAPPER: "row bg-dark text-light rounded mb-3",
  DISPLAY: "text-right col-12 px-2 py-1",
  BUTTON_ROW: "row my-1", 
  BUTTON: "border border-dark btn btn-dark w-100 rounded",
  BUTTON_WRAPPER: "col-3 my-1 btn-wrapper",
  NO_BUTTON: "col-3"
}
const BUTTONS = [
  ["clear", "", "", "add"],
  ["seven", "eight", "nine", "subtract"],
  ["four", "five", "six", "multiply"],
  ["one", "two", "three", "divide"],
  ["zero", "zero", "decimal", "equals"]];

const BUTTON_VALS = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  zero: "0",
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/" ,
  decimal: ".",
  equals: "=",
  clear: "AC"
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {data: "0", newAnswer:false};
    this.eventHandler = this.eventHandler.bind(this);
  }
  
  eventHandler(e){
    let input;
    
    switch(e.type){
      case "click":
        input = BUTTON_VALS[e.target.id];
        break;
      case "keydown":
        input = e.key;
    }
    
    if (/[\+\-\*\/\.\d]/.test(input)){
      //when to replace the existing data with the input instead of adding on e.g. when its 0 and they enter 5 it will just be 5 not 05
      if ((/^0$/.test(this.state.data) && /[\d\-]/.test(input)) || (this.state.newAnswer == true && /\d/.test(input)))
        this.setState({data: input});
      //else if input is not a decimal when the data is already ending with a decimal or has a decimal in the last number: add the input to the end of the data string
      else if (!(/\./.test(input) && /\.\d?$/.test(this.state.data)))
        this.setState({data: this.state.data + input});
    }
    //data clear
    else if (/AC/.test(input)){
      this.setState({data: "0"})
    }
    //backspace key is pressed
    else if (/Backspace/.test(input)){
      //if there is only 1 thing set the data to 0
      if (this.state.data.length == 1)
        this.setState({data: "0"});
      //otherwise just remove the last character from data
      else
        this.setState({data: this.state.data.substring(0, this.state.data.length-1)});
    }
    //equal sign is pressed
    else if (/=/.test(input)){
      this.setState({data: this.solveEquation(this.state.data), newAnswer:true});
    }
    
    if (this.state.newAnswer == true)
      this.setState({newAnswer: false})
  }
  
  solveEquation(equation){
    let solved, num1, num2, newNum = -1, indexOfOperation;
    //if the equation starts with a "-" sign you have to add a 0 infront to get the proper results
    if (/^\-/.test(equation))
      equation = "0" + equation
    //if there are more than one operators in a row remove all but the last one
    equation = equation.replace(/[\+\-\*\/]+([\+\-\*\/]{1})/, "$1");
    let values = equation.split(/[\+\-\*\/]/);
    let operations = equation.match(/[\+\-\*\/]/ig);
    let operators = [
      ["*", (a,b)=>{return a*b}],
      ["/", (a,b)=>{return a/b}],
      ["-", (a,b)=>{return a-b}],
      ["+", (a, b)=>{return a+b}]];
                     
    //iterates through the math functions in order or opperation of the operators list
    //checks to see if any of the current fuctions are left if so it computes them then loops
    //if not it goes onto the next function until there are no more left
    for (let i = 0; i < 4; ){
      indexOfOperation = operations.indexOf(operators[i][0]);
      if (indexOfOperation == -1){
        i++;
      }
      else {
        num1 = parseFloat(values[indexOfOperation]);
        num2 = parseFloat(values[indexOfOperation+1]);
        newNum = operators[i][1](num1, num2);
        values = [...values.slice(0, indexOfOperation), newNum, ...values.slice(indexOfOperation + 2)];
        operations = [...operations.slice(0, indexOfOperation), ...operations.slice(indexOfOperation + 1)];
      }
    }
    //the values array should just be containing a single item by now, being the result
    return values[0];
  }
  
  render(){
    return(
      <div className={BOOTSTRAP_STYLE_CLASSES["CALCULATOR"]}  tabIndex="0" onKeyDown={this.eventHandler}>
        <Display value={this.state.data} stuff={this.eventHandler}/>
        <Buttons onClick={this.eventHandler}/>
      </div>
    );
  }
}

class Display extends Component {
  render(){
    return(
    <div className={BOOTSTRAP_STYLE_CLASSES["DISPLAY_WRAPPER"]}>
      <div id="display" className={BOOTSTRAP_STYLE_CLASSES["DISPLAY"]}>
        {this.props.value}
      </div>
    </div>);
  }
}

class Button extends Component {
  render(){
    return <div className={BOOTSTRAP_STYLE_CLASSES["BUTTON_WRAPPER"]}><div id={this.props.id} className={BOOTSTRAP_STYLE_CLASSES["BUTTON"]} onClick={this.props.onClick}>{this.props.value}</div></div>;
  }
}


//dynamicaly renders button rows with buttons in them
class Buttons extends Component {
  createButtons(listOfButtons = BUTTONS, buttonValues = BUTTON_VALS) {
    
    let numColumns, numRows = listOfButtons.length;
    let row = [], rows = [];
    
    for (let i = 0; i < numRows; i++){
      numColumns = listOfButtons[i].length;
      for (let j = 0; j < numColumns; j++){
        if(listOfButtons[i][j])
        row.push(<Button id={listOfButtons[i][j]} value={BUTTON_VALS[listOfButtons[i][j]]} onClick={this.props.onClick}/>)
        else
        row.push(<div className={BOOTSTRAP_STYLE_CLASSES["NO_BUTTON"]} />)
      }
      rows.push(<div className={BOOTSTRAP_STYLE_CLASSES["BUTTON_ROW"]}>{row}</div>);
      row = [];
    }
    return rows;
  }
  
  render(){
    return <div id="buttons">{this.createButtons()}</div>
  }
}


export default App;
