
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("test-API JS imported successfully!");
  },
  false
);


// GOAL : The likes !!! And the clickable images // And the accordion. 

// AJAX FUNCTIONS - CONNECTING WITH THE BACKEND.


// EVENT LISTENING. 

function reviewHandler() {
  document.getElementById("collapseExample").classList.toggle("collapse");
}

const reviewBtn = document.getElementById("reviewBtn");
reviewBtn.onclick = reviewHandler;

const imageBtn = document.getElementById("imageBtn");
imageBtn.onclick = reviewHandler;

const profileBtn = document.getElementById("pictureBtn");
profileBtn.onclick = reviewHandler;