export const GAME_CONFIG = {
  SPEED: 7,
  BRICK_COLOR: '#0095DD',
  PADDLE_WIDTH: 75,
  PADDLE_HEIGHT: 10,
  BALL_RADIUS: 10,
  MAX_ANGLE: Math.PI / 3,
  soundObj: {
    wallHit: '/sounds/wallHit.mp3',
    bricksHit: '/sounds/bricksHit.mp3',
    levelUp: '/sounds/levelUp.mp3',
    eatBuff: '/sounds/eatBuff.mp3',
  },
  brick: {
    width: 75,
    height: 20,
    color: '#0095DD',
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30,
  },
};
