// Credit: crckrKD

const createTimer = (element, timeLimit = 0, radius = 20) => {
  if(!element) return;

  const WARNING_THRESHOLD = 10;
  const ALERT_THRESHOLD = 5;
  
  const TIME_LIMIT = timeLimit;
  const TIMER_RADIUS = radius;
  const FONT_SIZE = TIMER_RADIUS < 10 ? 10 : TIMER_RADIUS;
  const SVG_VIEW = TIMER_RADIUS*4;
  const FULL_DASH_ARRAY = Math.ceil(2*Math.PI*TIMER_RADIUS);
  
  const COLOR_CODES = {
      info: {
          color: "green"
      },
      warning: {
          color: "orange",
          threshold: WARNING_THRESHOLD
      },
      alert: {
          color: "red",
          threshold: ALERT_THRESHOLD
      }
  };
  
  let timePassed = 0;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;
  let remainingPathColor = COLOR_CODES.info.color;
  
  const containerElement = document.createElement('div');
  const svgWrapper = document.createElement('div');
  svgWrapper.classList.add('base-timer');
  svgWrapper.style = `width: ${SVG_VIEW}px; height: ${SVG_VIEW}px`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('base-timer__svg');
  svg.setAttribute('viewBox', `0 0 ${SVG_VIEW} ${SVG_VIEW}`);
  svgWrapper.appendChild(svg);
  
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.classList.add('base-timer__circle');
  svg.appendChild(g);
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.classList.add('base-timer__path-elapsed');
  circle.setAttribute('cx', SVG_VIEW/2);
  circle.setAttribute('cy', SVG_VIEW/2);
  circle.setAttribute('r', TIMER_RADIUS*2);
  g.appendChild(circle);
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-dasharray', FULL_DASH_ARRAY);
  path.setAttribute('stroke-width', TIMER_RADIUS*2);
  path.classList.add(`base-timer__path-remaining`);
  path.classList.add(remainingPathColor);
  path.setAttribute('d', `M ${SVG_VIEW/2}, ${SVG_VIEW/2}
    m ${-TIMER_RADIUS}, 0
    a ${TIMER_RADIUS},${TIMER_RADIUS} 0 1,0 ${TIMER_RADIUS*2},0
    a ${TIMER_RADIUS},${TIMER_RADIUS} 0 1,0 ${-TIMER_RADIUS*2},0`);
  g.appendChild(path);
  
  containerElement.appendChild(svgWrapper);
  
  const timerText = document.createElement('div');
  timerText.classList.add('base-timer__label');
  timerText.style = `font-size: ${FONT_SIZE}px`;
  timerText.innerHTML = formatTime(timeLeft);
  containerElement.appendChild(timerText);
  
  
  startTimer();
  
  function onTimesUp() {
      clearInterval(timerInterval);
  }
  
  function startTimer() {
      timerInterval = setInterval(() => {
          timePassed = timePassed += 1;
          timeLeft = TIME_LIMIT - timePassed;
          timerText.innerHTML = formatTime(
              timeLeft
          );
          setCircleDasharray();
          setRemainingPathColor(timeLeft);
  
          if (timeLeft === 0) {
              onTimesUp();
          }
      }, 1000);
  }
  
  function formatTime(time) {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;
  
      if (seconds < 10) {
          seconds = `0${seconds}`;
      }
  
      return `${minutes}:${seconds}`;
  }
  
  function setRemainingPathColor(timeLeft) {
      const {
          alert,
          warning,
          info
      } = COLOR_CODES;
      if (timeLeft <= alert.threshold) {
          path
              .classList.remove(warning.color);
          path
              .classList.add(alert.color);
      } else if (timeLeft <= warning.threshold) {
          path
              .classList.remove(info.color);
          path
              .classList.add(warning.color);
      }
  }
  
  function calculateTimeFraction() {
      const rawTimeFraction = timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }
  
  function setCircleDasharray() {
      const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} ${FULL_DASH_ARRAY}`;
      path
          .setAttribute("stroke-dasharray", circleDasharray);
  }

  document.body.appendChild(containerElement);
}

createTimer(document.body, 300, 5);