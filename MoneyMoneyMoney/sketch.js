//Savannah Archinal 
// 2D Adventure Game 
// created with p5 and p5.js libraries 
//Money Money Money

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

//---

//-- MODIFY THIS for different speeds
var speed = 10;

//--- Your globals would go here

var bill;
var dollar;
var img;


//-- garbage!

const bottleIndex = 0;
const ogoIndex = 1;
const plasticbagIndex = 2;
const vapeIndex = 3;
const plasticringsIndex = 4;
var garbageSprites; // array of garbage sprites
var garbageSpriteInGameOverRoom;    // array, true if that sprite is in the game room
var hasSetupGarbage;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
//--- TEMPLATE STUFF: Don't change
clickablesManager = new ClickableManager('data/clickableLayout.csv');
adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
//---
}



// Setup the adventure manager
function setup() {
createCanvas(1280, 720);

//--- TEMPLATE STUFF: Don't change
// setup the clickables = this will allocate the array
clickables = clickablesManager.setup();
//---

// MODIFY THIS: change to initial position
playerAvatar = new Avatar("Player", 640, 400);
 
// MODIFY THIS: to make your avatar go faster or slower
playerAvatar.setMaxSpeed(20);

// MODIFY THIS: add your filenames here, right now our moving animation and standing animation are the same
playerAvatar.addMovingAnimation( 'assets/jeffy1.png', 'assets/jeffy4.png');
// playerAvatar.addStandingAnimation('assets/stand1.png', 'assets/stand4.png');

//--- TEMPLATE STUFF: Don't change
// use this to track movement from toom to room in adventureManager.draw()
adventureManager.setPlayerSprite(playerAvatar.sprite);

// this is optional but will manage turning visibility of buttons on/off
// based on the state name in the clickableLayout
adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
adventureManager.setup();

// call OUR function to setup additional information about the p5.clickables
// that are not in the array 
setupClickables(); 
//--

// adventureManager.changeState("Walkscreen2");

// setup the garbage
garbageSprites = [];
garbageSprites.push(new StaticSprite("bottle", 800,400, 'grab/bottle.png'));
garbageSprites.push(new StaticSprite("togo", 900,600, 'grab/togo.png'));
garbageSprites.push(new StaticSprite("plasticbag", 1100,300, 'grab/plasticbag.png'));
garbageSprites.push(new StaticSprite("vape",1000,100, 'grab/vape.png'));
garbageSprites.push(new StaticSprite("plasticrings",1000,550, 'grab/plasticrings.png'));
hasSetupGarbage = false;

garbageSpriteInGameOverRoom = [];
for( let i = 0; i < garbageSprites.length; i++ ) {
  garbageSpriteInGameOverRoom[i] = false;
}  
}

// Adventure manager handles it all!
function draw() {
//--- TEMPLATE STUFF: Don't change
// draws background rooms and handles movement from one to another
adventureManager.draw();

// draw the p5.clickables, in front of the mazes but behind the sprites 
clickablesManager.draw();
//---

//--- MODIFY THESE CONDITONALS
// No avatar for Splash screen or Instructions screen
if( adventureManager.getStateName() !== "Splash" && 
    adventureManager.getStateName() !== "Instructions" ) {
    
  //--- TEMPLATE STUFF: Don't change    
  // responds to keydowns
  checkMovement();

  // this is a function of p5.play, not of this sketch
  drawSprite(playerAvatar.sprite);

  if( playerAvatar.grabbable !== undefined ) {
    drawSprite(playerAvatar.grabbable.sprite);
  }
  //--

  playerAvatar.update();
} 

// setup garbage
if( hasSetupGarbage === false) {
  for( let i = 0; i < garbageSprites.length; i++ ) {
    garbageSprites[i].setup();
  }
  hasSetup = true;
}
}

// respond to W-A-S-D or the arrow keys
function checkMovement() {
var xSpeed = 0;
var ySpeed = 0;

// Check x movement
if(keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
  xSpeed = speed;
}
else if(keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
  xSpeed = -speed;
}

// Check y movement
if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
  ySpeed = speed;
}
else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
  ySpeed = -speed;
}

playerAvatar.setSpeed(xSpeed,ySpeed);
}
//

