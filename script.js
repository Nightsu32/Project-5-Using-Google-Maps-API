let map;
let currentQuestion = 0;
let correctCount = 0;
let incorrectCount = 0;
let rectangles = [];

const locations = [
  {
    name: "Citrus Hall",
    bounds: {
      north: 34.24075,
      south: 34.24025,
      east: -118.52745,
      west: -118.52820
    }
  },
  {
    name: "University Library",
    bounds: {
      north: 34.24025,
      south: 34.23935,
      east: -118.52915,
      west: -118.53020
    }
  },
  {
    name: "Bayramian Hall",
    bounds: {
      north: 34.24110,
      south: 34.24030,
      east: -118.53070,
      west: -118.53175
    }
  },
  {
    name: "Jacaranda Hall",
    bounds: {
      north: 34.24215,
      south: 34.24115,
      east: -118.52685,
      west: -118.52810
    }
  },
  {
    name: "Student Recreation Center",
    bounds: {
      north: 34.24005,
      south: 34.23905,
      east: -118.52460,
      west: -118.52580
    }
  }
];

function initMap() {
  const csunCenter = {
    lat: 34.2401,
    lng: -118.5288
  };

  map = new google.maps.Map(document.getElementById("map"), {
    center: csunCenter,
    zoom: 16,
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    keyboardShortcuts: false,
    gestureHandling: "none",
    mapTypeId: "roadmap"
  });

  map.addListener("dblclick", function(event) {
    checkAnswer(event.latLng);
  });

  showQuestion();
}

function showQuestion() {
  const questionBox = document.getElementById("questionBox");

  if (currentQuestion < locations.length) {
    questionBox.textContent =
      "Where is " + locations[currentQuestion].name + "?";
  } else {
    endGame();
  }
}

function checkAnswer(clickedLocation) {
  if (currentQuestion >= locations.length) {
    return;
  }

  const location = locations[currentQuestion];
  const bounds = location.bounds;

  const clickedLat = clickedLocation.lat();
  const clickedLng = clickedLocation.lng();

  const isCorrect =
    clickedLat <= bounds.north &&
    clickedLat >= bounds.south &&
    clickedLng <= bounds.east &&
    clickedLng >= bounds.west;

  if (isCorrect) {
    correctCount++;
    showFeedback("Your answer is correct!", "correct");
    drawRectangle(bounds, "green");
    addHistory(location.name, "Correct");
  } else {
    incorrectCount++;
    showFeedback("Sorry, wrong location.", "incorrect");
    drawRectangle(bounds, "red");
    addHistory(location.name, "Incorrect");
  }

  currentQuestion++;

  setTimeout(function() {
    clearFeedback();
    showQuestion();
  }, 1000);
}

function showFeedback(message, className) {
  const feedbackBox = document.getElementById("feedbackBox");
  feedbackBox.textContent = message;
  feedbackBox.className = className;
}

function clearFeedback() {
  const feedbackBox = document.getElementById("feedbackBox");
  feedbackBox.textContent = "";
  feedbackBox.className = "";
}

function drawRectangle(bounds, color) {
  const rectangle = new google.maps.Rectangle({
    strokeColor: color,
    strokeOpacity: 0.9,
    strokeWeight: 3,
    fillColor: color,
    fillOpacity: 0.25,
    map: map,
    bounds: bounds
  });

  rectangles.push(rectangle);
}

function addHistory(locationName, result) {
  const history = document.getElementById("history");

  const item = document.createElement("div");
  item.className = "historyItem";
  item.textContent = locationName + " - " + result;

  history.appendChild(item);
}

function endGame() {
  document.getElementById("questionBox").textContent = "Quiz Complete!";

  document.getElementById("finalScore").innerHTML =
    correctCount + " Correct, " + incorrectCount + "<br>Incorrect";

  document.getElementById("restartButton").style.display = "block";
}

function restartGame() {
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;

  document.getElementById("finalScore").textContent = "";
  document.getElementById("history").innerHTML = "";
  document.getElementById("restartButton").style.display = "none";

  for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].setMap(null);
  }

  rectangles = [];

  clearFeedback();
  showQuestion();
}