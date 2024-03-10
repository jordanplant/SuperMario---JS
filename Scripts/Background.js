const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the sprite sheet
const spriteSheet = new Image();
spriteSheet.src = '/tiles.png'; 
const characterSheet = new Image();
characterSheet.src = '/characters.gif'; 

// Define the coordinates and dimensions of the portion of the sprite sheet you want to access
const sourceX = 0; 
const sourceY = 0; 
const sourceWidth = 16;
const sourceHeight = 16; 

// Define the size of the drawn portion on the canvas
const destWidth = sourceWidth * 2;
const destHeight = sourceHeight * 2;

// Function to draw the Floor
function drawFloor() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the number of times to repeat the background horizontally and vertically
  const repeatX = Math.ceil(canvas.width / destWidth) + 1;
  const repeatY = Math.min(Math.ceil(canvas.height / destHeight) + 1, 3);

  // Position the floor at the bottom of the container
  const startY = canvas.height - (repeatY * destHeight);

  // Loop to draw the background vertically
  for (let i = 0; i < repeatY; i++) {
    const posY = startY + (i * destHeight);

    // Loop to draw the background horizontally
    for (let j = 0; j < repeatX; j++) {
      const posX = j * destWidth;

      ctx.drawImage(spriteSheet, sourceX, sourceY, sourceWidth, sourceHeight, posX, posY, destWidth, destHeight);
    }
  }
}

// Function to draw clouds
function drawClouds() {
  // Define cloud position and scale
  const clouds = [
      { x: 100, y: 50, scale: 2 },
      { x: 300, y: 100, scale: 1.2 },
      { x: 500, y: 80, scale: 2 },
      { x: 700, y: 120, scale: 2.5 }
  ];

  // Original size of the cloud from the sprite sheet
  const cloudOriginalWidth = 40;
  const cloudOriginalHeight = 32; 

  // Source position of the cloud in the sprite sheet
  const cloudSourceX = 0;
  const cloudSourceY = 350;

  // Draw each cloud at its specified position
  clouds.forEach(cloud => {
      const cloudWidth = cloudOriginalWidth * cloud.scale;
      const cloudHeight = cloudOriginalHeight * cloud.scale;

      ctx.drawImage(spriteSheet, cloudSourceX, cloudSourceY, cloudOriginalWidth, cloudOriginalHeight, cloud.x, cloud.y, cloudWidth, cloudHeight);
  });
}

// Function to draw a brick
function drawPlainBrick(x, y) {
    // Original size of the brick from the sprite sheet
    const brickOriginalWidth = 16;
    const brickOriginalHeight = 16; 
    
    // Scale factor
    const scale = 2; 
    
    // Calculate scaled dimensions
    const brickWidth = brickOriginalWidth * scale; 
    const brickHeight = brickOriginalHeight * scale; 
    
    // Source position of the brick in the sprite sheet
    const brickSourceX = 32;
    const brickSourceY = 0; 
    
    // Draw the brick
    ctx.drawImage(spriteSheet, brickSourceX, brickSourceY, brickOriginalWidth, brickOriginalHeight, x, y, brickWidth, brickHeight);
}

// Function to draw a question mark
function drawQuestion(x, y) {
    // Original size of the question mark from the sprite sheet
    const questionOriginalWidth = 16;
    const questionOriginalHeight = 16; 
    
    // Scale factor
    const scale = 2;
    
    // Calculate scaled dimensions
    const questionWidth = questionOriginalWidth * scale; 
    const questionHeight = questionOriginalHeight * scale; 
    
    // Source position of the question mark in the sprite sheet
    const questionSourceX = 384;
    const questionSourceY = 0; 
    
    // Draw the question mark
    ctx.drawImage(spriteSheet, questionSourceX, questionSourceY, questionOriginalWidth, questionOriginalHeight, x, y, questionWidth, questionHeight);
}

