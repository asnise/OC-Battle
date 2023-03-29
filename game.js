let player = {
  name: "Aerth",
  health: 100,
  maxHealth: 100,
  skills: [],
  attack: function (target, skill) {
    let damage = skill.damage || 0;
    let healing = skill.healing || 0;
    let block = skill.block || 0;
    let poison = skill.poison || 0;
    let poisonTurns = skill.poison_turns || 0;
    let critical_max = 100;
    let critical_defult = 10;
    let critical_dmg = 2;
    let critical_rng = Math.floor(Math.random() * critical_max);
    console.log(critical_rng)

    if (damage > 0) {
      if(critical_rng < critical_defult)
      {
        target.health -= damage * critical_dmg;
        let message = `${this.name} used ${skill.name} and dealt ${damage * critical_dmg} critical! damage to ${target.name}.`;
        return message;
      }
      else
      {
        target.health -= damage;
        let message = `${this.name} used ${skill.name} and dealt ${damage} damage to ${target.name}.`;
        return message;
      }

    } else if (healing > 0) {
      this.health = Math.min(this.health + healing, this.maxHealth);
      let message = `${this.name} used ${skill.name} and healed for ${healing} health.`;
      return message;
    } else if (block > 0) {
      this.block = block;
      let message = `${this.name} used ${skill.name} and gained ${block} block.`;
      return message;
    } else if (poison > 0) {
      target.poisoned = true;
      target.poisonDamage = poison;
      target.poisonTurns = poisonTurns;
      let message = `${this.name} used ${skill.name} and poisoned ${target.name}.`;
      return message;
    }
  },
  poisoned: false,
  poisonDamage: 0,
  poisonTurns: 0
};

let enemy = {
  name: "Enemy",
  health: 100,
  maxHealth: 100,
  skills: [],
  attack: function (target, skill) {
    let damage = skill.damage || 0;
    let healing = skill.healing || 0;
    let block = skill.block || 0;
    let poison = skill.poison || 0;
    let poisonTurns = skill.poison_turns || 0;
    let critical_max = 100;
    let critical_defult = 10;
    let critical_dmg = 2;
    let critical_rng = Math.floor(Math.random() * critical_max);
    console.log(critical_rng)

    if (damage > 0) {
      if(critical_rng < critical_defult)
      {
        target.health -= damage * critical_dmg;
        let message = `${this.name} used ${skill.name} and dealt ${damage * critical_dmg} critical! damage to ${target.name}.`;
        return message;
      }
      else
      {
        target.health -= damage;
        let message = `${this.name} used ${skill.name} and dealt ${damage} damage to ${target.name}.`;
        return message;
      }


    } else if (healing > 0) {
      this.health = Math.min(this.health + healing, this.maxHealth);
      let message = `${this.name} used ${skill.name} and healed for ${healing} health.`;
      return message;
    } else if (block > 0) {
      this.block = block;
      let message = `${this.name} used ${skill.name} and gained ${block} block.`;
      return message;
    } else if (poison > 0) {
      target.poisoned = true;
      target.poisonDamage = poison;
      target.poisonTurns = poisonTurns;
      let message = `${this.name} used ${skill.name} and poisoned ${target.name}.`;
      return message;
    }
  },
  poisoned: false,
  poisonDamage: 0,
  poisonTurns: 0
};


let EndGame = false;

let playerHealthBar = document.getElementById("player-health_bar");
let enemyHealthBar = document.getElementById("enemy-health_bar");

let isPlayerTurn = true;

function loadSkills() {
  fetch('skills.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load skill data');
      }
      return response.json();
    })
    .then(data => {
      player.skills = data;
      enemy.skills = data;
      createSkillButtons();
    })
    .catch(error => {
      console.error(error);
    });
}

function createSkillButtons() {
  let skillButtons = document.getElementById("skill-buttons");
  let enemy_hps = document.getElementById("enemy_name");
  enemy_hps.innerText = enemy.name;

  let player_hps = document.getElementById("player_name");
  player_hps.innerText = player.name;

  skillButtons.innerHTML = "";

  let usedIndexes = [];
  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random() * player.skills.length);
    while (usedIndexes.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * player.skills.length);
    }
    usedIndexes.push(randomIndex);

    let skill = player.skills[randomIndex];
    let button = document.createElement("button");
    button.innerText = skill.name + (skill.damage != null ? " DMG : " + skill.damage : "");
    button.classList.add("skill-button");
    button.addEventListener("click", () => attackButtonClicked(skill));
    skillButtons.appendChild(button);
  }
}


function attackButtonClicked(skill) {
  if (isPlayerTurn && !EndGame) {
    let message = player.attack(enemy, skill);
    if (enemy.poisoned) {
      if (enemy.poisonTurns != 0) {
        enemy.poisonTurns -= 1;
        enemy.health = enemy.health - enemy.poisonDamage;
      }
      else {
        enemy.poisoned = false;
      }
    }
    displayMessage(message);
    displayHealth();
    checkWinLoss();
    isPlayerTurn = false;
    setTimeout(enemyTurn, 1000);
  }
}

function enemyTurn() {
  if (!EndGame) {
    let skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
    let message = enemy.attack(player, skill);

    if (player.poisoned) {
      if (player.poisonTurns != 0) {
        player.poisonTurns -= 1;
        player.health = player.health - player.poisonDamage;
      }
      else {
        player.poisoned = false;
      }
    }

    displayMessage(message);
    displayHealth();
    checkWinLoss();
    isPlayerTurn = true;
  }
}

function displayMessage(message) {
  let messageBox = document.getElementById("message-box");
  messageBox.innerText = message;
}

function displayHealth() {
  
  if(player.health < 0)
  {
    player.health = 0
  }

  if(enemy.health < 0)
  {
    enemy.health = 0
  }
  let playerHealth = document.getElementById("player-health");
  playerHealth.innerText = player.health + "/" + player.maxHealth + (player.poisoned ? " (poisoned : " + player.poisonTurns + " )" : "");
  let enemyHealth = document.getElementById("enemy-health");
  enemyHealth.innerText = enemy.health + "/" + enemy.maxHealth + (enemy.poisoned ? " (poisoned : " + enemy.poisonTurns + " )" : "");


  updateHealthBar(playerHealthBar, player.health);
  updateHealthBar(enemyHealthBar, enemy.health);
}

function updateHealthBar(elementId, value) {
  elementId.style.width = value + "%";
}

function checkWinLoss() {
  if (player.health <= 0) {
    displayMessage("You lost!");
    EndGame = true;
  } else if (enemy.health <= 0) {
    displayMessage("You won!");
    EndGame = true;
  }
}


updateHealthBar(playerHealthBar, player.health);
updateHealthBar(enemyHealthBar, enemy.health);



displayHealth();
loadSkills();
