import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

//
// DATA
//
const csvFile = "./data/Obesity.csv";
const trainingLabel = "Label";
const ignored = ["ID", "age", "Gender", "Label", "BMI"];

var underweight_true = 0;
var normalWeight_true = 0;
var overweight_true = 0;
var obese_true = 0;
var underweight_false = 0;
var normalWeight_false = 0;
var overweight_false = 0;
var obese_false = 0;

//
// LOAD CSV DATA AS JSON
//

function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: results => trainModel(results.data)
  });
}

//
// MACHINE LEARNING - Decision Tree
//

function trainModel(data) {
  // Shuffle the data randomly
  data.sort(() => Math.random() - 0.5);
  // Split the data into train and test sets
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8));

  // Create the decision tree algorithm with max depth limit
  let decisionTree = new DecisionTree({
    ignoredAttributes: ignored,
    trainingSet: trainData,
    categoryAttr: trainingLabel,
    maxDepth: 3 // Set the maximum depth of the decision tree
  });

  // Draw the tree structure - DOM element, width, height, decision tree
  let json = decisionTree.toJSON();
  let visual = new VegaTree("#view", 2300, 1000, json);
  console.log(decisionTree.stringify());

  // Initialize confusion matrix
  const labels = ["Underweight", "Normal Weight", "Overweight", "Obese"];
  const confusionMatrix = labels.reduce((matrix, label) => {
    matrix[label] = { TP: 0, FP: 0, FN: 0, TN: 0 };
    return matrix;
  }, {});

  // Calculate accuracy and update confusion matrix
  for (let i = 0; i < testData.length; i++) {
    const withoutLabel = { ...testData[i] };
    delete withoutLabel.Label;

    const predictedLabel = decisionTree.predict(withoutLabel);
    const trueLabel = testData[i][trainingLabel];

    if (predictedLabel === trueLabel) {
      confusionMatrix[trueLabel].TP += 1;
      if (predictedLabel === "Underweight") {
        underweight_true += 1;
      } else if (predictedLabel === "Normal Weight") {
        normalWeight_true += 1;
      } else if (predictedLabel === "Overweight") {
        overweight_true += 1;
      } else if (predictedLabel === "Obese") {
        obese_true += 1;
      }
    } else {
      confusionMatrix[trueLabel].FN += 1;
      confusionMatrix[predictedLabel].FP += 1;
      if (predictedLabel === "Underweight") {
        underweight_false += 1;
      } else if (predictedLabel === "Normal Weight") {
        normalWeight_false += 1;
      } else if (predictedLabel === "Overweight") {
        overweight_false += 1;
      } else if (predictedLabel === "Obese") {
        obese_false += 1;
      }
    }
  }

  // Update HTML elements with confusion matrix values
  document.getElementById("underweight_true").textContent = underweight_true.toString();
  document.getElementById("normalWeight_true").textContent = normalWeight_true.toString();
  document.getElementById("overweight_true").textContent = overweight_true.toString();
  document.getElementById("obese_true").textContent = obese_true.toString();
  document.getElementById("underweight_false").textContent = underweight_false.toString();
  document.getElementById("normalWeight_false").textContent = normalWeight_false.toString();
  document.getElementById("overweight_false").textContent = overweight_false.toString();
  document.getElementById("obese_false").textContent = obese_false.toString();

  // Calculate accuracy
  const totalPredictions = labels.reduce(
    (sum, label) => sum + confusionMatrix[label].TP + confusionMatrix[label].FN,
    0
  );
  const truePredictions = labels.reduce(
    (sum, label) => sum + confusionMatrix[label].TP,
    0
  );
  const accuracy = (truePredictions / totalPredictions) * 100;
  console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
  document.getElementById("accuracy").textContent = `Accuracy: ${accuracy.toFixed(2)}%`;
}

loadData();
