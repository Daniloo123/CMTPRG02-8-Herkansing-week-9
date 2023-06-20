import { DecisionTree } from "./libraries/decisiontree.js";

let form = document.querySelector('form');
let result = document.querySelector('#result');

// Load the saved model from JSON file
function loadSavedModel() {
  return fetch("./model2.json")
    .then((response) => response.json())
    .then((model) => new DecisionTree(model));
}

// Make prediction when the form is submitted
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get user input
  let age = document.querySelector('#age').value;
  let gender = document.querySelector('#gender').value;
  let height = document.querySelector('#height').value;
  let weight = document.querySelector('#weight').value;


  // Load the saved model and make prediction
  loadSavedModel().then((decisionTree) => {
    let sample = { "Age": age, "Gender": gender, "Height": height, "Weight": weight };
    let prediction = decisionTree.predict(sample);
    result.textContent = `The predicted obesity level is ${prediction}.`;
  });
});
