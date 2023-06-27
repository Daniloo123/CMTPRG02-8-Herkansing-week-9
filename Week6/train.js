import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/diabetes.csv"
const trainingLabel = "Label"  
const ignored = ["Pregnant", "Pedigree", "Label"]  

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    // Shuffle the data randomly
    data.sort(() => (Math.random() - 0.5))
    // Split the data into train and test sets
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8))

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let json = decisionTree.toJSON()
    let json2 = decisionTree.stringify()
    console.log(json)
    console.log(json2)
  


    let visual = new VegaTree('#view', 2300, 1000, json)

    // maak een prediction met een sample uit de testdata
    let diabetes = testData[0]
    let diabetesPrediction = decisionTree.predict(diabetes)
    console.log(`Prediction for diabetes: ${diabetesPrediction}`)
    console.log("diabetes data:", diabetes);
    console.log("DecisionTree object:", decisionTree);


    // bereken de accuracy met behulp van alle test data
    let correctPredictions = 0
    for (let i = 0; i < testData.length; i++) {
        if (decisionTree.predict(testData[i]) == testData[i][trainingLabel]) {
            correctPredictions++
        }
    }
    let accuracy = correctPredictions / testData.length
    console.log(`Accuracy: ${accuracy}`)
    document.getElementById("accuracy").innerHTML = "Accuracy: % +accuracy";

    // Prediction checks
    if(diabetesPrediction === 0 && diabetes[trainingLabel] === 1) {
        console.log("predicted no diabetes🙂, but has diabetes!🙁")
    } else if(diabetesPrediction === 1 && diabetes[trainingLabel] === 0) {
        console.log("predicted diabetes 🙁, but no diabetes!🙂")
    }
}

loadData()