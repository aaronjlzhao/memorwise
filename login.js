import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut} from 'firebase/auth'
import { getFirestore, collection, getDocs, setDoc, doc, where, query} from 'firebase/firestore'
import { getAppCheck, initializeAppCheck, ReCaptchaV3Provider, getToken} from "firebase/app-check";

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

// const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider("6LcUWmUqAAAAALCbHPlSdUd19qqUyudy9VDSkTuJ"), // Replace with your site key
//     isTokenAutoRefreshEnabled: true, // Optional: Auto-refresh App Check tokens
//   });

// const token = await appCheck.token;
// console.log('App Check Token:', token.token);
  

var toggleState = true;

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcUWmUqAAAAALCbHPlSdUd19qqUyudy9VDSkTuJ'),
    isTokenAutoRefreshEnabled: true, // Optional: Enable auto refresh of the token
  });
  getToken(appCheck, true)  // `true` forces a fresh token
  .then((token) => {
    console.log("App Check Token:", token.token);
  })
  .catch((error) => {
    console.error("Error getting App Check token:", error);
  });





function showEmail(){
    var emailInputBox = document.getElementById('email-input-container');
    emailInputBox.style.display ='flex';
}
function hideEmail(){
    var emailInputBox = document.getElementById('email-input-container');
    emailInputBox.style.display ='none';
}

// inputboxes
var usernameInputBox = document.getElementById('username-input-box');
var emailInputBox = document.getElementById('email-input-box');
var passwordInputBox = document.getElementById('password-input-box');
// warning labels
var createUsername = document.getElementById('create-username-warning');
var createEmail = document.getElementById('create-email-warning');
var createPassword = document.getElementById('create-password-warning');
var forgotPassword = document.getElementById('forgot-password');
// recapcha


function showSignUpWarnings(){
    createUsername.style.display='block';
    createEmail.style.display='block';
    createPassword.style.display='block';
}
function hideSignUpWarnings(){
    createUsername.style.display='none';
    createEmail.style.display='none';
    createPassword.style.display='none';
}
function showForgotPassword(){
    forgotPassword.style.display='block';
}
function hideForgotPassword(){
    forgotPassword.style.display='none';
}


const errorMessage = document.getElementById('error-message');
function hideError() {
    errorMessage.style.display = 'none';
}
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'flex';
}
function showEmailSent() {
    errorMessage.textContent = '验证电子邮件已发送。请检查您的电子邮件并验证您的帐户以继续。';
    errorMessage.style.display = 'flex';
    errorMessage.style.color = 'green';
}

function clearInput(){
    usernameInputBox.value = '';
    emailInputBox.value = '';
    passwordInputBox.value = '';
    usernameLegit = false;
    emailLegit = false;
    passwordLegit = false;
    errorMessage.style.display = 'none';
}



document.addEventListener("DOMContentLoaded", function() {
    // Function to toggle background colors
    function toggleColors() {
        enableContinueButton();
        var div1 = document.getElementById("login-button");
        var div2 = document.getElementById("signup-button");

        if (div1.classList.contains("not-active")) {
            // login side
            clearInput();
            div1.classList.remove("not-active");
            div1.classList.add("active");
            
            div2.classList.remove("active");
            div2.classList.add("not-active");

            toggleState = true;
            hideEmail();
            hideSignUpWarnings();
            showForgotPassword();
        } else {
            // sign up side
            clearInput();
            div1.classList.remove("active");
            div1.classList.add("not-active");
            
            div2.classList.remove("not-active");
            div2.classList.add("active");

            toggleState = false;
            showEmail();
            hideForgotPassword();
            hideForgotPassword();
        }
    }
    
    // Add event listeners to both divs
    document.getElementById("login-button").addEventListener("click", toggleColors);
    document.getElementById("signup-button").addEventListener("click", toggleColors);

    document.getElementById('forgot-password').addEventListener("click", function(){
        window.location.href='forgot-password.html'
    })
});


var allowContinue = false;
var usernameLegit = false;
var emailLegit = false;
var passwordLegit = false;

