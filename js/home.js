import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import { getFirestore, collection, updateDoc, getDocs, doc, where, query, orderBy, limit} from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


const firebaseConfig = {
    apiKey: "AIzaSyC0gRErKQkmUxLFn5VQ2q1vOUJMmUcNtWo",
    authDomain: "ezvocab-41e7c.firebaseapp.com",
    projectId: "ezvocab-41e7c",
    storageBucket: "ezvocab-41e7c.appspot.com",
    messagingSenderId: "214984158640",
    appId: "1:214984158640:web:432f169edd20fff1693a75",
    measurementId: "G-2E8T3GB90Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LcUWmUqAAAAALCbHPlSdUd19qqUyudy9VDSkTuJ"), // Replace with your site key
    isTokenAutoRefreshEnabled: true, // Optional: Auto-refresh App Check tokens
  });

console.log("Firebase initialized successful");
console.log('yessir')
const helloWorldURL = 'https://helloworld-z2tqawaq2q-uc.a.run.app';

document.addEventListener('DOMContentLoaded', function() {
    
    fetch(helloWorldURL)
        .then(response => response.text()) // Assuming it's text-based output
        .then(data => {
            console.log(data); // Expected output: "Hello from Firebase!"
        })
        .catch(error => {
            console.error('Error calling Firebase function:', error);
        });


    document.getElementById('hamburger-menu').addEventListener('click', function() {
        var menu = document.getElementById('drop-down-menu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block'; // Show the menu
        } else {
            menu.style.display = 'none'; // Hide the menu
        }
    });
    function checkScreenWidth() {
        const menu = document.getElementById('drop-down-menu');
        if (window.innerWidth > 672) {
            menu.style.display = 'none';
        } 
    }
    const hmo = [...document.querySelectorAll('.drop-down-menu-tab')]
    console.log(hmo);
    hmo.forEach(div=>{
        div.addEventListener('click', function(){
            console.log('hmo clicked.')
            document.getElementById('drop-down-menu').style.display = 'none';
        })
    })
    // Check on page load
    checkScreenWidth();

    // Check on window resize
    window.addEventListener('resize', checkScreenWidth);

    onAuthStateChanged(auth, async (user) => {
        const loginButton = [...document.querySelectorAll('.login-button')];
        if (user) {
            loginButton.forEach(btn=>{
                btn.addEventListener('click',function(){
                    window.location.href='dashboard.html';
                })
            })
          
        } 
        else{
            loginButton.forEach(btn=>{
                btn.addEventListener('click',function(){
                    window.location.href='login.html';
                })
            })
        }
      });
});
var leftArmIdle = anime({
    targets: '#character-left-arm',
    translateY: 4,
    rotateZ: -3,
    easing: 'linear',
    direction: 'alternate',
    loop:true,
    autoplay: false
});
var rightArmIdle = anime({
    targets: '#character-right-arm',
    translateY: 4,
    rotateZ: 3,
    easing: 'linear',
    direction: 'alternate',
    loop:true,
    autoplay: false
});
var headIdle = anime({
    targets: '.head-container',
    translateY: 5,
    easing: 'linear',
    direction: 'alternate',
    loop:true,
    autoplay: false
});
var bodyIdle = anime({
    targets: '.character-body',
    translateY: 3,
    easing: 'linear',
    direction: 'alternate',
    loop:true,
    autoplay: false
});

var blinkLeftEye = anime({
    targets: '#character-left-eye',
    rotateX: 100,
    easing: 'linear',
    direction: 'alternate',
    autoplay: false,
    duration: 120
});
var blinkRightEye = anime({
    targets: '#character-right-eye',
    rotateX: 100,
    easing: 'linear',
    direction: 'alternate',
    autoplay: false,
    duration: 120
});

function blink(){
    blinkLeftEye.play();
    blinkRightEye.play();
    blinkLeftEye.remove();
    blinkRightEye.remove();
}
function blinkRandomizedLoop() {
    blink();
    var randomBlinkInterval = Math.round(Math.random() * (4000 - 3000) + 3000);
    setTimeout(blinkRandomizedLoop, randomBlinkInterval);
}

function idle(){
    headIdle.play();
    rightArmIdle.play();
    leftArmIdle.play();
    bodyIdle.play();
    blinkRandomizedLoop();
}
var el1 = document.querySelector('.head-container');
var el2 = document.querySelector('.character-body');
var el3 = document.querySelector('#character-left-arm');
var waveAnimations = anime.timeline({autoplay:false});
waveAnimations.add({
    targets: '#character-right-arm',
    translateX: 1,
    translateY: -10,
    rotateZ:-150,
    transformOrigin: ['9px 4px'],
    easing:"linear",
    duration: 50,
}).add({
    targets: '#character-right-arm',
    rotateZ:-190,
    easing:"linear",
    duration: 20,
}).add({
    targets: [el1, el2, el3],
    translateY:-10,
    easing: 'cubicBezier(.5, .05, .1, .3)',
    duration: 50,
}).add({
    targets: '#character-right-arm',
    translateY:-10,
    rotateZ:-110,
    easing:"linear",
    duration: 120,
}).add({
    targets: '#character-right-arm',
    rotateZ:-190,
    easing:"linear",
    duration: 120,
}).add({
    targets: '#character-right-arm',
    rotateZ:-110,
    easing:"linear",
    duration: 120,
}).add({
    targets: '#character-right-arm',
    rotateZ:-190,
    easing:"linear",
    duration: 120,
}).add({
    targets: '#character-right-arm',
    rotateZ:-110,
    easing:"linear",
    duration: 120,
}).add({
    targets: '#character-right-arm',
    translateY: 0,
    translateX: 0,
    rotateZ:0,
    transformOrigin: ['9px 4px'],
    easing:"linear",
    duration: 50,
}).add({
    targets: [el1, el2, el3],
    translateY:0,
    easing:"linear",
    duration: 50,
});

const nf = document.querySelectorAll('.neutral-face-container');
const nfa = [...nf]
const gf = document.querySelectorAll('.glad-face-container');
const gfa = [...gf]
function showGladFace(){
    
    nfa.forEach(div=>{
        div.style.display = 'none';
    })
    
    gfa.forEach(div=>{
        div.style.display = 'block';
    })
    
}
function showNeutralFace(){
    nfa.forEach(div=>{
        div.style.display = 'block';
    })
    
    gfa.forEach(div=>{
        div.style.display = 'none';
    })
}

async function wave(){
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    showGladFace();
    waveAnimations.play();

    await sleep(760); 
    showNeutralFace();
    idle();
}
wave()