import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged} from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, where, query} from 'firebase/firestore'
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

function showLoading(){
    document.body.style.display='block';
    document.getElementById('loading-screen').style.display='flex';
    document.getElementById('everything').style.display='none';
}
function hideLoading(){
    document.getElementById('loading-screen').style.display='none';
    document.getElementById('everything').style.display='block';
}
showLoading();
document.addEventListener("DOMContentLoaded", function(){
    console.log('loading')

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href='home.html';
        }
        else{
            hideLoading();
        }
    })
})