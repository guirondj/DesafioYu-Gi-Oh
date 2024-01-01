const state={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox:document.getElementById("score_points"),
    },

    cardSprites:{
        avatar:document.getElementById("card_image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type"),
    },

    fildCards:{
        player:document.getElementById("player-field-card"),
        computer:document.getElementById("computer-field-card"),
    },

     playerSides:{
         player1: "player-cards",
         player1Box: document.querySelector("#player-cards"),
         computer: "computer- card",
         computerBox: document.querySelector("#computer-cards"),
    },

    actions:{
        button:document.getElementById("next-duel"),
    },
    
};

const pathImages= "./src/assets/icons/";

const playerSides={
     player1: "player-cards",
     computer: "computer-cards",
};

const cardData = [
    {
        id:0,
        nome:"blue Eyes white Dragon",
        type:"paper",
        img: `${pathImages}dragon.png`,
        winOf:[1],
        loseOf:[2],
    },

    {
        id:1,
        nome:"Dark Magician",
        type:"rock",
        img: `${pathImages}magician.png`,
        winOf:[2],
        loseOf:[0],
    },

    {
        id:2,
        nome:"exodia",
        type:"scissors",
        img: `${pathImages}exodia.png`,
        winOf:[0],
        loseOf:[1],
    },
];

async function getRamdomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "65px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
};

async function setCardsField(cardId){

    await removeAllCardsImages();

    let computerCardId = await getRamdomCardId();

    await showHiddenCardFieldsImage(true);

    await hiddenCardDetails();    

    await drawCArdsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await upDateScore();
    await drawButton(duelResults);
};

async function drawCArdsInField(cardId, computerCardId){
    state.fildCards.player.src = cardData[cardId].img;
    state.fildCards.computer.src = cardData[computerCardId].img;
};

async function showHiddenCardFieldsImage(value){
    if(value === true){
        state.fildCards.player.style.display = "block";
        state.fildCards.computer.style.display = "block";
    };

    if(value === false){
        state.fildCards.player.style.display = "none";
        state.fildCards.computer.style.display = "none";
    };
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText= "";
    state.cardSprites.type.innerText= "";
}

async function drawButton(Text){
    state.actions.button.innerText =Text.toUpperCase();
    state.actions.button.style.display = "block";
};

async function upDateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId];
    if(playerCard.winOf.includes(computerCardId)){
        duelResults= "WIN";
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "LOSE";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
};

async function removeAllCardsImages(){
    let {computerBox, player1Box} = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
};

async function drawSelectCard(index){
    state.cardSprites.name.innerText = cardData[index].nome;
    state.cardSprites.type.innerText = "attibute: " + cardData[index].type;
    state.cardSprites.avatar.src = cardData[index].img;
};

async function drawCards(cardNumbers, fieldSide){
    for(let i=0; i < cardNumbers; i++){
        const randomIdCard = await getRamdomCardId();

        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    };
};

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fildCards.player.style.display= "none";
    state.fildCards.computer.style.display= "none";

    init();
};

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try{
        audio.play();
    } catch{}
    
}

function init(){
    showHiddenCardFieldsImage(false);
    
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
};

init();