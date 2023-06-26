
//TTS
'speechSynthesis' in window ? console.log("Web Speech API supported!") : console.log("Web Speech API not supported :-(")
let speaker = new SpeechSynthesisUtterance();
let synth = window.speechSynthesis;
let goed=0;
let kans=0;

synth.cancel();

speaker.lang = "en-EN";
speaker.pitch = 1;
speaker.rate = 1;
speaker.volume = 1;
let listOfSentences = [];

const text_to_speech = (text) => {
    let items = 0;

    //  Create a 2D array
    let numberOfWords = Math.ceil(text.split(" ").length / 500);

    for (var i = 0; i < numberOfWords; i++) {
        listOfSentences[i] = [];
    }
    for (var x = 0; x < numberOfWords; x++) {
        for (var j = 0; j < 500; j++) {
            listOfSentences[x][j] = text.split(" ")[items++];
        }

        // This creates a que of
        speaker.text = listOfSentences[x].join(" ");
        synth.speak(speaker);
    }
};

$("#start").click(function(){
    $(this).addClass("d-none")
    $("#makePhoto").removeClass("d-none")
    text_to_speech("Upload please a pokemon image ")

})

const element = document.getElementById("imageResult");
function startImageScan() {
// Create a variable to initialize the ml5.js image classifier with MobileNet
    var classifier = ml5.imageClassifier('./model/model.json');
// Scan the uploaded image

//alternatief
//const featureExtractor = ml5.featureExtractor('MobileNet')
// classifier = featureExtractor.classification()
// classifier.load("./model.json") 
// console.log(classifier)


//alternatief


    classifier.classify(document.getElementById("uploadedImage"), imageScanResult);
// element.innerHTML = "...";
}

function imageScanResult(error, results) {
    if (error) {
        element.innerHTML = error;
    } else {
        kans+=1;
        $("#kans").html(kans)
        let num = results[0].confidence * 100;
        console.log(results)
//element.innerHTML = results[0].label + "Confidence: " + num.toFixed(0) + "%";

        element.innerHTML= results[0].label

        if (results[0].label=="Pikachu") {
            goed+=1;
            $("#success").html(goed)
            text_to_speech("Gotcha, This is Pikachu" )
        }
        else {
            // classifier= ml5.featureExtractor('MobileNet')//delete
            // classifier.classify(document.getElementById("uploadedImage"), imageScanResult);
            // alert(results[0].label)
            text_to_speech("This is not Pikachu  but "+ results[0].label+ ".    Try again please" )
        }
    }
}