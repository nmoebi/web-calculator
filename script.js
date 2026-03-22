let number1 = "";
let number2 = "";
let operand = "";
let ans = "";
let solution;
let negated = false;

let directInputs = ["0","1","2","3","4","5","6","7","8","9","."]
let numericalOps = ["+","-","*","/"];

let calcText = document.querySelector(".calcText");
let inputMarker = document.querySelector(".inputMarker");
let numpad = document.querySelector(".numpad");
    numpad.addEventListener("click", (event)=> {
        let target = event.target;
        //changes target to the button when the span on top of the button is clicked
        if(target.tagName === "SPAN")
            target = target.closest("button");
        buttonAction(target);
    });

let buttonAction = function(button) {
    let btnID = button.id;
    
    if(directInputs.includes(btnID)) 
        inputValue(btnID);

    else if(numericalOps.includes(btnID))
        updateOperand(button.textContent);

    else switch(btnID) {
        case "neg": 
            negate();
            updateCalcText();
            break;

        case "del":
            deleteLast();
            break;

        case "ac":
            resetEquation();
            break;

        case "ans": 
            appendAns();
            break;

        case "=":
            solveEquation();
            break;
    }
}

//inputs digits and commas into the equation
//if there is no operator present the input gets apppended to number1   else it gets appended to number2
let inputValue = function(input) {
    if(operand === "") {
        if(input != "." || (input === "." && !number1.includes(".") && number1 != ""))
            number1 += input;
    }
    else {
        if(input != "." || (input === "." && !number2.includes(".") && number2 != ""))
            number2 += input;
    }
    updateCalcText();
}

let updateOperand = function(input) {
    //number1 = "0" is auto-added in case an operator is chosen before there is an numerical input
    if(number1 === "" && input != "-" && input != "+") {
        number1 = "0";
        operand = input;
    }
    else if(number1 === "" && input === "-")
        inputValue(input);

    else if(number1 === "" && input === "+")
        inputValue(input);
    
    else if (number1 != "+" && number1 != "-") 
        operand = input;

    updateCalcText();
}

//updates the equation on the calculator-screen
let updateCalcText = function() {

    setInputMarker();
    toggleInputMarker();

    if(number2 === "" && operand === "") {
        if(negated)
            calcText.textContent = `-(${number1}`
        else calcText.textContent = `${number1}`;
    }
    else {
        if(negated)
            calcText.textContent = `-(${number1} ${operand} ${number2}`
        else calcText.textContent = `${number1} ${operand} ${number2}`;
    }

    if(calcText.textContent.length > 23)
        calcText.textContent = ".." + calcText.textContent.slice(-24,-1);
} 

//delete the last input
let deleteLast = function() {
    if(number2 === "" && operand === "")
        number1 = number1.slice(0,-1);

    else if (number2 === "")
        operand = "";
    
    else number2 = number2.slice(0,-1);
    
    updateCalcText();
}

//resets all input-values and clears the text
let resetEquation = function() {
    number1 = "";
    number2 = "";
    operand = "";
    negated = false;
    updateCalcText();
}

//negates the expression - input marker fix needed here for negated values!
let negate = function() {
    negated = !negated;
    updateCalcText();
}

//calculates the solution of the equation on the screen
let solveEquation = function() {
    //removing negation for easier string evaluation
    let wasNegated = negated;;
    if(wasNegated) {
        negate();
    }

    if(operand === "" && number2 === "") {
        if(!(number1 === ans && !wasNegated)) {
            solution = +(number1);
            updateSolution(wasNegated);
        }
    }
    else {
        let rawEquation = `${number1} ${operand} ${number2}`;
    
        let equation = rawEquation.replace("×", "*").replace("÷","/").replace("-(","").replace(")","");

        let values = equation.split(" ");
        let op = values[1];
        let num1 = +values[0];
        let num2 = +values[2];


        switch(op) {
            case "+":
                solution = +(num1 + num2);
                break;
            
            case "-": 
                solution = +(num1 - num2);
                break;

            case "*":
                solution = +(num1 * num2);
                break;

            case "/":
                solution = +(num1 / num2);
                break;
        }
        updateSolution(wasNegated);
    }
}

//updates and resets values after solutions are calculated
let updateSolution = function(wasNegated) {
    if(wasNegated) {
        solution = -solution;
    }

    //rounds solution to 5 decimal places and removes tailing zeros
    //converts solution to String after
    solution = "" + parseFloat((solution).toFixed(5));

    //update content on screen
    resetEquation();
    ans = solution;
    number1 = solution;
    updateCalcText();
}

//appends last solution to equation
let appendAns = function() {
    if(ans>=0 || number1 === "")
        inputValue(ans);
    else {
        if(number2 === "" && operand === "") {
            updateOperand("-");
            number2 = -ans;
        }
        else if(number2 != "") {
            number2 -= ans;
        }
        updateCalcText();
    }
}

let setInputMarker = function() {
    if(negated) {
        inputMarker.textContent = "|)";
    }
    else inputMarker.textContent = "|";
}

//lets the input marker line fade in and out
let toggleInputMarker = function() {
    if(negated) {
        if(inputMarker.textContent === "|)") {
            inputMarker.style.marginRight = "12px";
            inputMarker.textContent = "  )";
            inputMarker.style.marginLeft = "18px";
        } 
        else {
            inputMarker.style.marginRight = "12px";
            inputMarker.style.marginLeft = "0px";
            inputMarker.textContent = "|)";
        }  
    }
    else {
        if(inputMarker.textContent === "") {
            inputMarker.style.marginRight = "12px";
            inputMarker.style.marginLeft = "0px";
            inputMarker.textContent = "|";
        } 
        else {
            inputMarker.style.marginRight = "30px";
            inputMarker.style.marginLeft = "0px";
            inputMarker.textContent = "";
        }  
    }   
}

//calls toggleInputMarker() every 600ms
let markerInterval = window.setInterval(toggleInputMarker, 600);

window.addEventListener("keydown", (event) => {
    let key = event.key;

    if(directInputs.includes(key)) 
        inputValue(key);

    else if(numericalOps.includes(key)) {
        if(key === "*")
            updateOperand("×");
        else updateOperand(key);
    }
    else if(key === ",")
        inputValue(".");

    else if (key === "Backspace")
        deleteLast();

    else if(key === "=" || key === "Enter") {
        event.preventDefault();
        solveEquation();
    }

    else if(key === "n")
        negate();
});