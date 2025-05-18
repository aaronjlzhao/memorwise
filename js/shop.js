import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getFirestore, collection, updateDoc, getDocs, setDoc, doc, where, query, orderBy, limit} from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import JSConfetti from 'js-confetti'
const jsConfetti = new JSConfetti()


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
const functions = getFunctions(app);

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LcUWmUqAAAAALCbHPlSdUd19qqUyudy9VDSkTuJ"), // Replace with your site key
    isTokenAutoRefreshEnabled: true, // Optional: Auto-refresh App Check tokens
  });
// const user = auth.currentUser;

console.log("Firebase initialized successfully yessirski");

document.addEventListener('DOMContentLoaded', function(){
    const a = document.getElementById('nav');
    const b = document.getElementById('content-container');
    const c = document.getElementById('upgrade-to-premium');
    const d = document.getElementById('footer-links');
    const e = document.getElementById('back-button');
    const loadingScreen = document.getElementById('loading-screen');
    function hidePage(){
        a.style.display = 'none';
        b.style.display='none';
        c.style.display='none';
        d.style.display='none';
        e.style.display='none';
    }
    function showPage(){
        a.style.display = 'block';
        b.style.display='block';
        c.style.display='block';
        d.style.display='flex';
        e.style.display='flex';
    }
    function showLoading(){
        hidePage()
        loadingScreen.style.display='flex';
    }
    function hideLoading(){
        showPage()
        loadingScreen.style.display='none';
    }
    async function getUserCoins() {
        try {
          // Reference the Cloud Function
          async function fetchUserCoins(userId) {
            const functionURL = "https://getcoinsdb-z2tqawaq2q-uc.a.run.app";
          
            try {
              const response = await fetch(functionURL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }), // Pass userId in the body
              });
          
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
          
              const result = await response.json();
              console.log("what User Coins:", Number(result.coins));
              const c = document.getElementById('coin-num');
              c.textContent = Number(result.coins);
              return Number(result.coins); // Return coins for further usage
            } catch (error) {
              console.error("Error fetching user coins:", error.message);
              throw error;
            }
          }
          const result = await fetchUserCoins(auth.currentUser.uid);
          const { coins } = result.data;
          console.log("User Coins:", coins);
          localStorage.setItem('myCoins', coins);
          return coins;
        } catch (error) {
          console.error("Error calling getCoinsDB:", error.message);
          throw error;
        }
      }
    async function loadCoins(uid){
        // async function getCoinsDB(){
        //     let userCoins = 0;
        //     const userId = uid;
        //     const usersRef = collection(db, "users");
        //     const q = query(usersRef, where("user_id", "==", userId));
        //     const usersQuery = await getDocs(q);
        //     usersQuery.forEach(async (doc) => {
        //         const userData = doc.data();
        //         userCoins = userData.coins;
        //     })    
        //     return userCoins
        // }
        console.log('whatchu be talkig about bb');
        const myCoins = localStorage.getItem('myCoins');

        console.log('myCoins = ', await getUserCoins());
        const c = document.getElementById('coin-num');
        c.textContent = myCoins
    }
    async function getHatProgress(){
        
    }
    
    function createHats(numberOfHats, userHatProgress) {
        
        for (let i = 1; i <= numberOfHats; i++) {
            const hatDiv = document.createElement('div');
            const userActiveHatDiv = document.createElement('img');
            if(i == 1 && userHatProgress[i-1]=='1'){
                hatDiv.className = 'd-flex hat-container justify-content-center align-items-end owned';
                hatDiv.id=`hat-${i}`
                hatDiv.innerHTML = `
                    <div>
                        <img class="hat small-shadow" src="/src/svg/character/hats/hat-1.svg">
                        <div class="coin-container mt-2">
                            <div class="d-flex justify-content-center align-items-end">
                                <img src="/src/svg/coin-gold.svg" class="coin-icon-style">
                                <span class="price" style='color:#CC9900;font-size:14px;'>已经购买了</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            else if (i != 1 && userHatProgress[i-1]=='1'){
                hatDiv.className = 'd-flex hat-container justify-content-center align-items-end owned';
                hatDiv.id=`hat-${i}`
                hatDiv.innerHTML = `
                    <div>
                        <img class="hat small-shadow" src="/src/svg/character/hats/hat-${i}.svg">
                        <div class="coin-container mt-2">
                            <div class="d-flex justify-content-center align-items-end">
                                <img src="/src/svg/coin-gold.svg" class="coin-icon-style">
                                <span class="price" style='color:#CC9900;font-size:14px;'>已经购买了</span>
                            </div>
                        </div>
                    </div>
                `;
                
            }
            else{
                hatDiv.className = 'd-flex hat-container justify-content-center align-items-center unbought';
                hatDiv.id=`hat-${i}`
                hatDiv.innerHTML = `
                    <div>
                        <img class="hat small-shadow" src="/src/svg/character/hats/hat-${i}.svg">
                        <div class="coin-container mt-2">
                            <div class="d-flex justify-content-center align-items-end">
                                <img id='svg-${i}' src="/src/svg/coin.svg" class="coin-icon-style">
                                <span id='price-${i}' class="price">${i * 20000}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            console.log('hatDiv:', hatDiv.id, "activeHat:", localStorage.getItem('activeHat'));
            if (hatDiv.id == localStorage.getItem('activeHatClass')){
                hatDiv.style.backgroundColor = '#D9D9D9';
                hatDiv.style.borderRadius = "10px";
                userActiveHatDiv.src = `/src/svg/character/hats/${localStorage.getItem('activeHatClass')}.svg`;
                userActiveHatDiv.style.height = '100%';
                userActiveHatDiv.id = "character-hat";
            }
            // Append the new div to the hats container
            const hatsContainer = document.getElementById('grid-shop');
            hatsContainer.appendChild(hatDiv);
            const uh = [...document.querySelectorAll('.user-hat')];
            
            uh.forEach(div => {
                const clonedHatDiv = userActiveHatDiv.cloneNode(true); // Clone the node
                div.appendChild(clonedHatDiv);
                console.log('adding one hat to active character');
            });
        }
    }
    function setActiveHat(hatId){
        console.log('hatId:', hatId); // Log hatId to check its value

        const hatContainers = [...document.querySelectorAll('.user-hat')];
        hatContainers.forEach(div => {
            const existingHat = div.querySelector('#character-hat');
            if (existingHat) {
                div.removeChild(existingHat);
            }
            console.log('applying active hat svg...')
            const hat = document.createElement('img');
            hat.style.height = '100%';
            hat.id = "character-hat";
            hat.src= `/src/svg/character/hats/${hatId}.svg`
            div.appendChild(hat);
        });
        const allHats = [...document.querySelectorAll('.hat-container')];
        allHats.forEach(div=>{
            if(div.id == hatId){
                div.style.backgroundColor = '#D9D9D9';
                div.style.borderRadius = "10px";
                localStorage.setItem('activeHat', `${div.id}`)
            }
            else{
                div.style.backgroundColor = '';
                div.style.borderRadius = "";
            }
        })
        
    }
    function setActiveClass(hatId){
        
        const allHats = [...document.querySelectorAll('.hat-container')];
        allHats.forEach(div=>{
            if(div.id == hatId){
                div.style.backgroundColor = '#D9D9D9';
                div.style.borderRadius = "10px";
                localStorage.setItem('activeHatClass', `${div.id}`)
                
            }
            else{
                div.style.backgroundColor = '';
                div.style.borderRadius = "";
            }
        })

    }
    async function playConfetti() {
        await jsConfetti.addConfetti();
        await new Promise(resolve => setTimeout(resolve, 0));
        jsConfetti.clearCanvas();
    }
    async function updateCoins(newCoinNum, hatId, price){
        
        var updatedUserCoinTotal = Number(localStorage.getItem('myCoins'))-price;
        var coinAnimation = anime({
            targets: '.coin-num',
            innerHTML: [updatedUserCoinTotal+price, updatedUserCoinTotal],
            round: 1,
            easing: 'easeInOutExpo',
            autoplay: false
        });
        coinAnimation.play();
        document.getElementById(`price-${extractNumberFromId(hatId)}`).style.color = '#CC9900';
        document.getElementById(`svg-${extractNumberFromId(hatId)}`).src = '/src/svg/coin-gold.svg';
        document.getElementById(`price-${extractNumberFromId(hatId)}`).textContent = '已经购买了';
        const user = auth.currentUser;
        function extractNumberFromId(id) {
            const match = id.match(/\d+/);
            return match ? match[0] : null;
        }
        function setIndexToOne(str, index) {
            let arr = str.split('');
            if (index >= 0 && index < arr.length) {
                arr[index] = '1';
            } else {
                throw new Error('Index out of bounds');
            }  
            return arr.join('');
        }

        const userId = user.uid;
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", userId));
        const usersQuery = await getDocs(q);
        let userHatProgress;
        usersQuery.forEach((doc) => {
            const userData = doc.data();
            userHatProgress = userData.hatProgress;
        })
        
        
        const hatRef = doc(db, "users", user.uid);
        await updateDoc(hatRef, {
            coins: newCoinNum-price,
            hatProgress: setIndexToOne(userHatProgress, extractNumberFromId(hatId)-1),
        });

        

        const userCoins = localStorage.getItem('myCoins');
        localStorage.setItem('myCoins', userCoins - price);
        localStorage.setItem('activeHatClass', hatId);
        e.style.pointerEvents = 'auto';
        e.style.opacity = '1';
    }
    async function showBuy(hatId){
        function extractNumberFromId(id) {
            const match = id.match(/\d+/);
            return match ? match[0] : null;
        }
        const price = extractNumberFromId(hatId)*20000;
        
        document.getElementById('purchase-warning').style.opacity = 0.85;
        document.getElementById('purchase-button').addEventListener('click', function(){
            const userCoins = localStorage.getItem('myCoins');
        if (userCoins >= price) {
            playConfetti();
            e.style.pointerEvents = 'none';
            e.style.opacity = '0.37';


            updateCoins(userCoins,localStorage.getItem('activeHat'), price);   
            document.getElementById('purchase-warning').style.opacity = 0;

            console.log('remaining coins:', localStorage.getItem('myCoins'));
            
        } 
        else {
            console.log('you don\'t have enough coins');
            const wL = document.getElementById('warning-label');
            wL.textContent='你没有足够的金币.'
            wL.style.color='#B32E2E';
            wL.style.fontWeight='bold';
            document.getElementById('purchase-button').style.opacity='0.47';
            document.getElementById('purchase-button').style.pointerEvents='none';
        }
    
        })
        document.getElementById('cancel-button').addEventListener('click', function(){
            document.getElementById('purchase-warning').style.opacity = 0;
        })
    }
    function hideBuy(){
        document.getElementById('purchase-warning').style.opacity = 0;
    }
    async function getUserHatProgress(userId){
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", userId));
        const usersQuery = await getDocs(q);
        let userHatProgress;
        let userCoins;
        usersQuery.forEach((doc) => {
            const userData = doc.data();
            userHatProgress = userData.hatProgress;
            userCoins = userData.coins;
        })
        return [userHatProgress, userCoins];
    }
    showLoading();
    
    onAuthStateChanged(auth, async (user) => {
        
        
        if (user) {
            loadCoins(user.uid);
            document.getElementById('upgrade-to-premium').addEventListener('click', function(){
                window.location.href='subscription.html';
            })
            var up = await getUserHatProgress(user.uid);
            console.log('up:', up)
            
            

            
            var totalNumberOfHats = 36
            createHats(totalNumberOfHats, up[0]);
            
            const ownedHats = [...document.querySelectorAll('.owned')];
            ownedHats.forEach(div=>{
                div.addEventListener('click', function(){
                    setActiveHat(div.id);
                    hideBuy();
                    setActiveClass(div.id);
                })
            })
            const remainingHats = [...document.querySelectorAll('.unbought')]
            remainingHats.forEach(div=>{
                div.addEventListener('click', function(){
                    const wL = document.getElementById('warning-label');
                    wL.textContent='买这顶帽子吗？.'
                    wL.style.color='#616161';
                    wL.style.fontWeight='400';
                    document.getElementById('purchase-button').style.opacity='1';
                    document.getElementById('purchase-button').style.pointerEvents='auto';
                    setActiveHat(div.id);
                    showBuy(div.id);
                })

            })
            hideLoading()
        }
        else{
            console.log('user is not logged in')
            window.location.href='home.html';
        }
    });  
})



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

idle()