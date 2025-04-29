import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG } from '@/configs/gameConfigs';
import styles from '@/styles/gamePage.module.scss';

export default function GamePage() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const ballsRef = useRef([]); // 存球資料
  const paddleXRef = useRef(0);
  const [score, setScore] = useState(0);
  const {
    SPEED,
    BRICK_COLOR,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    BALL_RADIUS,
    MAX_ANGLE,
    brick,
    soundObj,
  } = GAME_CONFIG;

  let animationId;
  let isPaused = true;

  let canvasWidth = 800;
  let canvasHeight = 600;

  let x = canvasWidth / 2;
  let y = canvasHeight - 30;
  let dx = SPEED;
  let dy = SPEED;
  let ballColor = '#111111';
  let paddleX = (canvasWidth - PADDLE_WIDTH) / 2;
  // 板子中心點
  const paddleCenter = paddleX + PADDLE_WIDTH / 2;
  let rightPressed = false;
  let leftPressed = false;
  let interval = 0;

  // 分數
  let levelScore = 0;
  // const scoreCount = document.querySelector(".scoreCount");
  // 磚塊初始化
  let brickColumnCount =
    Math.floor(800 / (brick.width + brick.padding * 2)) + 1;
  let brickRowCount = 1;
  let bricks = [];
  let levelScoreTotal = 0;
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
      if (bricks[c][r].status === 1) {
        levelScoreTotal += 1;
      }
    }
  }

  let ballsPool = [
    {
      x: x,
      y: y,
      dx: dx + Math.random() * 2 - 1,
      dy: dy + Math.random() * 2 - 1,
      radius: BALL_RADIUS,
      color: randomColor(),
    },
  ];

  let buffBalls = [];

  function randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const playSound = (src) => {
    const audio = new Audio(src);
    audio.play().catch((err) => {
      console.warn('Audio play blocked:', err.message);
    });
  };

  function initLevel() {
    setScore(0);
    levelScore = 0;
    // const scoreCount = document.querySelector(".scoreCount");
    // 磚塊初始化
    initScreen();
    brickColumnCount = Math.floor(800 / (brick.width + brick.padding * 2)) + 1;
    brickRowCount = 1;
    bricks = [];
    levelScoreTotal = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
        if (bricks[c][r].status === 1) {
          levelScoreTotal += 1;
        }
      }
    }
  }

  function initScreen() {
    ballsPool = [
      {
        x: x,
        y: y,
        dx: dx + Math.random() * 2 - 1,
        dy: dy + Math.random() * 2 - 1,
        radius: BALL_RADIUS,
        color: randomColor(),
      },
    ];
    buffBalls = [];
  }

  const rightPressedRef = useRef(false);
  const leftPressedRef = useRef(false);
  function draw(ctx) {
    // if (isPaused) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // drawBall();
    updatePaddle();
    drawPaddle(ctx);
    drawBalls(ctx);
    collisionDetection();
    updateBalls(ctx);
    drawBricks(ctx);

    animationRef.current = requestAnimationFrame(() => draw(ctx));
  }

  function updateBalls() {
    if (ballsPool.length <= 0) {
      // getGameover();
      return;
    }

    for (let i = 0; i < ballsPool.length; i++) {
      const ball = ballsPool[i];
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + BALL_RADIUS > canvasWidth) {
        // playSound("wallHit");
        // 圓形碰到左邊或右邊
        ball.dx = -ball.dx;
        ball.x = canvasWidth - BALL_RADIUS;
        playSound(soundObj['wallHit']);
      } else if (ball.x - BALL_RADIUS < 0) {
        playSound(soundObj['wallHit']);
        // 圓形碰到左邊或右邊
        ball.dx = -ball.dx;
        ball.x = BALL_RADIUS;
      }

      if (ball.y - BALL_RADIUS < 0) {
        playSound(soundObj['wallHit']);

        // 圓形碰到上邊或下邊
        ball.dy = -ball.dy; // 反轉 y 軸速度
        ball.y = BALL_RADIUS;
      } else if (ball.y + BALL_RADIUS + PADDLE_HEIGHT > canvasHeight) {
        if (
          ball.x > paddleXRef.current &&
          ball.x < paddleXRef.current14 + PADDLE_WIDTH
        ) {
          const offset = (ball.x - paddleCenter) / (PADDLE_WIDTH / 2);
          const angle = offset * MAX_ANGLE; // 偏移量轉成角度
          // 根據反射角更新 dx 和 dy
          console.log(paddleX, paddleXRef.current);
          ball.dx = SPEED * Math.sin(angle);
          ball.dy = -Math.abs(SPEED * Math.cos(angle));
        } else if (ball.y + BALL_RADIUS > canvasHeight) {
          ballsPool.splice(i, 1); // 刪除離開畫布的 buff 圓球
          i--;
        }
      }
    }
  }

  function drawBalls(ctx) {
    for (var i = 0; i < ballsPool.length; i++) {
      const ball = ballsPool[i];
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    }
  }

  function drawPaddle(ctx) {
    ctx.beginPath();
    ctx.rect(
      paddleXRef.current,
      canvasHeight - PADDLE_HEIGHT,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );
    ctx.fillStyle = brick.color;
    ctx.fill();
    ctx.closePath();
  }

  function updatePaddle() {
    if (rightPressedRef.current) {
      paddleXRef.current = Math.min(
        paddleXRef.current + 7,
        canvasWidth - PADDLE_WIDTH
      );
    } else if (leftPressedRef.current) {
      paddleXRef.current = Math.max(paddleXRef.current - 7, 0);
    }
  }

  function drawBricks(ctx) {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r] && bricks[c][r].status === 1) {
          const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
          const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brick.width, brick.height);
          ctx.fillStyle = brick.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          for (let i = 0; i < ballsPool.length; i++) {
            if (
              ballsPool[i].x > b.x &&
              ballsPool[i].x < b.x + brick.width &&
              ballsPool[i].y > b.y &&
              ballsPool[i].y < b.y + brick.height
            ) {
              console.log(ballsPool[i]);
              playSound(soundObj['bricksHit']);
              ballsPool[i].dy = -ballsPool[i].dy;
              b.status = 0;
              // const drop = getRandomDrop();
              // if (drop) {
              //   buffBalls.push({
              //     name: drop.name,
              //     x: b.x + gameConfig.brick.width / 2,
              //     y: b.y,
              //     radius: 7,
              //     speed: 1,
              //     effect: drop.effect, // 掉落的特效
              //     color: drop.color, // 掉落的特效
              //   }); // 應用掉落效果
              // }
              // score++;
              // levelScore++;
              // console.log(levelScoreTotal);
              // if (levelScore === levelScoreTotal) {
              //   cancelAnimationFrame(animationId);
              //   isPaused = true;
              //   levelUp();
              //   initScreen();
              //   playSound('levelUp');
              //   levelScore = 0; // 重設關卡分數
              //   resetBricks();

              //   setTimeout(() => {
              //     x = canvas.width / 2;
              //     y = canvas.height - 30;
              //     isPaused = false;
              //     animationId = requestAnimationFrame(draw); // 重新開始動畫
              //   }, 5000);
              // }
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    paddleXRef.current = (canvasWidth - PADDLE_WIDTH) / 2;
    ballsRef.current = [
      {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        dx: SPEED,
        dy: SPEED,
        color: '#0d5cab',
      },
    ];
    animationRef.current = requestAnimationFrame(() => draw(ctx));
    const handleMouseMove = (e) => {
      const relativeX = e.clientX - canvas.getBoundingClientRect().left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleXRef.current = relativeX - 75 / 2; // 假設 paddle width = 75
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressedRef.current = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressedRef.current = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressedRef.current = false;
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressedRef.current = false;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };

    // return () => ;
  }, []);

  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center ${styles.game}`}
      >
        <canvas ref={canvasRef} width={800} height={600} className="bg-light" />
      </div>
    </>
  );
}
