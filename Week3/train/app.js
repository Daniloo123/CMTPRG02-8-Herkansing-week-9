const video = document.getElementById('webcam')
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)
const options = { numLabels: 4 }
const label = document.getElementById("label")
let classifier

const Bulbasaur = document.querySelector("#Bulbasaur")
const Charmander = document.querySelector("#Charmander")
const Squirtle = document.querySelector("#Squirtle")
const Pikachu = document.querySelector("#Pikachu")


const trainbtn = document.querySelector("#train")
const savebtn = document.querySelector("#save")
const cnv= document.querySelector("#canvas")

const save_img= document.querySelector("#save_img")

Squirtle.addEventListener("click", () => addSquirtle())
Charmander.addEventListener("click", () => addCharmander())
Pikachu.addEventListener("click", () => addPikachu())
Bulbasaur.addEventListener("click", () => addBulbasaur())

trainbtn.addEventListener("click", () => train())
savebtn.addEventListener("click", ()=>save_model())

const canvasElement = document.getElementById('canvas');

const webcam = new Webcam(video, "user", canvasElement);
webcam.start()
    .then(result =>{
        console.log("webcam started");
    })
    .catch(err => {
        console.log(err);
    });


function modelLoaded(){
    console.log("The mobileNet model is loaded!")
    classifier = featureExtractor.classification(video, videoReady)

}

function videoReady(){

    console.log(classifier)
}

function addSquirtle(){
    classifier.addImage(video, "Squirtle", addedImage)
}

function addCharmander() {
    classifier.addImage(video, "Charmander", addedImage)
}

function addBulbasaur() {
    classifier.addImage(video, "Bulbasaur", addedImage)

}function addPikachu() {
    classifier.addImage(video, "Pikachu", addedImage)
}

function train(){
    console.log("start training...")
    classifier.train((lossValue) => {
        console.log(lossValue)
    })
}

function save_model(){
    classifier.save()
}

function startClassifying(){
    setInterval(()=>{
        classifier.classify(video, (err, result)=>{
            if(err) console.log(err)
            console.log(result)
            var num = result[0].confidence * 100;
            num= num.toFixed(0)

            lab= result[0].label

            label.innerHTML = result[0].label+": "+ num
        })
    }, 1000)
}

function startClassifying_foto(){

    classifier.classify(take_from_mobile, (err, result)=>{
        if(err) console.log(err)
        console.log(result)
        var num = result[0].confidence * 100;
        num= num.toFixed(0)

        lab= result[0].label

        label.innerHTML = result[0].label+": "+ num
    })

}

function addedImage(){
    console.log("added image to network")
}