function mouseReleased() {
if( adventureManager.getStateName() === "Splash") {
  adventureManager.changeState("Instructions");
}
}

function keyPressed() {

if( adventureManager.getStateName() === "Gameover"  && key === ' ') {

  console.log("space pressed");
  if( playerAvatar.grabbable !== undefined ) {
    for( let i = 0; i < garbageSprites.length; i++ ) {
      // drop it if we have a sprite match
      

      if( garbageSprites[i].sprite === playerAvatar.grabbable.sprite ) {
        garbageSpriteInGameOverRoom[i] = true;
        playerAvatar.clearGrabbable();
        break;
      }
    }
  }
}

}


//-------------- CLICKABLE CODE  ---------------//

//--- TEMPLATE STUFF: Don't change 
function setupClickables() {
// All clickables to have same effects
for( let i = 0; i < clickables.length; i++ ) {
  clickables[i].onHover = clickableButtonHover;
  clickables[i].onOutside = clickableButtonOnOutside;
  clickables[i].onPress = clickableButtonPressed;
}
}
//--

//-- MODIFY THIS:
// tint when mouse is over
clickableButtonHover = function () {
this.color = "#92BD6A";
this.noTint = false;
// this.tint = "";
}


clickableButtonOnOutside = function () {
// backto our gray color
this.color = "#DBE689";
}

//--- TEMPLATE STUFF: Don't change 
clickableButtonPressed = function() {
// these clickables are ones that change your state
// so they route to the adventure manager to do this
adventureManager.clickablePressed(this.name); 
}
//

class InstructionsScreen extends PNGRoom {

preload() {

  img = loadImage('assets/gameoverimg.png');

  // These are out variables in the InstructionsScreen class
  this.textBoxWidth = (width/6)*4;
  this.textBoxHeight = (height/6)*4; 

  // hard-coded, but this could be loaded from a file if we wanted to be more elegant
  // this.instructionsText = "You are navigating through the interior space of your moods. There is no goal to this game, but just a chance to explore various things that might be going on in your head. Use the ARROW keys to navigate your avatar around.";
}


draw() {
  // tint down background image so text is more readable
  // tint(128);
    
  // this calls PNGRoom.draw()
  super.draw();
    
  // text draw settings
  fill(0);
  textAlign(CENTER);
  textSize(30);

  // Draw text in a box
  text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
}
}


class NPCRoom extends PNGRoom {
preload() {
  this.npc1 = new NPC("girl", 700, 500, 'assets/stand1.png','assets/stand4.png');
  this.npc1.addStandingAnimation('assets/stand1.png','assets/stand4.png');
  this.npc1.addSingleInteraction("in 2018 14.5 million tons were contributed to landfill as the hands of consumer culture. Pick up the single-use plastics to clean the city.");
  
  
  

  this.hasSetup = false;

  // define class varibles here, load images or anything else
}

draw() {


  if( this.hasSetup === false ) {
 
    
    // setup NPC 2
    this.npc1.setup();
    this.npc1.setPromptLocation(0,-100);

    this.hasSetup = true; 
  }
  // this calls PNGRoom.draw()
  super.draw();

  drawSprite(this.npc1.sprite);
  this.npc1.displayInteractPrompt(playerAvatar);

  
}

// custom code here to do stuff upon exiting room
unload() {
  // reset NPC interaction to beginning when entering room
  this.npc1.resetInteraction();
}

// custom code here to do stuff upon entering room
load() {
  // pass to PNGRoom to load image
  super.load();
  
  // Add custom code here for unloading
}

keyPressed() {
  if(key === ' ') {
    if(this.npc1.isInteracting(playerAvatar)) {
      this.npc1.continueInteraction();
    }
  }
}

}


