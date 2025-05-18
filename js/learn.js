import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import { getFirestore, collection, updateDoc, getDocs, doc, where, query, orderBy, limit} from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import * as CryptoJS from 'crypto-js';

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

function gk(){
    let sk = "circadian_rhythm123"
    return sk
}

function encryptArray(txt){
    return CryptoJS.AES.encrypt(JSON.stringify(txt), gk()).toString();
}

function decryptArray(txtToDecrypt){
    return CryptoJS.AES.decrypt(txtToDecrypt, gk()).toString(CryptoJS.enc.Utf8);

}    
    
    
    
    function loadPage(){
        setLevel(localStorage.getItem("myCurrentLevel"), localStorage.getItem(`d${localStorage.getItem("myCurrentLevel")}`));
        setAllDescriptions();
        
    }

    
    
    




document.addEventListener('DOMContentLoaded', function() {

    const bodyOnMe = document.body;
    const a = document.getElementById('nav');
    const b = document.getElementById('content-container');
    const c = document.getElementById('upgrade-to-premium');
    const d = document.getElementById('footer-links');
    const e = document.getElementById('back-button');
    const loadingScreen = document.getElementById('loading-screen');
    function hideDashboard(){
        a.style.display = 'none';
        b.style.display='none';
        c.style.display='none';
        d.style.display='none';
        e.style.display='none';
    }
    function showDashboard(){
        a.style.display = 'block';
        b.style.display='block';
        c.style.display='block';
        d.style.display='flex';
        e.style.display='block';
    }
    function showLoading(){
        bodyOnMe.style.height = '100%';
        hideDashboard();
        loadingScreen.style.display = 'flex';
    }
    showLoading();
    function hideLoading(){
        bodyOnMe.style.height = '';
        loadingScreen.style.display = 'none';
        showDashboard();
    }




    function setCoins(){
        document.getElementById('coin-num').textContent = localStorage.getItem('myCoins');
    }
    function setAllDescriptions(){
        localStorage.setItem("d1", "阅读是学习词汇的好方法。通过阅读各种书籍和文章，你可以接触到丰富的词汇和不同的语境。无论是小说、杂志还是学术论文，广泛的阅读可以帮助你自然地扩大词汇量。此外，阅读时记笔记，把不熟悉的单词记下来，并查阅词典，能进一步巩固学习效果。");
        localStorage.setItem("d2", "使用词汇卡片是一种传统但有效的学习方法。你可以将新单词写在一面，定义或例句写在另一面。每天抽出一定时间复习这些卡片，有助于逐步积累词汇量。你还可以根据记忆情况分批管理卡片，将掌握不好的单词多复习几次，加深印象。");
        localStorage.setItem("d3", "通过观看电影或电视剧，可以在真实情境中学习和记住新词汇。选择字幕，先看一遍了解大致内容，再看一遍注意新单词的使用。记下这些单词并查找它们的意思，然后在下一次观看时，尝试在对话中找到并理解这些词汇的用法。");
        localStorage.setItem("d4", "参加语言学习班，通过与老师和同学的互动，可以快速提高词汇量。课堂上，老师会教授新词汇并提供练习机会，同学之间的讨论也能让你学到更多实用的词汇。课堂外的作业和小组活动，更能帮助你巩固所学的词汇。");
        localStorage.setItem("d5", "听音乐并记住歌词，是一种有趣且有效的学习词汇的方法。选择你喜欢的音乐，关注歌词的内容，找出其中不熟悉的单词并查找它们的意思。反复听歌曲并跟唱，可以加深你对这些词汇的记忆，同时提高你的听力和发音。");
        localStorage.setItem("d6", "记日记，每天用新学到的单词写几句话，可以巩固词汇记忆。通过日记记录生活中的点滴，不仅可以练习写作，还能实际运用新学到的词汇。每周复习日记中的新单词，能有效加深记忆，帮助你逐渐掌握更多词汇。");
        localStorage.setItem("d7", "与母语者对话，通过实践来学习和掌握新的词汇。寻找语言交换伙伴或参加语言角活动，主动使用新学到的单词，并请对方纠正你的错误。在实际交流中使用词汇，可以让你更深刻地理解它们的用法和语境。");
        localStorage.setItem("d8", "使用联想记忆法，将新词汇与已有的知识或图像联系起来，可以帮助记忆。例如，将新单词与某个熟悉的场景或物品联系起来，形成一个生动的画面，有助于加深记忆。你也可以通过编故事或造句，将多个新单词串联起来，增强记忆效果。");
        localStorage.setItem("d9", "做词汇练习题，如填空题和匹配题，可以强化词汇学习效果。通过反复做练习，能帮助你巩固记忆，并提高在不同语境中使用词汇的能力。网上有很多免费的词汇练习资源，你可以根据自己的需要选择合适的题目进行练习。");
        localStorage.setItem("d10", "通过写作练习，频繁使用新词汇，可以加深记忆。尝试写短文或文章，尽量多用新学到的单词，并请老师或朋友帮忙修改。写作不仅能帮助你记住单词的拼写和意思，还能提高你组织语言和表达思想的能力，是一种全面的学习方法。");
        localStorage.setItem("d11", "玩词汇类游戏，如拼字游戏和填字游戏，可以在娱乐中学习词汇。这些游戏通常要求玩家拼出正确的单词或填补缺失的字母，通过游戏过程，可以自然地记住许多新词汇。与朋友或家人一起玩游戏，还能增加学习的趣味性和互动性。");
        localStorage.setItem("d12", "听播客和有声书，是提升词汇量的好方法。选择适合你水平和兴趣的内容，在听的过程中注意新词汇的使用。你可以暂停录音，查找不懂的单词，并尝试理解其在语境中的意思。反复听录音，能帮助你巩固记忆，并提高听力和理解能力。");
        localStorage.setItem("d13", "使用在线词典和词汇工具，可以随时查找和学习新词汇。这些工具通常提供详细的定义、例句和发音，帮助你全面理解词汇的用法。你还可以利用词典中的词汇列表和每日一词功能，定期学习和复习新词汇，逐步扩大词汇量。");
        localStorage.setItem("d14", "加入词汇学习小组，与他人共同学习和分享经验，可以提高学习效率。在小组中，你可以互相督促，共同制定学习计划，并通过讨论和交流，了解更多学习词汇的方法和技巧。小组活动还能提供更多的练习机会，帮助你巩固所学的词汇。");
        localStorage.setItem("d15", "通过模拟考试，检测和提高你的词汇水平。选择一些词汇量测试或模拟考试，定期进行测试，可以了解你的词汇掌握情况，并发现薄弱环节。根据测试结果，有针对性地进行复习和强化，能帮助你逐步提高词汇量和语言水平。");
        localStorage.setItem("d16", "做词汇扩展练习，将一个单词延伸到相关的词汇和表达。例如，从一个动词出发，学习其名词、形容词和副词形式，了解不同形式的用法和搭配。通过这种方法，可以从一个单词扩展到一组词汇，系统地提高你的词汇量。");
        localStorage.setItem("d17", "通过情境学习，将新词汇应用到具体的生活场景中。例如，在购物时记住商品名称，在旅行时学习交通和地理相关的词汇。通过亲身体验和实际运用，可以更容易地记住和掌握这些词汇，增强你的语言能力和自信心。");
        localStorage.setItem("d18", "参加词汇竞赛或挑战，激发你的学习兴趣和动力。许多学校和语言学习机构会定期举办词汇竞赛，你可以报名参加，通过竞赛提升词汇量。与他人竞争，不仅能增强学习的动力，还能通过比赛过程中的紧张和刺激，帮助你更好地记住词汇。");
        localStorage.setItem("d19", "结合多种学习方法，制定个性化的词汇学习计划。根据你的学习习惯和兴趣，选择合适的学习方法，如阅读、听力、写作和游戏等，综合运用，提高学习效果。定期调整和优化学习计划，保持学习的持续性和兴趣，逐步扩大词汇量。");
        localStorage.setItem("d20", "通过体验式学习，亲身实践新词汇。例如，学习烹饪时记住食材名称和烹饪步骤，在运动时掌握相关的动作和规则词汇。体验式学习将语言学习与实际活动结合起来，使你在真实情境中使用和记住词汇，增强记忆效果和应用能力。同时，通过与他人分享和交流这些体验，可以进一步巩固所学的词汇。");
        
        localStorage.setItem("d1-t", "初级");
        localStorage.setItem("d2-t", "初级");
        localStorage.setItem("d3-t", "初级");
        localStorage.setItem("d4-t", "初级");
        localStorage.setItem("d5-t", "中级");
        localStorage.setItem("d6-t", "中级");
        localStorage.setItem("d7-t", "中级");
        localStorage.setItem("d8-t", "中级");
        localStorage.setItem("d9-t", "中级");
        localStorage.setItem("d10-t", "高级");
        localStorage.setItem("d11-t", "高级");
        localStorage.setItem("d12-t", "高级");
        localStorage.setItem("d13-t", "高级");
        localStorage.setItem("d14-t", "高级");
        localStorage.setItem("d15-t", "高级");
        localStorage.setItem("d16-t", "高级");
        localStorage.setItem("d17-t", "高级");
        localStorage.setItem("d18-t", "高级");
        localStorage.setItem("d19-t", "高级");
        localStorage.setItem("d20-t", "高级");
    
    }

    async function setLevel(num, description, descriptionTitle){
        document.getElementById('level-num').textContent = num;
        document.getElementById('description').textContent = description;
        document.getElementById('lesson-name').textContent = descriptionTitle;

        const auth = getAuth();
        const user = auth.currentUser;
        const ur = collection(db, "users");
        const c = query(ur, where("user_id", "==", user.uid));
        const usersQuery = await getDocs(c);
        usersQuery.forEach(doc=> {
            var userData = doc.data();
            console.log(userData)
            if(userData.hasPremium == false){
                console.log('user does not have prem')
                loadWordsNoPrem();
            }
            else{
                console.log('user has prem')
                loadWordsYesPrem();
            }
        });
        
        async function getWordDataArray(){
            function getCurrentLevel(){
                const myCurrentLevel = localStorage.getItem("myCurrentLevel");
                return Number(myCurrentLevel);
            }
            const clnum = getCurrentLevel();
            if (localStorage.getItem(`${clnum}-arr`) === null) {
                console.log('local storage has not storred arragy. downloading array onto browser...')
                const q2 = query(collection(db, `wordsLevel${clnum}`));
                console.log(`${clnum}-arr`);
                const querySnapshot = await getDocs(q2);
                const length = querySnapshot.size;
                let lessonWordList = [];
                for (let i = 0; i<length; i++) {
                    console.log('pushing word to local storage')
                    const wordData = querySnapshot.docs[i].data();
                    lessonWordList.push(wordData);
                }
                try {
                    localStorage.setItem(`${clnum}-arr`, encryptArray(lessonWordList))
                  } catch (e) {
                    if (e == QUOTA_EXCEEDED_ERR) {
                      console.log('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
                    }
                  }
                
                return lessonWordList;
              } 
            else {
                console.log('local storage has storred array. NO NEED TO DOWNLOAD ARRAY.')
                return JSON.parse(decryptArray(localStorage.getItem(`${clnum}-arr`)));
            }
        }
        async function loadWordsNoPrem(){

            var wordsQuery = await getWordDataArray();
            wordsQuery = wordsQuery.slice(0, 20);

            const tableBody = document.getElementById('table-body');

            var opacity = 1;
            wordsQuery.forEach(wordData=> {

                // Create a new row
                const tr = document.createElement('tr');
                tr.className = `${wordData.lessonId}`
                tr.id = `${wordData.lessonId}-${wordData.word}`;
                tr.style.opacity = opacity;
                opacity -= 0.05;

                // Create the word cell
                const wordCell = document.createElement('td');
                wordCell.scope = "row";
                wordCell.className = "word";
                wordCell.textContent = wordData.word;
                // Create the definition cell
                const defCell = document.createElement('td');
                defCell.className = "definition";
                defCell.textContent = wordData.def;

                // Create the synonyms cell
                const synCell = document.createElement('td');
                synCell.className = "synonyms";
                synCell.textContent = wordData.sent;  // Assuming synonyms are in an array

                // Append cells to the row
                tr.appendChild(wordCell);
                tr.appendChild(defCell);
                tr.appendChild(synCell);

                // Append the row to the table body
                tableBody.appendChild(tr);
                });

            document.getElementById('get-prem-notif-table-container').style.display='flex';
        }
        async function loadWordsYesPrem(){
            const wordsQuery = await getWordDataArray();

            const tableBody = document.getElementById('table-body');
            wordsQuery.forEach(wordData=> {
                // Create a new row
                console.log('adding row')
                const tr = document.createElement('tr');
                tr.className = `${wordData.lessonId}`
                tr.id = `${wordData.lessonId}-${wordData.word}`;

                // Create the word cell
                const wordCell = document.createElement('td');
                wordCell.scope = "row";
                wordCell.className = "word";
                wordCell.textContent = wordData.word;

                // Create the definition cell
                const defCell = document.createElement('td');
                defCell.className = "definition";
                defCell.textContent = wordData.def;

                // Create the synonyms cell
                const synCell = document.createElement('td');
                synCell.className = "synonyms";
                synCell.textContent = wordData.sent;  // Assuming synonyms are in an array

                // Append cells to the row
                tr.appendChild(wordCell);
                tr.appendChild(defCell);
                tr.appendChild(synCell);

                // Append the row to the table body
                tableBody.appendChild(tr);
            });
            document.getElementById('get-prem-notif-table-container').style.display='none';
        }

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
    document.getElementById('word-input').addEventListener('input', function() {
        var input = this.value.toLowerCase().trim();
        var rows = document.querySelectorAll('#table-body tr');

        rows.forEach(function(row) {
            var rowId = row.id.toLowerCase();
            var parts = rowId.split('-');
            var lessonId = parts[0];
            var word = parts[1];
            
            if (input === "" || lessonId === input || word.startsWith(input)) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    });

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        document.getElementById('upgrade-to-premium').addEventListener('click', function(){
            window.location.href='subscription.html';
        })
        document.getElementById('get-prem-notif-table').addEventListener('click', function(){
            window.location.href='subscription.html';
        })

        setAllDescriptions();
        var mcl = localStorage.getItem('myCurrentLevel');
        var mcd = localStorage.getItem(`d${mcl}`);
        var mclt = localStorage.getItem(`d${mcl}-t`);
        await setLevel(mcl, mcd, mclt);
        const ps = await getPremStatus();
        console.log('ps = ',ps);
        if (ps == true){
            console.log('user has premium status.')
            document.getElementById('advertisement-container').style.display='none';
            document.getElementById('utp').style.display='none';
        }
        
        setCoins();
        setTimeout(() => {
            hideLoading();
          }, 800);
        
      } else {
        window.location.href='login.html';
      }
    });
});