//NEED TO ADD A FUNCTION TO REPLACE THE QUESTION MARK WITH A PLAIN BOX IF ACTIVATED

// Function to draw bricks, question mark, and bricks
function drawBricks() {

    drawPlainBrick(200, 200);

    drawQuestion(232, 200);
    
    drawPlainBrick(264, 200);
    drawPlainBrick(296, 200);
}

// Function to draw a coin
function drawCoin(x, y) {
  // Original size of the coin from the sprite sheet
  const coinOriginalWidth = 16; 
  const coinOriginalHeight = 15.5; 
  
  // Scale factor
  const scale = 2; 
  
  // Calculate scaled dimensions
  const coinWidth = coinOriginalWidth * scale; 
  const coinHeight = coinOriginalHeight * scale; 
  
  // Source position of the coin in the sprite sheet
  const coinSourceX = 385; 
  const coinSourceY = 16.5; 
  
  // Draw the coin at the specified position
  ctx.drawImage(spriteSheet, coinSourceX, coinSourceY, coinOriginalWidth, coinOriginalHeight, x, y, coinWidth, coinHeight);
}

function drawCoins() {
  drawCoin(200, 168);
  drawCoin(232, 168);
  drawCoin(264, 168);
  drawCoin(296, 168);
}

// Define the size of each frame in the character sprite sheet
const frameWidth = 18; 
const frameHeight = 34; 

// Define the starting X coordinate of the frame for facing right and left

const frameXRight = 256;
const frameXLeft = 238; 

const frameJumpRight = 368; 
const frameJumpLeft = 128; 
// Function to draw the character at a static position
function drawStaticCharacter(x, y, isFacingRight, isJumping) {
  let frameX;

  if (isJumping) {
      frameX = isFacingRight ? frameJumpRight : frameJumpLeft;
  } else {
      frameX = isFacingRight ? frameXRight : frameXLeft;
  }

  const frameY = 0; 
  
  ctx.drawImage(characterSheet, frameX, frameY, frameWidth, frameHeight, x, y, frameWidth * 2, frameHeight * 2);
}

// Define the frame number for jumping
let jumpFrame = 0;

// Define character position and direction
let characterX = 150;
let characterY = 150;
let isFacingRight = true; // Character initially faces right

// Define character jump properties
const jumpHeight = 100; 
const jumpSpeed = 5; 

// Define character ground level
const groundLevel = canvas.height - destHeight - 130; 

// Define character jump status
let isJumping = false;
let jumpStartY = 0;

// Function to handle keyboard events
function handleKeyDown(event) {
  switch (event.key) {
      case 'ArrowLeft':
          characterX -= 10; 
          isFacingRight = false; 
          break;
      case 'ArrowRight':
          characterX += 10; 
          isFacingRight = true; 
          break;
      case 'ArrowUp':
          if (!isJumping) {
              startJump(); 
          }
          break;
  }
}

// Function to start the jump
function startJump() {
  isJumping = true;
  jumpStartY = characterY;
}

// Function to update the character's position during the jump
function updateJump() {
  if (isJumping) {
      characterY -= jumpSpeed;
      if (characterY <= jumpStartY - jumpHeight) {
          // Reached the peak of the jump
          isJumping = false;
          jumpFrame = 0; // Reset jump frame when jump ends
      }
  } else if (characterY < groundLevel) {
      // Simulate falling back to the ground
      characterY += jumpSpeed;
      if (characterY >= groundLevel) {
          characterY = groundLevel; // Ensure character is at ground level
      }
  }
}

// Add event listener to listen for keydown events
document.addEventListener('keydown', handleKeyDown);

// Function to update the game
function updateGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the floor, clouds, bricks, and coins
  drawFloor();
  drawClouds();
  drawBricks();
  drawCoins();

  // Update character position during jump
  updateJump();

  // Draw the character at the static position
  drawStaticCharacter(characterX, characterY, isFacingRight, isJumping);

  // Request the next frame
  requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();
