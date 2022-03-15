
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("test-API JS imported successfully!");
  },
  false
);

function reviewHandler() {
  console.log("hello");
  document.getElementById("collapseExample").classList.toggle("collapse");
}

function carouselHandler (e) {
  // const btn = e.target;
  // console.log(btn);
  // const parent = btn.parentElement;
  // console.log(parent);
  console.log('hello');
  const items = document.getElementsByClassName("carousel-item");
  console.log(items);
  Array.from(items).forEach((item) => item.classList.toggle("active"));
  console.log(items);

  // switch
}

// Ok il faut absolument le faire dans l'ordre, ou faire des scripts différents selon les pages.







const carouselBtn = document.getElementsByClassName("carouse");
console.log(carouselBtn);
Array.from(carouselBtn).forEach((btn) => btn.onclick = carouselHandler)


// STEP 1 : split bookContent. 

const bookcontent = document.getElementById("first-sentence")?.innerHTML;
const contentArr = bookcontent?.split(",");
console.log(contentArr);

function display (thing) {
  const papyrus = document.getElementById("papyrus");
      const paragraph = document.createElement("h6");
      paragraph.innerHTML = thing;
      paragraph.style.padding = "10px"
      paragraph.style.backgroundColor = "white";
      paragraph.style.width = "fit-content";
      papyrus.appendChild(paragraph);
}

function timedLoop() {
  setTimeout(function () {
    for (let i = 0 ; i < contentArr?.length ; i ++) {
      display(contentArr[i])
    }
  }, 2000)
  }
  
timedLoop();

const reviewBtn = document.getElementById("reviewBtn");
reviewBtn ? reviewBtn.onclick = reviewHandler : console.log("not this time")

// For the likes.

const likeBtn = document.getElementById("like");
const parent = likeBtn?.parentElement;

// J'essaie d'envoyer ça en payload tout simplement et voilà.

const likeHandler = () => {
  console.log("likeInProcess");
  console.log(parent[0].value);
}


likeBtn ? likeBtn.onclick = likeHandler : console.log("meh");


// const myInterval = setInterval(() => {
//   const bookcontent = document.getElementById("first-sentence");
//   console.log(bookcontent.innerHTML);
// }, 4000);

const profileBtn = document.getElementById("pictureBtn");
profileBtn.onclick = reviewHandler;

