
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
profileBtn ? profileBtn.onclick = reviewHandler : console.log("meh");


// Gérer le hover sur les cards.

function backgroundHandler (card, index, array) {
  console.log(array);
  const image = card.children[0].src;
  console.log(image, typeof image);
  // card.style.backgroundColor =  yellow;
  card.classList.add("bg-image");
  // card.classList.add("flip-2-ver-right-bck");
  card.style.backgroundImage = `url(${image.toString()})`;
  card.style.backgroundStyle = "cover";
  if (array === bestCard) {
    let otherBestCards = [];
    bestCard.forEach((card, i) => {
      if (i !== index)  otherBestCards.push(card);
    });
    otherBestCards.forEach((card) => card.classList.add("minified"));
  }
  if (array === catCard) {
  let otherCatCards = [];
  catCard.forEach((card, i) => {
    if (i !== index)  otherCatCards.push(card);
  });
  otherCatCards.forEach((card) => card.classList.add("minified"));
}
}

function backgroundHandlerSearch (card, index, array) {
  let otherSearchCards = [];
  array.forEach((card, i) => {
    if (i !== index)  otherSearchCards.push(card);
  });
  otherSearchCards?.forEach((card) => card.classList.add("minified"));
}

function backgroundRemover(card, index, array) {
  card.style.backgroundImage = "none";
  const minifiedBest = document.querySelectorAll("#author-best-card + .minified");
  console.log("119", minifiedBest);
  if (array === bestCard) Array.from(minifiedBest).forEach((mini) => mini.classList.remove("minified"));
  const minifiedCat = document.querySelectorAll("#author-cat-card + .minified");
  
  if (array === catCard) {
    console.log("122", minifiedCat);
    Array.from(minifiedCat).forEach((mini) => mini.classList.remove("minified"));
  }
}


function tagHandler (tag, index) {
  let otherTags = [];
  Array.from(catTag).forEach((cat, i) => {
    i !== index ? otherTags.push(cat) : console.log("not in the new array")
  })
  console.log(catTag.length, otherTags.length);
  otherTags.map((tag) => tag.classList.add("minified"));
}

function tagHandler2 (tag, index) {
  const minified = document.querySelectorAll(".minified");
  minified.forEach((mini) => mini.classList.remove("minified"));
  console.log("I don't want this function for now")

}

let searchCard = document.querySelectorAll("#author-card");
searchCard? searchCard = Array.from((searchCard)) : console.log("meh");
searchCard?.forEach((card, index) => card.onmouseover = (() => backgroundHandlerSearch(card, index)));
searchCard?.forEach((card, index) => card.onmouseout = (() => backgroundRemoverSearch(card, index)));

let catCard = document.querySelectorAll("#author-cat-card");
catCard ? catCard = Array.from(catCard) : console.log('meh');
catCard?.forEach((card, index, array) => card.onmouseover = (() => backgroundHandler(card, index, array)));
catCard?.forEach((card, index, array) => card.onmouseout = (() => backgroundRemover(card, index, array)));

let bestCard = document.querySelectorAll("#author-best-card");
bestCard ? bestCard = Array.from(bestCard) : console.log('meh');
// console.log(bestCard);
bestCard?.forEach((card, index, array) => card.onmouseover = (() => backgroundHandler(card, index, array)));
bestCard?.forEach((card, index, array) => card.onmouseout = (() => backgroundRemover(card, index, array)));

let catTag = document.querySelectorAll(".cat");
Array.from(catTag).forEach((tag, index) => tag.onmouseover = (() => tagHandler(tag, index)));
Array.from(catTag).forEach((tag, index) => tag.onmouseout = (() => tagHandler2(tag, index)));




// Carousel pour le profile.

// Il faut cette index to whoever has it active, like with a find.


let index = 0;

function carouselProfileHandler (e) {
  console.log(e);
  let btn = e;
  const id = btn.getAttribute("id");
  console.log(id);
  if (id === "next-profile-carousel") {
    allCarouselProfileElements[index].classList.remove('active');
    index === allCarouselProfileElements.length - 1 ? index = 0 : index += 1;
    allCarouselProfileElements[index].classList.add('active');
  }
  if (id === "prev-profile-carousel") {
    allCarouselProfileElements[index].classList.remove('active');
    index === 0 ? index += allCarouselProfileElements.length - 1 : index -= 1;
    allCarouselProfileElements[index].classList.add('active');
  }
}

let index2 = 0;

async function carouselProfileHandler2 (e) {
  console.log(e);
  let btn2 = e;
  let id2 = btn2.getAttribute("id");
  console.log(id2);
  if (id2 === "next-profile-carousel-2") {
    await allCarouselProfileElements2[index2].classList.remove('active');
   await index2 === allCarouselProfileElements2.length - 1 ? index2 = 0 : index2 += 1;
    await allCarouselProfileElements2[index2].classList.add('active');
  }
  if (id2 === "prev-profile-carousel-2") {
    allCarouselProfileElements2[index2].classList.remove('active');
    index2 === 0 ? index2 += allCarouselProfileElements2.length - 1 : index2 -= 1;
    allCarouselProfileElements2[index2].classList.add('active');
  }
}


// Actual active element.

let allCarouselProfileElements = document.querySelectorAll("div#relative-carousel-item-1");
allCarouselProfileElements = Array.from(allCarouselProfileElements);
const totalItems =  allCarouselProfileElements.length;

let allCarouselProfileElements2 = document.querySelectorAll("div#relative-carousel-item-2");
console.log("line 222", Array.from(allCarouselProfileElements2))
allCarouselProfileElements2 = Array.from(allCarouselProfileElements2);
const totalItems2 =  allCarouselProfileElements2.length;

const carouselControlsProfile2 = document.getElementsByClassName("carousel-profile2");
Array.from(carouselControlsProfile2).forEach((control) => control.onclick = ((e) => carouselProfileHandler2(e.target)));

const carouselControlsProfile = document.getElementsByClassName("carousel-profile");
Array.from(carouselControlsProfile).forEach((control) => control.onclick = ((e) => carouselProfileHandler(e.target)));



