import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged, signOut, deleteUser} from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, where, query, deleteDoc} from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider, getToken} from "firebase/app-check";


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
  getToken(appCheck, true)  // `true` forces a fresh token
  .then((token) => {
    console.log("App Check Token:", token.token);
  })
  .catch((error) => {
    console.error("Error getting App Check token:", error);
  });
console.log("Firebase initialized successfully");


document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('confirmation-page').style.display='none';
    document.getElementById('settings-button').addEventListener('click', function(){
        if (document.getElementById('settings-menu').style.display=='none'){
            document.getElementById('settings-menu').style.display='block';
        }
        else{
            document.getElementById('settings-menu').style.display='none';
        }
    })
    
    async function setActiveHat() {
        const currentHat = localStorage.getItem('activeHatClass');
        const hatContainers = [...document.querySelectorAll('.user-hat')];
        for (const div of hatContainers) {
    
            const hat = document.createElement('img');
            hat.style.height = '100%';
            hat.id = "character-hat";
            hat.src = `/src/svg/character/hats/${currentHat}.svg`;
            
            const clonedHatDiv = hat.cloneNode(true); // Clone the node
            div.appendChild(clonedHatDiv);
            await new Promise((resolve, reject) => {
                hat.onload = resolve;
                hat.onerror = reject;
            });
            
            
            
            // div.appendChild(hat);
        }
    }
    function loadCoins(){
        const myCoins = localStorage.getItem('myCoins');
        console.log('myCoins = ', myCoins);
        const c = document.getElementById('coin-num');
        c.textContent = Math.round(myCoins)
    }

    function getUserProgressArray(){
        let arr = [];
        for(let i=0;i<20; i++){
            // arr.push(JSON.parse(localStorage.getItem(`l${i+1}p`)));
            arr.push(localStorage.getItem(`l${i+1}p`));
        }

        return arr;
    }

    async function loadUserData(arr, userId){
        function getTotalCourseProgress(levels){
            let totalScore = 0;
            let maxScore = 0;
            let levelsCompleted = 0;
            function isAllThrees(str) {
                for (let i = 0; i < str.length; i++) {
                    if (str[i] !== '3') {
                        return false;  // If any character is not '3', return false
                    }
                }
                return true;  // If all characters are '3', return true
            }
            levels.forEach(levelString => {
                if(isAllThrees(levelString)){
                    levelsCompleted += 1;
                }
                for (let i = 0; i < levelString.length; i++) {
                    totalScore += parseInt(levelString[i], 10);
                    maxScore += 3; // Each sublevel can have a maximum score of 3
                    
                }
            });
            document.getElementById('levels-completed').textContent = levelsCompleted;
            let percentage = (totalScore / maxScore) * 100;






            return percentage.toFixed(2); // Returns the percentage with 2 decimal places
        }
        document.getElementById('tcp').style.width = `${getTotalCourseProgress(arr)}%`;

        async function getUserHatProgress(){
            let thp = 0;
            let hp = localStorage.getItem('hatProgress');
            for (let i = 0; i < hp.length; i++) {
                thp += parseInt(hp[i], 10);
            }
            console.log("thp:", thp)
            console.log("hp:", hp)
            return (thp/hp.length)*100;
        }
        const hat = await getUserHatProgress();
        document.getElementById('hp').style.width = `${hat}%`;

        function accuracyRate(){
            const incorrectArray = JSON.parse(localStorage.getItem('incorrectAnswers'));
            const correctArray = JSON.parse(localStorage.getItem('correctAnswers'));
            let inc = 0;
            let c = 0;
            if (incorrectArray != undefined &&  correctArray != undefined) {
                incorrectArray.forEach(num=>{
                    inc += num;
                })
                document.getElementById('incorrect-answers').textContent = inc;
                correctArray.forEach(num =>{
                    c += num
                })
                document.getElementById('correct-answers').textContent = c;
                document.getElementById('questions-completed').textContent = c+inc;
                document.getElementById('lessons-completed').textContent = incorrectArray.length+correctArray.length;
                document.getElementById('ar').style.width = `${(c/(c+inc))*100}%`;
            }

            
            
        }
        accuracyRate();

        function loadChallenge(){
            document.getElementById('challenge-attempts').textContent = localStorage.getItem('challengeAttempts')
        }
        loadChallenge()
    }
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
    const loadingScreen = document.getElementById('loading-screen');
    function hideDashboard(){
        document.getElementById('everything').style.display='none';
    }
    function showDashboard(){
        document.getElementById('everything').style.display='block';
    }
    function showLoading(){
        loadingScreen.style.display = 'flex';
        hideDashboard();
    }
    function hideLoading(){
        loadingScreen.style.display = 'none';
        showDashboard();
    }
    showLoading();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            async function deleteUserDB(docId) {
                const docRef = doc(db, 'users', docId);  // Get a reference to the document
                try {
                    await deleteDoc(docRef);  // Delete the document
                    console.log(`Document with ID ${docId} deleted successfully`);
                } catch (error) {
                    console.error("Error deleting document: ", error);
                }
            }
            async function deleteUserAuth(){
                const user = auth.currentUser;
                deleteUser(user).then(() => {
                }).catch((error) => {
                });
            }
            document.getElementById('logout-button').addEventListener('click', function(){
                const auth = getAuth();
                signOut(auth).then(() => {
                  window.location.href='home.html'
                }).catch((error) => {
                    window.location.href='home.html'
                });
            })
            document.getElementById('cancel-subscription-button').addEventListener('click',function(){
                document.getElementById('everything').style.display='none';
                document.getElementById('cp-title').textContent='您确定要取消订阅吗？';
                document.getElementById('cp-description').textContent='取消订阅后，您将失去对我们数据库、挑战模式和审核模式的完全访问权限。';
                document.getElementById('confirmation-page').style.display='block';
                console.log('show confirmation module, then await user to click cancel subscription.')
            })
            document.getElementById('delete-account-link').addEventListener('click', async function () {
                document.getElementById('everything').style.display = 'none';
                document.getElementById('cp-title').textContent = '您确定要删除您的帐户吗?';
                document.getElementById('cp-description').textContent = '您将无法使用所有功能，并且您的进度和用户数据将被删除。';
                document.getElementById('confirmation-page').style.display = 'block';
                document.getElementById('confirm').addEventListener('click', async function(){
                    showLoading();
                    const user = auth.currentUser;
            
                    try {
                        await deleteUserDB(user.uid);
                        await deleteUserAuth();
                
                        

                        await signOut(auth);
                
                        // window.location.href = 'home.html';
                    } catch (error) {
                        console.error('Error occurred during user deletion: ', error);
                    }
                
                })
                
            });
            document.getElementById('cancel').addEventListener('click',function(){
                document.getElementById('everything').style.display='block';
                document.getElementById('confirmation-page').style.display='none';
                
            })
            
            document.getElementById('upgrade-to-premium').addEventListener('click', function(){
                window.location.href='subscription.html';
            })
            const ps = await getPremStatus();
            if(ps){
                document.getElementById('upgrade-to-premium').style.display='none';
            }
            else{
                document.getElementById('upgrade-to-premium').style.display='block';
            }
            setActiveHat()
            idle();
            loadCoins();
            loadUserData(getUserProgressArray(), user.uid);
            hideLoading();
        }
        else{
            window.location.href='home.html';
        }
    });  
})

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