// testing whether the user is allowed to continue afer signing up
function containsSpace(str) {
    return /\s/.test(str);
}

document.getElementById('password-input-box').addEventListener('input', function() {
    const input = this.value;

    const messageElement = document.getElementById('create-password-warning');
    
    // cloud function should accept toggleState and input.
    function isValidPassword(password) {
        // Regular expression for validating password
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    }
    if (toggleState==true){
        messageElement.style.display = "none";
        if (input.length == 0) {
            passwordLegit = false;
        }
        else{
            passwordLegit = true;
        }
    }
    else{
        if (input.length == 0) {
            messageElement.style.display = "none";
            passwordLegit = false;
        } 
        else if (containsSpace(input)) {
            messageElement.textContent = "不允许有空格.";
            messageElement.style.display = "block";
            passwordLegit = false;
        } 
        else if (isValidPassword(input)) { 
            messageElement.style.display = "none";
            passwordLegit = true;
        } 
        else {
            messageElement.textContent = "必须至少包含 1 个数字、符号和 8 个字符."
            messageElement.style.display = "block";
            passwordLegit = false;
        }
    } 
    
});


document.getElementById('username-input-box').addEventListener('input', function() {
    
    const input = this.value;
    console.log(input)
    const messageElement = document.getElementById('create-username-warning');
    if (toggleState==true){
        messageElement.style.display = "none";
        if (input.length == 0) {
            usernameLegit = false;
        }
        else{
            usernameLegit = true;
        }
        
    }   
    else{
        if (input.length >= 15 || input.length <= 4) {
            console.log('invalid username mate...')
            messageElement.style.display = "block";
            messageElement.textContent = "密码必须介于 5 到 15 个字符之间.";
            usernameLegit = false;
        }
        else {
            messageElement.style.display = "none";
            usernameLegit = true;
        }
    }
    

});


function isValidEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}
document.getElementById('email-input-box').addEventListener('input', function() {
    const input = this.value;
    const messageElement = document.getElementById('create-email-warning');
    if (toggleState==true){
        messageElement.style.display = "none";
    } 
    else{
        if (input.length === 0) {
            messageElement.style.display = "none";
        } 
        else if (isValidEmail(input)) {
            messageElement.style.display = "none";
            emailLegit = true;
        }
        // one more else if statement for testing if email already exists in database
        else {
            messageElement.textContent = '无效的邮件地址.'
            messageElement.style.display = "block";
        }
    }
    
});

const continueButton = document.getElementById('continue-button');
const continueButtonText = document.getElementById('continue-button-text')

function showLoadingContinueButton() {
    continueButtonText.textContent = '请稍等...'
}

function showContinueButton() {
    continueButtonText.textContent = '继续'
}
function disableContinueButton(){
    continueButton.style.pointerEvents='none';
    continueButton.style.opacity='0.55';
}
function enableContinueButton(){
    continueButton.style.pointerEvents='auto';
    continueButton.style.opacity='1';
}

function convertToTimeStamp(time) {
    var myDate = time;
    myDate = myDate.split("-");
    var newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
    return newDate;
}

async function addUserToFirestore(pl) {
    showLoadingContinueButton();
    return fetch('https://us-central1-ezvocab-41e7c.cloudfunctions.net/addThreeScores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  
            'x-firebase-appcheck': token.token,
        },
        body: JSON.stringify(pl), 
    })
        .then(response => response.json()) // Parse JSON response
        .then(result => {
            console.log('Response from function:', result);  
            
            if (result.success) {
                const auth = getAuth();
                signInWithEmailAndPassword(auth, pl.email, pl.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    sendEmailVerification(user)
                    .then(() => {
                        signOut(auth)
                        .then(() => {
                            console.log("Verification email sent to:", user.email);
                            disableContinueButton();
                            showContinueButton();
                            showEmailSent();
                        })
                        .catch((error) => {
                            console.error("Error signing out:", error.message);
                        });
                    })
                    .catch((error) => {
                        console.error("Error sending verification email:", error.message);
                    });

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                });
                console.log('Operation was successful, user added.');
                disableContinueButton()
                showContinueButton()
                showEmailSent();
                return true;  
            } else {
                console.log('Operation failed:', result.message);
                return false;  
            }
        })
        .catch(error => {
            console.error('Error:', error);  
            throw error;  
        });
}