class MiniRoom1 extends PNGRoom {
preload() {
    this.npc1 = new NPC("girl", 900, 500, 'assets/stand1.png','assets/stand4.png');
    this.npc1.addStandingAnimation('assets/stand1.png','assets/stand4.png');
    this.npc1.addSingleInteraction("Consumer habits drive climate change. Until large corporations fund a solution we must not remain complicit. Bring the single use plastics to the landfill to see where they actually go.");

  // this.bottle = new StaticSprite("bottle", 800,400, 'grab/bottle.png');
  // this.togo = new StaticSprite("togo", 900,600, 'grab/togo.png');
  // this.plasticbag = new StaticSprite("plasticbag", 1100,300, 'grab/plasticbag.png');
  // this.vape = new StaticSprite("vape",1000,100, 'grab/vape.png');
  // this.plasticrings = new StaticSprite("plasticrings",1000,550, 'grab/plasticrings.png');
  // this.hasSetup = false;
  // define class varibles here, load images or anything else
}


draw() {
  if( this.hasSetup  == false ) {
    
    this.npc1.setup();
    this.npc1.setPromptLocation(0,-100);

    
  }
  // this calls PNGRoom.draw()
  super.draw();

  // only draw sprite or do colliders if it is actually in this room
  for( let i = 0; i < garbageSprites.length; i++ ) {
    if( garbageSpriteInGameOverRoom[i] === false ) {
      drawSprite(garbageSprites[i].sprite);
    }
  }
  // drawSprite(bottle.sprite);
  // drawSprite(togo.sprite);
  // drawSprite(plasticbag.sprite);
  // drawSprite(vape.sprite);
  // drawSprite(plasticrings.sprite);


drawSprite(this.npc1.sprite);
  this.npc1.displayInteractPrompt(playerAvatar);

// collider only if not inrrom
for( let i = 0; i < garbageSprites.length; i++ ) {
  if( garbageSpriteInGameOverRoom[i] === false ) {
    if( playerAvatar.sprite.overlap(garbageSprites[i].sprite) ) {
      playerAvatar.setGrabbable(garbageSprites[i]);
    }
  }
}

  // check for overlap
  // if( playerAvatar.sprite.overlap(bottle.sprite) ) {
  //   playerAvatar.setGrabbable(bottle);

  // }

  // Add your code here
  // if( playerAvatar.sprite.overlap(togo.sprite) ) {
  //   playerAvatar.setGrabbable(togo);

  // }


// if( playerAvatar.sprite.overlap(plasticbag.sprite) ) {
//   playerAvatar.setGrabbable(plasticbag);
// }
// if( playerAvatar.sprite.overlap(vape.sprite) ) {
//   playerAvatar.setGrabbable(vape);
//   }
//   if( playerAvatar.sprite.overlap(plasticrings.sprite) ) {
//     playerAvatar.setGrabbable(plasticrings);
//   }
}
}


class Walkscreen2Room extends PNGRoom {
  preload() {
    this.npc2 = new NPC("celluser1", 1000, 500, 'grab/celluser1.png','grab/celluser2.png');
      // this.npc2.addStandingAnimation('grab/celluser1.png','grab/celluser2.png');
      this.npc2.addSingleInteraction("Must consume mindless media! I cant function without distraction!");
      this.npc3 = new NPC("cell2user1", 700, 400, 'grab/cell2user1.png','grab/cell2user4.png');
      this.npc3.addSingleInteraction("I must know what to buy, what to think, what to praise!");
      // this.npc3.addStandingAnimation('grab/cell2user1.png','grab/cell2user4.png');

      this.npc4 = new NPC("celluser2", 200, 300, 'grab/celluser1.png','grab/celluser2.png');
      this.npc4.addSingleInteraction("I cant belive they would ever post!");


      this.npc5 = new NPC("celluser3", 700, 600, 'grab/cell2user1.png','grab/cell2user4.png');
      this.npc5.addSingleInteraction("Kylie Jenner got a bbl now I want a bbl!");
      this.npc6 = new NPC("celluser4", 500, 200, 'grab/celluser1.png','grab/celluser2.png');
      this.npc6.addSingleInteraction("I love Shein! Its so trendy Im gonna pretend it's not a sweatshop!");
      this.npc7 = new NPC("celluser5", 500, 400, 'grab/cell2user1.png','grab/cell2user4.png');
      this.npc7.addSingleInteraction("Suddenly my mental health is dwindling!");

  bill = new StaticSprite("bill", 400,400, 'grab/dollar3.png');
  this.hasSetup = false;
  // define class varibles here, load images or anything else
}

// call the PNGRoom superclass's draw function to draw the background image
// and draw our code adter this
draw() {
  if( this.hasSetup  == false ) {
    bill.setup();
    this.hasSetup = true;
    this.npc2.setup();
    this.npc2.setPromptLocation(0,-100);
    this.npc3.setup();
    this.npc3.setPromptLocation(0,-100);
    this.npc4.setup();
    this.npc4.setPromptLocation(0,-100);
    this.npc5.setup();
    this.npc5.setPromptLocation(0,-100);
    this.npc6.setup();
    this.npc6.setPromptLocation(0,-100);
    this.npc7.setup();
    this.npc7.setPromptLocation(0,-100);
  }
  // this calls PNGRoom.draw()
  super.draw();
  drawSprite(bill.sprite);

  drawSprite(this.npc2.sprite);
  this.npc2.displayInteractPrompt(playerAvatar);

  drawSprite(this.npc3.sprite);
  this.npc3.displayInteractPrompt(playerAvatar);

  drawSprite(this.npc4.sprite);
  this.npc4.displayInteractPrompt(playerAvatar);

  drawSprite(this.npc5.sprite);
  this.npc5.displayInteractPrompt(playerAvatar);

  drawSprite(this.npc6.sprite);
  this.npc6.displayInteractPrompt(playerAvatar);

  drawSprite(this.npc7.sprite);
  this.npc7.displayInteractPrompt(playerAvatar);


  // check for overlap
  if( playerAvatar.sprite.overlap(bill.sprite) ) {
    playerAvatar.setGrabbable(bill);

  }
  // Add your code here
}
}
  // Add your code here


