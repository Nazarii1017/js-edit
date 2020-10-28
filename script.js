const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    showData(data);
}
//MY UPDATE BELOW
const userName = String(prompt("What's your name?"));
alert("Hello " + userName + "! ");

const musicFan = String(prompt("Are you a music fan? " + "yes/no"));

if (musicFan === "yes") {
    alert("NICE! " + "Me too, enjoy!");
} else {
    alert("Ouch" + ":(");
}
let quotes = [

    'Music is like a dream. One that I cannot hear. (Ludwig van Beethoven)',
    'One good thing about music, when it hits you, you feel no pain.(Bob Marley)',
    'Music is the shorthand of emotion.( Leo Tolstoy )',
    'Where words fail, music speaks.(Hans Christian Andersen)',
    'If I had my life to live over again, I would have made a rule to read some poetry and listen to some music at least once every week. (Charles Darwin)',
    'Music . . . can name the unnameable and communicate the unknowable.(Leonard Bernstein)',
    'Music makes one feel so romantic – at least it always gets on one’s nerves – which is the same thing nowadays.(Oscar Wilde)',
    'Music produces a kind of pleasure which human nature cannot do without.(Confucius)',
    'Music is an agreeable harmony for the honor of God and the permissible delights of the soul.(Johann Sebastian Bach)'
];

function displayQuote() {
    let index = Math.floor(Math.random() * quotes.length);
    let div = document.querySelector('#quote');
    let quote = `<div class="card">
    <p>${quotes[index]}</p>
    </div>
    `;
    div.innerHTML = quote;

}
// end of my update

// Show song and artist in DOM
function showData(data) {
    result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

   if (data.error) {
        result.innerHTML = data.error;
   } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        result.innerHTML = `
            <h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${lyrics}</span>
        `;
  }

  more.innerHTML = '';
}

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});