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

  // Return the rectangle representing the brick for collision detection
  return {
      x: x,
      y: y,
      width: brickWidth,
      height: brickHeight
  };
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

  // Return the rectangle representing the question mark for collision detection
  return {
      x: x,
      y: y,
      width: questionWidth,
      height: questionHeight
  };
}


// Function to draw bricks, question mark, and bricks
function drawBricks() {
  // Array to store rectangles representing bricks and question marks for collision detection
  const bricksRects = [];

  // Draw bricks and question marks and store their rectangles
  bricksRects.push(drawPlainBrick(200, 200));
  bricksRects.push(drawQuestion(232, 200));
  bricksRects.push(drawPlainBrick(264, 200));
  bricksRects.push(drawPlainBrick(296, 200));

  // Return the array of rectangles for collision detection
  return bricksRects;
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

// Function to check collision between two rectangles
function isColliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}


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

// Object to track the state of arrow keys
const keysPressed = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false
};

// Function to handle keydown event
function handleKeyDown(event) {
  // Update keysPressed object based on the pressed key
  if (event.key in keysPressed) {
    keysPressed[event.key] = true;
  }
}

// Function to handle keyup event
function handleKeyUp(event) {
  // Update keysPressed object when key is released
  if (event.key in keysPressed) {
    keysPressed[event.key] = false;
  }
}

// Function to update character position based on keys pressed
function updateCharacterPosition() {
  // Check for combined movement
  if (keysPressed.ArrowLeft) {
    characterX -= 10;
    isFacingRight = false;
  }
  if (keysPressed.ArrowRight) {
    characterX += 10;
    isFacingRight = true;
  }
  if (keysPressed.ArrowUp && !isJumping) {
    startJump();
  }
}

// Add event listeners for keydown and keyup events
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Update character position continuously
setInterval(updateCharacterPosition, 1000 / 30); // Update approximately 30 times per second


// Function to start the jump
function startJump() {
  isJumping = true;
  jumpStartY = characterY;
}

// Function to update the character's position during the jump
function updateJump(bricksRects) {
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

  // Define rectangle for Mario
  const characterRect = {
    x: characterX,
    y: characterY,
    width: frameWidth * 2,
    height: frameHeight * 2
  };

  // Check collision with each brick
  let isCollidingWithBrick = false;
  for (let i = 0; i < bricksRects.length; i++) {
    if (isColliding(characterRect, bricksRects[i])) {
      if (
        // Check if character is coming from the side
        characterY + characterRect.height <= bricksRects[i].y || // Character is above the brick
        characterX + characterRect.width <= bricksRects[i].x || // Character is to the left of the brick
        characterX >= bricksRects[i].x + bricksRects[i].width // Character is to the right of the brick
      ) {
        // Allow the character to pass through the brick
        continue;
      } else if (characterY < bricksRects[i].y && !isJumping) {
        // If collision detected and not coming from the side and not jumping, set character's Y position to the top of the brick
        characterY = bricksRects[i].y - characterRect.height;
        isCollidingWithBrick = true;
      } else {
        // If collision detected from above or character is jumping, end the jump cycle and return to the ground
        characterY = bricksRects[i].y + bricksRects[i].height;
        isJumping = false; // End the jump
        jumpFrame = 0; // Reset jump frame
        break; // Exit the loop since the jump cycle ends
      }
    }
  }

  // If no collision with bricks and character is not jumping (i.e., not in mid-air)
  if (!isCollidingWithBrick && !isJumping && characterY + (frameHeight * 2) < groundLevel) {
    characterY += jumpSpeed;
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
  const bricksRects = drawBricks(); // Draw bricks and get their rectangles for collision detection
  drawCoins();

  // Update character position during jump
  updateJump(bricksRects);

  // Draw the character at the static position
  drawStaticCharacter(characterX, characterY, isFacingRight, isJumping);

  // Request the next frame
  requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();

