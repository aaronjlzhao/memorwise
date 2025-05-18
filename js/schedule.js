import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import { getFirestore, collection, updateDoc, getDocs, setDoc, doc, where, query, orderBy, limit} from 'firebase/firestore'
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

// const user = auth.currentUser;

console.log("Firebase initialized successfully");
const a = document.getElementById('nav');
const b = document.getElementById('content-container');
const c = document.getElementById('upgrade-to-premium');
const d = document.getElementById('footer-links');
const e = document.getElementById('back-button');
const loadingScreen = document.getElementById('loading-screen');
function hideDashboard(){
    document.getElementById('everything').style.display='none'
}
function showDashboard(){
    document.getElementById('everything').style.display='block'
}
function showLoading(){
    hideDashboard();
}
showLoading()
function hideLoading(){
    loadingScreen.style.display = 'none';
    showDashboard();
}
showLoading()

document.addEventListener('DOMContentLoaded', function(){
    
    function loadCoins(){
        const myCoins = localStorage.getItem('myCoins');
        console.log('myCoins = ', myCoins);
        const c = document.getElementById('coin-num');
        c.textContent = myCoins
    }
    document.querySelectorAll('.schedule-review-button').forEach(button => {
        button.addEventListener('click', () => {
            console.log('clicked!')
            const buttonId = button.id;
            console.log('buttonId:', buttonId)
            const match = buttonId.match(/level-(\d+)-button/);
            if (match) {
                const num = match[1];
                window.location.href = `lesson.html?/review-${num}`;
              }
            
        });
      });
    function getProgress(){
        let a = [];
        for (let i = 0; i < 20; i++) {
            a.push(localStorage.getItem(`l${i + 1}p`));
        }
        console.log(a)
        return a;
    }
    async function loadProgressBars(){
        

        function calculateProgressSum(string){
            let sum_of_digits = 0;
            for (let i = 0; i < string.length; i++) { 
                sum_of_digits += parseInt(string.charAt(i));
            }
            return sum_of_digits;
        }

        let p = getProgress();
        let counter = 1;
        p.forEach(progress => {
            let yuh = calculateProgressSum(progress);
            let percent = ((yuh/(progress.length*3))*100);
            
            document.getElementById(`level-${counter}-progressbar`).style.width=`${percent}%`;
            
            console.log(`level-${counter}-progressbar`, percent);
            if(percent == 0){
                console.log('zero detected')
                document.getElementById(`level-${counter}-container`).classList.add('not-started');
                document.getElementById(`level-${counter}-button`).classList.add('button-blue');
            }
            else if(percent == 100){
                console.log('100 detected')
                document.getElementById(`level-${counter}-progressbar`).classList.remove('shimmer');
                document.getElementById(`level-${counter}-progressbar`).classList.add('gold');
                document.getElementById(`level-${counter}-button`).classList.add('button-gold');
            }
            else{
                document.getElementById(`level-${counter}-button`).classList.add('button-blue');
            }
            counter += 1;
        })
        
    }
    
    onAuthStateChanged(auth, async (user) => {
        async function getPremStatus(){
            const auth = getAuth();
            const user = auth.currentUser;
            const ur = collection(db, "users");
            const c = query(ur, where("user_id", "==", user.uid));
            const usersQuery = await getDocs(c);
        
            let premStatus = false;
            usersQuery.forEach(doc=> {
                var userData = doc.data();
                if(userData.hasPremium === true){
                    premStatus = true;
                }
        
            });
            return premStatus;
        }
        const ps = await getPremStatus();
        if (user && ps == true) {
            
            setTimeout(() => {
                
                loadProgressBars();
                loadCoins();
                hideLoading();
              }, "1000");
            
            
            
        }
        else{
            window.location.href='home.html';
        }
    });  
})