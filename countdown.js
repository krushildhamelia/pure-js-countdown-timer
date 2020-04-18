// Credit: Mateusz Rybczonec

const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const TIME_LIMIT = 20;
const TIMER_RADIUS = 100;
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

document.getElementById("app").innerHTML = `
<div class="base-timer" style="width: ${SVG_VIEW}px; height: ${SVG_VIEW}px">
  <svg class="base-timer__svg" viewBox="0 0 ${SVG_VIEW} ${SVG_VIEW}" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="${SVG_VIEW/2}" cy="${SVG_VIEW/2}" r="${TIMER_RADIUS*2}"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="${FULL_DASH_ARRAY}"
        stroke-width=${TIMER_RADIUS*2}
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M ${SVG_VIEW/2}, ${SVG_VIEW/2}
          m ${-TIMER_RADIUS}, 0
          a ${TIMER_RADIUS},${TIMER_RADIUS} 0 1,0 ${TIMER_RADIUS*2},0
          a ${TIMER_RADIUS},${TIMER_RADIUS} 0 1,0 ${-TIMER_RADIUS*2},0
        "
      ></path>
    </g>
  </svg>
</div>
<div id="base-timer-label" class="base-timer__label" style="font-size: ${TIMER_RADIUS/4}px">${formatTime(
    timeLeft
  )}</div>
`;

startTimer();

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
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
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
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
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}