//-- done copy

class Walkscreen1Room extends PNGRoom {
preload() {
  this.npc9 = new NPC("girl", 500, 480, 'assets/stand1.png','assets/stand4.png');
  this.npc9.addStandingAnimation('assets/stand1.png','assets/stand4.png');
  this.npc9.addSingleInteraction("Consuming mass media will rot your brain and makes you hate yourself. Only consume neccasary items to fight consumer culture.");
  dollar = new StaticSprite("dollar", 400,200, 'grab/dollar1.png');
  this.hasSetup = false;
  // define class varibles here, load images or anything else
}

// call the PNGRoom superclass's draw function to draw the background image
// and draw our code adter this
draw() {
  if( this.hasSetup  == false ) {
    dollar.setup();
    this.hasSetup = true;
    this.npc9.setup();
    this.npc9.setPromptLocation(0,-100);
  }
  // this calls PNGRoom.draw()
  super.draw();
  drawSprite(dollar.sprite);
  drawSprite(this.npc9.sprite);
  this.npc9.displayInteractPrompt(playerAvatar);

  // check for overlap
  if( playerAvatar.sprite.overlap(dollar.sprite) ) {
    playerAvatar.setGrabbable(dollar);

  }
  // Add your code here
}
}
  // Add your code here

  


class GameOverRoom extends PNGRoom {
preload() {
  this.npc8 = new NPC("girl", 500, 520, 'assets/stand1.png','assets/stand4.png');
  this.npc8.addStandingAnimation('assets/stand1.png','assets/stand4.png');
  this.npc8.addSingleInteraction("Press SPACE to drop trash");
  this.hasSetup = false;
}

// call the PNGRoom superclass's draw function to draw the background image
// and draw our code adter this
draw() {

  this.npc8.setup();
    this.npc8.setPromptLocation(0,-100);
  // this calls PNGRoom.draw()
  super.draw();

  drawSprite(this.npc8.sprite);
  this.npc8.displayInteractPrompt(playerAvatar);
  // this calls PNGRoom.draw()
  super.draw();

  drawSprite(this.npc8.sprite);
  this.npc8.displayInteractPrompt(playerAvatar);

  let garbageCount = 0;
  for( let i = 0; i < garbageSprites.length; i++ ) {
    if(garbageSpriteInGameOverRoom[i] ) {
      garbageCount++;
      drawSprite(garbageSprites[i].sprite);
    }
  }

  if( garbageCount === garbageSprites.length ) {
    // game over — draw something here!
    console.log("gameover");
    background(img);

   

      
    }
  }
}

 
  


