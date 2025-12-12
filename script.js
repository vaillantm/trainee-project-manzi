
    /* ------------------------- QUESTIONS ------------------------- */
    const questions = [
      // Level 1 – add / subtract
      { level: 1, text: "What is 2 + 2?", choices: ["3", "4", "5", "6"], answer: "4" },
      { level: 1, text: "What is 5 - 3?", choices: ["1", "2", "3", "4"], answer: "2" },
      { level: 1, text: "What is 8 - 4?", choices: ["3", "4", "5", "6"], answer: "4" },
      { level: 1, text: "What is 3 + 5?", choices: ["7", "8", "9", "10"], answer: "8" },
      { level: 1, text: "What is 9 - 6?", choices: ["2", "3", "4", "5"], answer: "3" },
      // Level 2 – multiply / divide
      { level: 2, text: "What is 6 \\times 7?", choices: ["42", "36", "48", "40"], answer: "42" },
      { level: 2, text: "What is 81 \\div 9?", choices: ["8", "9", "7", "6"], answer: "9" },
      { level: 2, text: "What is 12 \\times 5?", choices: ["50", "60", "55", "65"], answer: "60" },
      { level: 2, text: "What is 48 \\div 6?", choices: ["8", "7", "9", "6"], answer: "8" },
      { level: 2, text: "What is 9 \\times 4?", choices: ["35", "36", "37", "38"], answer: "36" },
      // Level 3 – mixed / larger
      { level: 3, text: "What is 15 + 27?", choices: ["41", "42", "43", "44"], answer: "42" },
      { level: 3, text: "What is 45 - 18?", choices: ["26", "27", "28", "29"], answer: "27" },
      { level: 3, text: "What is 12 \\times 11?", choices: ["121", "130", "132", "143"], answer: "132" },
      { level: 3, text: "What is 81 \\div 9?", choices: ["8", "9", "10", "11"], answer: "9" },
      { level: 3, text: "What is 7 \\times 13?", choices: ["89", "90", "91", "92"], answer: "91" }
    ];

    /* --------------------------- BADGES -------------------------- */
    const badgeDefinitions = [
      { id:'first_answer',  name:'First Steps',      description:'Answer your first question',          icon:'target', requirement:1 },
      { id:'ten_answers',   name:'Getting Started',  description:'Answer 10 questions correctly',       icon:'local_fire_department', requirement:10 },
      { id:'fifty_answers', name:'Math Enthusiast',  description:'Answer 50 questions correctly',       icon:'menu_book', requirement:50 },
      { id:'hundred_answers', name:'Math Expert',    description:'Answer 100 questions correctly',      icon:'lightbulb', requirement:100 },
      { id:'level_2',       name:'Level 2 Achiever', description:'Reach Level 2',                       icon:'star', requirement:2 },
      { id:'level_3',       name:'Level 3 Achiever', description:'Reach Level 3',                       icon:'auto_awesome', requirement:3 },
      { id:'streak_5',      name:'On Fire!',         description:'Get 5 answers in a row',              icon:'local_fire_department', requirement:5 },
      { id:'streak_10',     name:'Unstoppable!',     description:'Get 10 answers in a row',             icon:'bolt', requirement:10 }
    ];

    /* ------------------------ GAME STATE ------------------------- */
    const defaultState = {
      level:1, xp:0,
      correctAnswers:0, totalAnswers:0,
      currentStreak:0, bestStreak:0,
      badges:[],
      sessionCorrect:0, sessionTotal:0
    };

    let gameState = loadGameState();
    let currentQuestionIndex = 0;  // shows how many asked this level
    let isAnswering = false;

    /* ---------------------- STATE PERSISTENCE -------------------- */
    // Using localStorage for this simple prototype, as no multi-user sync is required.
    function loadGameState(){
      try{
        const saved = JSON.parse(localStorage.getItem("hesabuquest_state"));
        return saved ? {...defaultState, ...saved} : {...defaultState};
      }catch(e){ 
        console.error("Error loading game state:", e);
        return {...defaultState}; 
      }
    }
    function saveGameState(){
      try {
        localStorage.setItem("hesabuquest_state", JSON.stringify(gameState));
      } catch(e) {
        console.error("Error saving game state:", e);
      }
    }

    /* -------------------------- UI NAV --------------------------- */
    
    function toggleStatsVisibility(show) {
      const statsContainer = document.getElementById("stats-container");
      if (statsContainer) {
        statsContainer.style.display = show ? 'flex' : 'none';
      }
    }

    function showPage(id) {
        document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
        document.getElementById(id).classList.add("active");
    }

    function showWelcome(){
      toggleStatsVisibility(false); // HIDE STATS on Home
      showPage("welcome");
    }
    function showQuiz(){
      toggleStatsVisibility(true); // SHOW STATS when quest starts
      showPage("quiz");
    }
    function showBadges(){
      toggleStatsVisibility(true); // SHOW STATS on Badges page
      renderBadges();
      showPage("badges");
    }
    function showLogin(){
        toggleStatsVisibility(false); // HIDE STATS on Login
        showPage("login");
    }
    function showSignup(){
        toggleStatsVisibility(false); // HIDE STATS on Signup
        showPage("signup");
    }

    /* -------------------------- AUTH STUBS -------------------------- */
    function handleLogin() {
        // In a real app, this would use Firebase Auth.
        // For this prototype, we just display a message and go home.
        const email = document.getElementById("login-email").value;
        console.log(`Attempting login for: ${email}`);
        
        // Simulating success message in place of alert
        const authCard = document.querySelector("#login .auth-card");
        authCard.innerHTML = `<div style="padding: 2rem;"><h2 class="welcome-title" style="font-size: 2rem; color:var(--success);">Login Successful!</h2><p style="color:var(--text-secondary); margin-bottom: 2rem;">Welcome back, ${email}.</p><button class="play-btn" onclick="showWelcome()">Go to Home</button></div>`;
    }
    
    function handleSignup() {
        // In a real app, this would use Firebase Auth.
        // For this prototype, we just display a message and go to login.
        const email = document.getElementById("signup-email").value;
        console.log(`Attempting signup for: ${email}`);

        // Simulating success message
        const authCard = document.querySelector("#signup .auth-card");
        authCard.innerHTML = `<div style="padding: 2rem;"><h2 class="welcome-title" style="font-size: 2rem; color:var(--success);">Registration Complete!</h2><p style="color:var(--text-secondary); margin-bottom: 2rem;">Account created for ${email}. Please log in.</p><button class="play-btn" onclick="showLogin()">Go to Login</button></div>`;
    }


    /* -------------------------- DISPLAY -------------------------- */
    function updateDisplay(){
      document.getElementById("level-display").textContent = gameState.level;
      document.getElementById("xp-display").textContent    = gameState.xp;
      document.getElementById("badges-display").textContent= gameState.badges.length;
      saveGameState();
    }

    /* ----------------------- START / NEXT ------------------------ */
    function startGame(){
      currentQuestionIndex = 0;
      showQuiz(); // This calls showQuiz which now shows the stats bar
      loadNextQuestion();
    }
    function loadNextQuestion(){
      if(isAnswering) return;
      const levelQs = questions.filter(q=>q.level===gameState.level);
      
      // If no more questions for the current level, try to level up
      if(levelQs.length===0){ 
        if(gameState.level < 3) {
            levelUp(); 
        } else {
            document.getElementById("question-text").textContent = "All levels completed! Great work!";
            document.getElementById("choices-grid").innerHTML = `<button class="play-btn" onclick="showWelcome()">Back to Home</button>`;
        }
        return; 
      }

      const q = levelQs[Math.floor(Math.random()*levelQs.length)];
      currentQuestionIndex++;

      // update UI
      document.getElementById("question-num").textContent = currentQuestionIndex;
      document.getElementById("total-questions").textContent = Math.max(10, currentQuestionIndex);
      document.getElementById("question-text").textContent = q.text;
      document.getElementById("feedback").textContent = '';
      document.getElementById("feedback").className = 'feedback';
      document.getElementById("progress-fill").style.width = ((currentQuestionIndex%10)/10)*100 + '%';

      const grid = document.getElementById("choices-grid");
      grid.innerHTML='';
      q.choices.forEach(choice=>{
        const btn=document.createElement("button");
        btn.className="choice-btn";
        btn.textContent=choice;
        btn.onclick=()=>selectAnswer(choice,q.answer,btn);
        grid.appendChild(btn);
      });
    }

    /* ----------------------- ANSWER LOGIC ------------------------ */
    function selectAnswer(pick, correct, btn){
      if(isAnswering) return;
      isAnswering=true;
      const buttons=document.querySelectorAll(".choice-btn");
      buttons.forEach(b=>b.disabled=true);

      const fb=document.getElementById("feedback");
      const correctBtn=[...buttons].find(b=>b.textContent===correct);

      if(pick===correct){
        btn.classList.add("correct");
        fb.textContent=" Correct! +10 XP";
        fb.className="feedback correct";

        gameState.correctAnswers++;
        gameState.currentStreak++;
        gameState.sessionCorrect++;
        gameState.xp += 10;
        if(gameState.currentStreak>gameState.bestStreak) gameState.bestStreak=gameState.currentStreak;
        checkBadgesAfterAnswer();
      }else{
        btn.classList.add("incorrect");
        if(correctBtn) correctBtn.classList.add("correct");
        fb.textContent=" Wrong! Correct answer: "+correct;
        fb.className="feedback incorrect";
        gameState.currentStreak=0;
      }
      gameState.totalAnswers++;
      gameState.sessionTotal++;
      updateDisplay();

      // Check for level up condition after updating XP
      const xpNeededForNextLevel = gameState.level * 100;
      if (gameState.xp >= xpNeededForNextLevel && gameState.level < 3) { // Hard limit at level 3 for now
        setTimeout(levelUp, 500); 
        return; // Skip loading next question immediately
      }

      setTimeout(()=>{ isAnswering=false; loadNextQuestion(); },2000);
    }

    /* ------------------------- BADGES --------------------------- */
    function awardBadge(id){
      if(!gameState.badges.includes(id)){
        gameState.badges.push(id);
        showBadgeToast(id);
      }
    }
    function showBadgeToast(id){
      const badge = badgeDefinitions.find(b=>b.id===id);
      if(!badge) return;
      // Using the dedicated toast CSS class for styling consistency
      const toast=document.createElement("div");
      toast.className="toast"; 
      toast.innerHTML=`
        <div style="font-size:1.8rem;text-align:center;">
          <span class="material-symbols-outlined" style="font-size: 1.8rem;">${badge.icon}</span>
        </div>
        <div style="font-weight:700;text-align:center;">${badge.name} UNLOCKED!</div>`;
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(),3000);
    }
    function checkBadgesAfterAnswer(){
      badgeDefinitions.forEach(b=>{
        if(gameState.badges.includes(b.id)) return;
        let earned=false;
        if(b.id.includes('answer')) earned = gameState.correctAnswers>=b.requirement;
        if(b.id==='streak_5') earned = gameState.currentStreak>=5;
        if(b.id==='streak_10') earned = gameState.currentStreak>=10;
        if(b.id.startsWith('level_')) earned = gameState.level>=b.requirement;
        if(earned) awardBadge(b.id);
      });
    }
    function renderBadges(){
      const grid=document.getElementById("badges-grid");
      grid.innerHTML='';
      badgeDefinitions.forEach(b=>{
        const earned=gameState.badges.includes(b.id);
        const card=document.createElement("div");
        card.className=`badge-card ${earned?'earned':'locked'}`;
        
        let progressText = '';
        if (b.id.includes('answer')) {
            progressText = `${gameState.correctAnswers}/${b.requirement} Answers`;
        } else if (b.id.startsWith('level_')) {
            progressText = `Level ${gameState.level}/${b.requirement}`;
        } else if (b.id.startsWith('streak_')) {
            progressText = `${gameState.currentStreak}/${b.requirement} Streak`;
        }

        card.innerHTML=`
          <div class="badge-icon">
            <span class="material-symbols-outlined" style="font-size: 2.5rem;">${b.icon}</span>
          </div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-description">${b.description}</div>
          ${!earned ? `<div style="margin-top:0.4rem;font-size:0.75rem;color:var(--warning);font-weight:bold;">Goal: ${progressText}</div>` : ''}
        `;
        grid.appendChild(card);
      });
    }

    /* ------------------------- LEVEL UP -------------------------- */
    function levelUp(){
      gameState.level++;
      gameState.xp=0;
      currentQuestionIndex=0;
      awardBadge(`level_${gameState.level}`);
      document.getElementById("new-level").textContent = gameState.level;
      document.getElementById("level-up-modal").style.display='flex';
      updateDisplay();
    }
    function closeLevelUpModal(){
      document.getElementById("level-up-modal").style.display='none';
      showWelcome();
      if (document.getElementById("quiz").classList.contains("active")) {
          loadNextQuestion();
      }
    }

    /* ------------------------- INIT ------------------------------ */
    function initGame(){
      updateDisplay();
      renderBadges();
      // Ensure we are on the welcome page at load, which now hides the stats.
      showWelcome(); 
    }
    initGame();
