import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, where, query, updateDoc, orderBy, limit} from 'firebase/firestore'

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

const fs = require("fs");
const readline = require("readline");

// // specify the path of the CSV file
const path = "C:\\Users\\aaron\\OneDrive\\Desktop\\Flashcard App V3.4\\src\\js\\vocab_google.csv";


// Create a read stream
const readStream = fs.createReadStream(path);

// Create a readline interface
const readInterface = readline.createInterface({
  input: readStream
});

// Variables to store the output
let word;
let lessonId;
let def;
let sent;

// This is the part you asked me for
// Event handler for reading lines

function extractNumber(input) {
  const match = input.match(/^\d+/);
  return match ? parseInt(match[0], 10) : null;
}


let currentLevel;
readInterface.on("line", (line) => {
    const row = line.split(",");
    word = row[1];
    lessonId = row[2];
    def = row[3];
    sent = row[4];
    console.log(word, lessonId, def, sent);
});


// I don't know enough js, so I don't know if the part underneath is necessary
// Event handler for the end of file
readInterface.on("close", () => {
    console.log("End of file"); 
});

// Event handler for handling errorsreaed
readInterface.on("error", (err) => {
  console.error("Error reading the CSV file:", err);
});






