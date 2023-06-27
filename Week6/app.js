import { DecisionTree } from "./libraries/decisiontree.js";

function loadSavedModel() {
  return fetch("./model.json")
    .then((response) => response.json())
    .then((model) => modelLoaded(model));
}

function modelLoaded(model) {
  let decisionTree = new DecisionTree(model);
  let glucoseInput = document.getElementById("glucose");
  let bmiInput = document.getElementById("bmi");
  let insulinInput = document.getElementById("insulin");
  let bloodpressureInput = document.getElementById("bloodpressure");
  let ageInput = document.getElementById("age");
  let skinthicknessInput = document.getElementById("skin_thickness");
  let predictButton = document.querySelector("#sbmt");
  let result = document.getElementById("result");

  predictButton.addEventListener("click", (event) => {
    event.preventDefault();

    let glucose = Number(glucoseInput.value);
    let bmi = Number(bmiInput.value);
    let insulin = Number(insulinInput.value);
    let bloodpressure = Number(bloodpressureInput.value);
    let age = Number(ageInput.value);
    let skinthickness = Number(skinthicknessInput.value);

    let sample = {
      Glucose: glucose,
      bmi: bmi,
      Insulin: insulin,
      bloodpressure: bloodpressure,
      Age: age,
      Skinthickness: skinthickness,
    };

    let prediction = decisionTree.predict(sample);
    result.textContent = `The prediction is ${prediction == 1 ? "diabetes" : "no diabetes"}.`;
  });
}

loadSavedModel();
