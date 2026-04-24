const categories = {
    loot: {
        required: 15,
        tasks: [
            { id: 'l1', title: 'Game Day!', desc: 'A team selfie in front of the MIHSEF sign.' },
            { id: 'l2', title: 'Low Battery', desc: 'Someone plugged in and playing.' },
            { id: 'l3', title: 'Hydration', desc: 'Someone on your team drinking water.' },
            { id: 'l4', title: 'The Coach', desc: 'A cool pose with your coach.' },
            { id: 'l5', title: 'NPC Quest', desc: 'A photo of your team with a member of the event staff or a volunteer (be sure to ask nicely first!).' },
            { id: 'l6', title: 'Epic Loot', desc: 'A photo of a teammate holding a piece of official MIHSEF or team merchandise like it\'s a legendary item.' },
            { id: 'l7', title: 'The Fuel', desc: 'A drink (Soda, Gatorade, Monster, Red Bull, G-Fuel, etc.).' },
            { id: 'l8', title: 'Merch Drop', desc: 'Any piece of Esports team apparel (Jersey, hoodie, hat) that is NOT your own team.' },
            { id: 'l9', title: 'The Gamer', desc: 'Someone actively playing a board game, a mobile game, Nintendo Switch, or Steam Deck. (Not in one of their state matches.)' },
            { id: 'l10', title: 'The Trophy', desc: 'Something shiny that isn\'t a real trophy, but you are holding it up like you just won the World Championship.' },
            { id: 'l11', title: 'Health Potion', desc: 'A brightly colored (red, blue, or green) drink or snack.' },
            { id: 'l12', title: 'The Mascot', desc: 'A stuffed animal/pet wearing a headset. (Can also sub in siblings or parents in a cool pose).' },
            { id: 'l13', title: 'The Lucky Charm', desc: 'A lucky charm that someone brought Hold it like the game depends on it.' },
            { id: 'l14', title: 'The MVP', desc: 'A pose with the team praising one of the players.' },
            { id: 'l15', title: 'Leaderboard', desc: 'Make sure your face shows how you feel about it.' }
        ]
    },
    boss: {
        required: 1,
        tasks: [
            { id: 'b1', title: 'The Cosplay', desc: 'Create a recognizable cosplay of a famous video game character using only items you currently have on you, or random items. Take a menacing photo.' }
        ]
    },
    sidequests: {
        required: 8,
        tasks: [
            { id: 's1', title: 'Pre-Game Zen', desc: 'Get in the mindset - Take a picture of your team in a meditative/yoga pose.' },
            { id: 's2', title: 'The Hard Carry', desc: 'Take a picture of one team member giving another team member a piggyback ride while the rider holds a controller or phone horizontally.' },
            { id: 's3', title: 'Touch Grass', desc: 'A dramatic group selfie of the entire team literally touching grass outside with extremely serious, focused gamer faces.' },
            { id: 's4', title: 'The Support Class', desc: 'Wrap a teammate\'s arm or head in towels/tshirt/sweatshirt/whatever you can find like you are applying a mid-match medkit.' },
            { id: 's5', title: 'Camping', desc: 'A photo of a team member hiding in an incredibly obvious spot (behind a small plant, in a cardboard box, or under a jacket) waiting to "ambush" someone.' },
            { id: 's6', title: 'GG WP', desc: 'Shake hands respectfully with a stranger (or a pet) after challenging them to a fierce, BO3 match of Rock-Paper-Scissors.' },
            { id: 's7', title: 'The LAN Party', desc: 'Fit your entire team into a tiny space pretending to aggressively type on invisible keyboards.' },
            { id: 's8', title: 'Post-Match Interview', desc: 'A photo of a teammate looking completely exhausted, speaking into a makeshift microphone (a banana, a hairbrush, a water bottle) while another teammate "interviews" them.' }
        ]
    },
    highlight: {
        required: 4,
        tasks: [
            { id: 'h1', title: 'The Shoutcaster', desc: 'Record someone dramatically, loudly, and rapidly "casting" a teammate doing a completely mundane activity (like tying their shoes, or throwing away trash) as if it\'s the final play of a major tournament.' },
            { id: 'h2', title: 'APM Check', desc: 'A video of a teammate aggressively typing on a calculator, typewriter, or unplugged keyboard like they are trying to reach 400 APM.' },
            { id: 'h3', title: 'The Rage Quit', desc: 'Recreate a dramatic, slow-motion "rage quit" (taking off the headset, throwing hands in the air, and storming off). Note: Do not actually throw or break any real equipment!' },
            { id: 'h4', title: 'The Walkout', desc: 'Film your team doing a synchronized, incredibly confident "stage walkout" down a hallway or sidewalk, complete with imaginary pyrotechnics and waving to an invisible crowd.' }
        ]
    }
};

