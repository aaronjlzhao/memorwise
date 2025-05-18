import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut} from 'firebase/auth'
import { getFirestore, collection, getDocs, setDoc, doc, where, query} from 'firebase/firestore'

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
  
console.log("Firebase initialized successfully");

var toggleState = true;


function showEmail(){
    var emailInputBox = document.getElementById('email-input-container');
    emailInputBox.style.display ='flex';
}
function hideEmail(){
    var emailInputBox = document.getElementById('email-input-container');
    emailInputBox.style.display ='none';
}

const emailInputBox = document.getElementById('email-input-box');
const createEmail = document.getElementById('create-email-warning');


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
function hideRecap(){
    reCap.style.display='none';
}
function showRecap(){
    reCap.style.display='block';
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


// function onSubmit(token) {
//     // Example: do something with the token
//     console.log("ReCAPTCHA token:", token);
//     // Submit the form programmatically, or handle as needed
// }


document.addEventListener("DOMContentLoaded", function() {

var emailLegit = false;


async function isValidEmail(email) {
    // Regular expression for validating email addresses
    async function checkIfEmailExists(e) {
        const usersRef = collection(db, "users"); // Replace 'users' with the name of your collection
        const emailQuery = query(usersRef, where("email", "==", e));
      
        try {
          const querySnapshot = await getDocs(emailQuery);
          return !querySnapshot.empty; // Returns true if at least one document contains the email
        } catch (error) {
          console.error("Error checking email existence: ", error);
          throw error;
        }
      }
    const doesEmailExist = await checkIfEmailExists(email);
    return doesEmailExist;
}
document.getElementById('email-input-box').addEventListener('input', function() {
    const input = this.value;
    function isValidEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const result = emailRegex.test(email);
        console.log(`Email format valid (${email}):`, result);
        return result;
    }
        if (input.length === 0) {
            emailLegit = false;
        } 
        else if (isValidEmailFormat(input)) {
            
            emailLegit = true;
        }
        else {
            emailLegit = false;
        }
        console.log('email legit status: ', emailLegit)
});

const continueButton = document.getElementById('continue-button');
const continueButtonText = document.getElementById('continue-button-text')

function showLoadingContinueButton() {
    continueButtonText.textContent = '请稍等...'
}

function showContinueButton() {
    continueButtonText.textContent = '继续'
    continueButton.style.opacity = '1';
    continueButton.style.pointerEvents = 'auto';
}
function disableContinueButton(){
    continueButton.style.pointerEvents='none';
    continueButton.style.opacity='0.55';
}
function enableContinueButton(){
    continueButton.style.pointerEvents='auto';
    continueButton.style.opacity='1';
}
window.onSubmit = function(token) {
    console.log("ReCAPTCHA token:", token);
    // Handle the form submission or other actions
};
// continueButton.addEventListener('click', function() {
//     continueButton.disabled = true;
    
//     const emailInput = emailInputBox.value;
//     async function gv(){
//         let ve = await isValidEmail(emailInput);
//         return ve
//     }
    
//     if (isValidEmailFormat(emailInput)) {
//         console.log('email format is valid, checking if email exists in database...')
//         continueButton.style.pointerEvents = 'none';
//         continueButton.style.opacity='0.66';
//         showLoadingContinueButton();
//         onSubmit();
//         if(await gv()==true){
//             sendPasswordResetEmail(auth, emailInput)
//             .then(() => {
//                 console.log('password reset email was sent!')
//             })
//             .catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//                 // ..
//             });
//         }
//         else{
//             console.log('this email does not exist in the database.')
//         }
        
//     }
//     else {
//         console.log('Invalid email.');
//     }     
// });

continueButton.addEventListener('click', async function() {
    continueButton.disabled = true;
    async function gv(){
        let ve = await isValidEmail(emailInput);
        return ve
    }
    const emailInput = emailInputBox.value;

    // Check if the email format is valid
    if (emailLegit) {
        console.log('Email format is valid, checking if email exists in database...');
        
        continueButton.style.pointerEvents = 'none';
        continueButton.style.opacity = '0.66';
        showLoadingContinueButton();
        onSubmit();

        // Check if the email exists in the database
        const emailExists = await gv();

        if (emailExists) {
            sendPasswordResetEmail(auth, emailInput)
                .then(() => {
                    console.log('Password reset email was sent!');
                    continueButtonText.textContent = '继续';
                    createEmail.textContent='密码重置电子邮件已发送！';
                    createEmail.style.color='#CC9900';
                    createEmail.style.display='block';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error('Error sending password reset email:', errorMessage);
                });
        } else {
            createEmail.textContent='我们的系统中不存在此电子邮件。';
            createEmail.style.color='#B32E2E';
            createEmail.style.display='block';
            showContinueButton();
        }
        
    } else {
        console.log('Invalid email.');
    }
});


});