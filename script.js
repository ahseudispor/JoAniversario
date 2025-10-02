// ===== PLAYLIST PRINCIPAL =====
const playlist = [
  { file: "musica1.mp3" },
  { file: "musica2.mp3" },
  { file: "musica3.mp3" },
  { file: "musica4.mp3" },
  { file: "musica5.mp3" },
  { file: "musica6.mp3" }
];

// ===== PLAYLIST DE INTRO =====
const introSounds = [
  { file: "intro1.mp3" },
  { file: "intro2.mp3" },
  { file: "intro3.mp3" }
];

// ===== LISTA DE FOTOS DO CARROSSEL =====
const carouselImages = [
  { src: "foto1.jpg", caption: "Momentos" },
  { src: "foto2.jpg", caption: "Guerreiro ⚔️" },
  { src: "foto3.jpg", caption: "Campeão 💪" }
];

// ===== VARIÁVEIS =====
let currentSongIndex = 0;
let currentImageIndex = 0;
let isPlaying = false;
let carouselInterval;

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const currentSongDisplay = document.getElementById('currentSong');
const progressFill = document.getElementById('progressFill');
const playlistContainer = document.getElementById('playlistContainer');
const carouselImage = document.getElementById('carouselImage');
const carouselCaption = document.getElementById('carouselCaption');
const carouselIndicatorsContainer = document.getElementById('carouselIndicators');

// ===== FUNÇÃO PARA EMBARALHAR PLAYLIST =====
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== FUNÇÕES DO CARROSSEL =====
function initCarouselIndicators() {
  carouselImages.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (index === 0) indicator.classList.add('active');
    indicator.onclick = () => goToSlide(index);
    carouselIndicatorsContainer.appendChild(indicator);
  });
}

function updateCarousel() {
  const image = carouselImages[currentImageIndex];
  carouselImage.style.opacity = '0';

  setTimeout(() => {
    carouselImage.src = image.src;
    carouselCaption.textContent = image.caption;
    carouselImage.style.opacity = '1';
  }, 300);

  document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentImageIndex);
  });
}

function changeSlide(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) {
    currentImageIndex = carouselImages.length - 1;
  } else if (currentImageIndex >= carouselImages.length) {
    currentImageIndex = 0;
  }
  updateCarousel();
  resetCarouselTimer();
}

function goToSlide(index) {
  currentImageIndex = index;
  updateCarousel();
  resetCarouselTimer();
}

function startCarousel() {
  carouselInterval = setInterval(() => {
    changeSlide(1);
  }, 4000);
}

function resetCarouselTimer() {
  clearInterval(carouselInterval);
  startCarousel();
}

// ===== FUNÇÕES DO PLAYER DE MÚSICA =====
function initPlaylist() {
  playlist.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    if (index === 0) item.classList.add('active');
    item.innerHTML = `
      <div class="song-name">${song.name || "Música " + (index + 1)}</div>
      <div class="song-artist">${song.artist || ""}</div>
    `;
    item.onclick = () => playSong(index);
    playlistContainer.appendChild(item);
  });
}

function loadSong(index) {
  const song = playlist[index];
  audioPlayer.src = song.file;
  currentSongDisplay.textContent =
    `${song.name || "Música " + (index + 1)} ${song.artist ? "- " + song.artist : ""}`;

  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

function playSong(index) {
  if (index !== undefined) {
    currentSongIndex = index;
    loadSong(index);
  }
  audioPlayer.play();
  isPlaying = true;
  playBtn.textContent = '⏸️';
}

function pauseSong() {
  audioPlayer.pause();
  isPlaying = false;
  playBtn.textContent = '▶️';
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function nextSong() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * playlist.length);
  } while (newIndex === currentSongIndex && playlist.length > 1);

  currentSongIndex = newIndex;
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

function previousSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressFill.style.width = progress + '%';
});

// 🎵 Quando a música termina → escolhe outra aleatória
audioPlayer.addEventListener('ended', () => {
  nextSong();
});

document.querySelector('.playlist-title').addEventListener('click', () => {
  document.querySelector('.playlist').classList.toggle('open');
});

// ===== FUNÇÕES GERAIS =====
function iniciarSite() {
  document.getElementById('introScreen').classList.add('hidden');

  // 🔊 Som aleatório da playlist de introdução
  const randomIntroIndex = Math.floor(Math.random() * introSounds.length);
  const introAudio = new Audio(introSounds[randomIntroIndex].file);
  introAudio.play();

  // 🎵 Inicia playlist principal após o som de intro terminar
  introAudio.addEventListener('ended', () => {
    currentSongIndex = Math.floor(Math.random() * playlist.length);
    loadSong(currentSongIndex);

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸️';
      }).catch(() => {
        console.log('Autoplay bloqueado. Clique em play para iniciar a música.');
      });
    }
  });
}

function criarCodeRain() {
  const symbols = [
    '✨', '🌸', '⭐', '💫', '🎋', '🎐', 
    '桜', '夢', '愛', '心', '光', '希',
    '♪', '♫', '◆', '◇', '★', '☆'
  ];
  const code = document.createElement('div');
  code.classList.add('code-rain');
  code.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  code.style.left = Math.random() * 100 + 'vw';
  code.style.animationDuration = (Math.random() * 3 + 5) + 's';
  document.body.appendChild(code);

  setTimeout(() => {
    code.remove();
  }, 8000);
}

// ===== INICIALIZAÇÃO (MELHORADO PARA MOBILE) =====
document.addEventListener('DOMContentLoaded', () => {
  initPlaylist();
  loadSong(0);
  initCarouselIndicators();
  updateCarousel();
  startCarousel();
  setInterval(criarCodeRain, 300);

  // 🔄 Garantia extra para mobile
  setTimeout(() => {
    if (!carouselInterval) {
      startCarousel();
    }
  }, 2000);
});