// Global state
let completedTasks = JSON.parse(localStorage.getItem('mihsef_scavenger_completed_v2')) || {};
const totalRequired = categories.loot.required + categories.boss.required + categories.sidequests.required + categories.highlight.required;

function init() {
    renderCategory(categories.loot, 'list-loot', 'loot-status');
    renderCategory(categories.boss, 'list-boss', 'boss-status');
    renderCategory(categories.sidequests, 'list-sidequests', 'sidequests-status');
    renderCategory(categories.highlight, 'list-highlight', 'highlight-status');
    
    updateScore();
}

function renderCategory(categoryData, containerId, statusId) {
    const container = document.getElementById(containerId);
    categoryData.tasks.forEach(task => {
        const isCompleted = completedTasks[task.id] === true;
        
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${isCompleted ? 'completed' : ''}`;
        taskEl.id = task.id;
        
        taskEl.innerHTML = `
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${task.desc}</div>
            </div>
        `;
        
        taskEl.addEventListener('click', () => toggleTask(task, taskEl, categoryData, statusId));
        container.appendChild(taskEl);
    });
}

function toggleTask(task, element, categoryData, statusId) {
    // Toggle state
    if (completedTasks[task.id]) {
        delete completedTasks[task.id];
        element.classList.remove('completed');
    } else {
        completedTasks[task.id] = true;
        element.classList.add('completed');
    }
    
    // Save to local storage
    localStorage.setItem('mihsef_scavenger_completed_v2', JSON.stringify(completedTasks));
    
    // Update score UI
    updateScore();
}

function updateScore() {
    let currentTotal = 0;
    
    // Check Loot
    let lootCount = 0;
    categories.loot.tasks.forEach(t => { if(completedTasks[t.id]) lootCount++; });
    const lootCapped = Math.min(lootCount, categories.loot.required);
    document.getElementById('loot-status').textContent = `${lootCount} / ${categories.loot.required}`;
    document.getElementById('loot-status').style.color = lootCount >= categories.loot.required ? 'var(--success)' : 'var(--primary-neon)';
    currentTotal += lootCapped;
    
    // Check Boss
    let bossCount = 0;
    categories.boss.tasks.forEach(t => { if(completedTasks[t.id]) bossCount++; });
    const bossCapped = Math.min(bossCount, categories.boss.required);
    document.getElementById('boss-status').textContent = `${bossCount} / ${categories.boss.required}`;
    document.getElementById('boss-status').style.color = bossCount >= categories.boss.required ? 'var(--success)' : 'var(--primary-neon)';
    currentTotal += bossCapped;

    // Check Sidequests
    let sideCount = 0;
    categories.sidequests.tasks.forEach(t => { if(completedTasks[t.id]) sideCount++; });
    const sideCapped = Math.min(sideCount, categories.sidequests.required);
    document.getElementById('sidequests-status').textContent = `${sideCount} / ${categories.sidequests.required}`;
    document.getElementById('sidequests-status').style.color = sideCount >= categories.sidequests.required ? 'var(--success)' : 'var(--primary-neon)';
    currentTotal += sideCapped;
    
    // Check Highlight
    let highCount = 0;
    categories.highlight.tasks.forEach(t => { if(completedTasks[t.id]) highCount++; });
    const highCapped = Math.min(highCount, categories.highlight.required);
    document.getElementById('highlight-status').textContent = `${highCount} / ${categories.highlight.required}`;
    document.getElementById('highlight-status').style.color = highCount >= categories.highlight.required ? 'var(--success)' : 'var(--primary-neon)';
    currentTotal += highCapped;
    
    // Update labels
    const scoreLabel = document.getElementById('ap-score');
    scoreLabel.textContent = `${currentTotal} / ${totalRequired}`;
    if (currentTotal >= totalRequired) {
        scoreLabel.style.color = 'var(--success)';
        scoreLabel.textContent = "COMPLETE!";
        if (!window.confettiFired) {
            fireConfetti();
            window.confettiFired = true;
        }
    } else {
        scoreLabel.style.color = '#fff';
        window.confettiFired = false;
    }
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const percentage = Math.min((currentTotal / totalRequired) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    if(percentage === 100) {
        progressBar.style.background = "var(--success)";
    } else {
        progressBar.style.background = "linear-gradient(90deg, var(--primary-neon), var(--secondary-neon))";
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);

function fireConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
}