async function signInWithUsername(username, password) {
    showLoadingContinueButton();

    try{
        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if(!querySnapshot.empty) {
            console.log('username exists. logging in.');
            const userEmail = querySnapshot.docs[0].data().email;
            signInWithEmailAndPassword(auth, userEmail, password)
            .then((userCredential) => {
                console.log(auth.currentUser.emailVerified);
                if (auth.currentUser.emailVerified == false) {
                    showError('用户电子邮件未验证.');
                    showContinueButton();
                }
                else{
                    hideError();
                    const user = userCredential.user;
                    window.location.href='dashboard.html';
                }
                            
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                switch (errorCode) {
                    case 'auth/invalid-email':
                        showError('The email address is badly formatted.');
                        showContinueButton();
                        break;
                    case 'auth/user-disabled':
                        showError('The user account has been disabled by an administrator.');
                        showContinueButton();
                        break;
                    case 'auth/user-not-found':
                        showError('There is no user record corresponding to this identifier. The user may have been deleted.');
                        showContinueButton();
                        break;
                    case 'auth/wrong-password':
                        showError('The password is invalid or the user does not have a password.');
                        showContinueButton();
                        break;
                    case 'auth/invalid-credential':
                        showError('密码错误. 请再试一次.');
                        showContinueButton();
                    break;
                    default:
                        showError('Please try again. Error: ' + errorMessage);
                        showContinueButton();
                        break;
                    }
                });
        }
        else{
            showError('该用户不存在.');
            showContinueButton();
        } 
    } catch (error) {
        console.log(error)
        showError('请重试.');
        showContinueButton();
    }
}





continueButton.addEventListener('click', function(event) {

    const usernameInput = usernameInputBox.value;
    const emailInput = emailInputBox.value;
    const passwordInput = passwordInputBox.value;
    
    if (toggleState == true){  
        console.log('true toggle state. user wants to login.');
        showLoadingContinueButton();
        if (passwordLegit == true && usernameLegit == true) {
            if (usernameInput.includes('@')) {
                signInWithEmailAndPassword(auth, usernameInput, passwordInput)
                .then((userCredential) => {             
                    hideError();       
                    const user = userCredential.user;
                    console.log('Successfully signed in. Moving to dashboard.');
                    console.log('emailVerified:', auth.currentUser.emailVerified);
                    if(auth.currentUser.emailVerified == false){
                        showError('用户电子邮件未验证.');
                        showContinueButton();
                    }
                    else{
                        window.location.href='dashboard.html';
                    }
                    
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    showError('请重试.');
                    switch (errorCode) {
                        case 'auth/invalid-email':
                            showError('Invalid email.');
                            showContinueButton();
                            break;
                        case 'auth/user-not-found':
                            showError('There is no user record corresponding to this identifier. The user may have been deleted.');
                            showContinueButton();
                            break;    
                    }
                    showContinueButton();
                });
            }
            else{
                signInWithUsername(usernameInput, passwordInput);
            }
        }
        else {
            showContinueButton();
            console.log('not all conditions are met for user to sign in a new user.');
        }
    }
    else{
        if (passwordLegit == true && usernameLegit == true && emailLegit == true) {
            showLoadingContinueButton();
            console.log('checking yuh');
            const payload = {
                username: usernameInput,
                password: passwordInput,
                email: emailInput,
            };
            
            addUserToFirestore(payload);
            

        }
        else {
            console.log('not all conditions are met for user to create a new user.');
        }
        
    }
});

const eye = document.getElementById('eye');
const eyeSlash = document.getElementById('eye-slash');

eye.addEventListener('click', function(event) {
    eye.style.display = 'none';
    eyeSlash.style.display = 'block';
    passwordInputBox.type = 'password';
});

eyeSlash.addEventListener('click', function(event) {
    eye.style.display = 'block';
    eyeSlash.style.display = 'none';
    passwordInputBox.type = 'text';
});



