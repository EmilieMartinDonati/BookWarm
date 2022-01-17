
// Perfectible at this point :
// The searchbar can have either 10 either 20 authors on display.
// It needs a next 10 or next 20 to display the next author :-) 


document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("test-API JS imported successfully!");
  },
  false
);

//Retrieving data by author, with the form of the searchbar. 

// let searchbar = document.getElementById("searchbar");
// let searchbarBtn = document.getElementById("searchbarBtn");

// function appendAuthor (author, key) {
//   const div = document.createElement("div");
//   div.classList.add("card");
//   div.setAttribute("id", "author-card");
//   const div2 = document.createElement("div");
//   div2.classList.add("card-body");
//   div.appendChild(div2);
//   const h5 = document.createElement("h5");
//   h5.classList.add("card-title");
//   div2.appendChild(h5);
//   const p = document.createElement("p");
//   p.classList.add("card-text");
//   p.setAttribute("id", "author-card-name");
//   div2.appendChild(p);
//   p.textContent = author;
//   document.getElementById("display-author").appendChild(div);
//   const a = document.createElement("a");
//   a.classList.add("btn");
//   a.setAttribute("href", `/${key}`)
//   a.textContent = "click to learn more"
//   div2.appendChild(a);

// }

// async function getAuthor () {

//   const previousDivs = document.querySelectorAll("#display-author div");
//   [...previousDivs].forEach((div) => div.remove());

//   let numberofAuthor = 10;

//   let authorname = searchbar.value;
//   const url = `https://openlibrary.org/search/authors.json?q=${authorname}`;

// const author = await fetch (url)
//     .then(response => response.json())
//     .then(function(data) {
//       console.log(data);
       
// // for loops pour en filer plusieurs.
//   for (let i = 0 ; i <= numberofAuthor ; i ++) {
//     appendAuthor(data.docs[i].name, data.docs[i].key)
//   }
//     })
// }




// searchbarBtn.onclick = getAuthor;


// Retrieving data by subject. 