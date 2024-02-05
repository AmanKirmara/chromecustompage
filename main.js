(() => {
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const userinput = document.getElementById("userinput");
  const searchEngine = document.getElementById("searchEngine");

  let currentTrackIndex = parseInt(localStorage.getItem("currentTrackIndex"),10) || 0;
  let isPlaying = false;

  const playlistArr = [
    {
      src: "playlist/Mera-Yaar-Meri-Daulat.mp3",
      name: "Mera Yaar Meri Daulat",
    },
    { src: "playlist/Hamari Adhuri Kahani.mp3", name: "Hamari Adhuri Kahani" },
    { src: "playlist/Tere Hawaale.mp3", name: "Tere Hawaale" },
    { src: "playlist/Galliyan Ek Villain.mp3", name: "Galliyan Ek Villain" },
    { src: "playlist/Malang Sajna.mp3", name: "Malang Sajna" },
    { src: "playlist/O Mahi O Mahi.mp3", name: "O Mahi O Mahi" },
    { src: "playlist/Ve Haaniyaan.mp3", name: "Ve Haaniyaan" },
    { src: "playlist/Heeriye.mp3", name: "Heeriye" },
    {
      src: "playlist/Adha Tera Ishq Aadha Mera.mp3",
      name: "Adha Tera Ishq Aadha Mera",
    },
  ];

  const imageUrls = [
    "images/johannes-plenio.jpg",
    "images/macwallpaper.jpg",
    "images/john-towner.jpg",
    "images/robs.jpg",
    "images/mac2wallpaper.jpg",
  ];

  const audio = new Audio();
  const playpause = document.getElementById("playpause");
  const prevSong = document.querySelector(".fa-chevron-right");
  const nextSong = document.querySelector(".fa-chevron-left");
  const volumeOnOff = document.querySelector(".fa-volume-up");
  const totalduration = document.querySelector(".totalduration");
  const availableduration = document.querySelector(".availableduration");
  const mainSlider = document.getElementById("audioTrack");
  const playlist = document.querySelector(".playlist");
  const musicname = document.querySelector(".musicname");

  const usernameDiv = document.getElementById("username");
  usernameDiv.textContent = localStorage.getItem("username") || "username";
  searchEngine.value = localStorage.getItem("searchEngine") || "google";
  musicname.innerHTML = playlistArr[currentTrackIndex].name;
  audio.src = playlistArr[currentTrackIndex].src;

  document.body.style.background = `url(${
    imageUrls[Math.floor(Math.random() * imageUrls.length)]
  }) center/cover`;

  function displayCurrentTime() {
    const currentTime = new Date();

    const formattedHours = padZero(currentTime.getHours() % 12);
    const formattedMinutes = padZero(currentTime.getMinutes());
    const formattedSeconds = padZero(currentTime.getSeconds());

    hours.innerHTML = formattedHours;
    minutes.innerHTML = formattedMinutes;
    seconds.innerHTML = formattedSeconds;
  }

  function padZero(value) {
    return value < 10 ? "0" + value : value;
  }

  setInterval(displayCurrentTime, 1000);

  userinput.addEventListener("focus", setupUserInput);

  function setupUserInput() {
    userinput.addEventListener("click", () => userinput.select());
    userinput.addEventListener("keypress", handleKeyPress);

    function handleKeyPress(e) {
      if (e.key === "Enter") {
        userinput.value.trim() !== "" ? selectEngine() : null;
      }
    }
  }

  function selectEngine() {
    const selectedEngine = searchEngine.value.toLowerCase();
    console.log(" this is selected: " + selectedEngine);

    switch (selectedEngine) {
      case "google":
        searchOnGoogle(userinput);
        break;
      case "bing":
        searchOnBing(userinput);
        break;
      case "yahoo":
        searchOnYahoo(userinput);
        break;
      case "youtube":
        searchOnYoutube(userinput);
        break;
      default:
        console.error("Invalid search engine selected");
    }
  }

  function searchOnGoogle(inputValue) {
    window.open("https://www.google.com/search?q=" + inputValue.value);
  }

  function searchOnBing(inputValue) {
    window.open("https://www.bing.com/search?q=" + inputValue.value);
  }

  function searchOnYahoo(inputValue) {
    window.open("https://search.yahoo.com/search?p=" + inputValue.value);
  }

  function searchOnYoutube(inputValue) {
    window.open(
      "https://www.youtube.com/results?search_query=" + inputValue.value
    );
  }

  function disableEvents(eventName) {
    document.addEventListener(eventName, (e) => e.preventDefault());
  }

  disableEvents("contextmenu");

  usernameDiv.addEventListener("input", () => {
    localStorage.setItem("username", usernameDiv.textContent);
  });

  playlistArr.forEach((item, index) => {
    const createPlayListElement = document.createElement("li");
    createPlayListElement.innerHTML = item.name;
    createPlayListElement.addEventListener("click", () => {
      const playlistItems = document.querySelectorAll(".playlist li");
      playlistItems.forEach((item) => item.classList.remove("active"));

      currentTrackIndex = index;
      playCurrentTrack();
      createPlayListElement.classList.add("active");
    });

    playlist.appendChild(createPlayListElement);
  });

  function updateActivePlaylistItem() {
    const playlistItems = document.querySelectorAll(".playlist li");
    playlistItems.forEach((item) => item.classList.remove("active"));

    if (playlistItems[currentTrackIndex]) {
      playlistItems[currentTrackIndex].classList.add("active");

      const playlist = document.querySelector(".playlist");
      const activeItem = playlistItems[currentTrackIndex];

      const offsetTop = activeItem.offsetTop - playlist.offsetTop;
      const centerScroll =
        offsetTop - (playlist.clientHeight - activeItem.clientHeight) / 2;

      playlist.scrollTop = centerScroll;
    }
  }

  audio.addEventListener("ended", () => {
    isPlaying ? audio.play() : audio.pause();
    playNext();
  });

  audio.addEventListener("pause", () => {
    pauseAudio();
  });
  audio.addEventListener("play", () => {
    playAudio();
  });

  mainSlider.addEventListener("input", () => {
    audio.currentTime = (mainSlider.value / 100) * audio.duration;
  });

  playpause.addEventListener("click", () => {
    isPlaying ? pauseAudio() : playAudio();
  });

  prevSong.addEventListener("click", playPrevious);
  nextSong.addEventListener("click", playNext);

  volumeOnOff.addEventListener("click", toggleMute);

  audio.addEventListener("timeupdate", () => {
    totalduration.innerHTML = audio.duration
      ? formatTime(audio.duration)
      : "0:00";
    availableduration.innerHTML = audio.duration
      ? formatTime(audio.currentTime)
      : "0:00";
    mainSlider.value = (audio.currentTime / audio.duration) * 100;
    localStorage.setItem("currentTrackValue", mainSlider.value);
    localStorage.setItem("currentTrackIndex", currentTrackIndex.toString());
  });

  document.addEventListener("keydown", (e) => {
    const focusedElement = document.activeElement;

    if (
      focusedElement !== userinput &&
      !isContentEditableParagraph(focusedElement)
    ) {
      if (e.key === "ArrowRight") {
        playNext();
      } else if (e.key === "ArrowLeft") {
        playPrevious();
      } else if (e.key === " ") {
        isPlaying ? pauseAudio() : playAudio();
      } else if (e.key === "m") {
        toggleMute();
      } else if (e.key === "p") {
        isPlaying ? pauseAudio() : playAudio();
      } else if (e.key === "/") {
        e.preventDefault();
        userinput.focus();
      } else if (e.key >= "1" && e.key <= "9" && !e.location) {
        const newValue = parseInt(e.key);
        mainSlider.value = newValue * 10;
        audio.currentTime = (mainSlider.value / 100) * audio.duration;
      }
    }
  });

  function isContentEditableParagraph(element) {
    return element.tagName === "P" && element.isContentEditable;
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  function updateUI() {
    musicname.textContent = playlistArr[currentTrackIndex].name;
    mainSlider.value = 0;
    totalduration.textContent = formatTime(audio.duration);
    // readMP3Metadata(playlistArr[currentTrackIndex].src); // Call readMP3Metadata here
    playAudio();
  }

  function playAudio() {
    if (!isPlaying) {
      audio.play();
      playpause.classList.remove("fa-play");
      playpause.classList.add("fa-pause");
      isPlaying = true;
      setupAudioVisualizer();
      updateActivePlaylistItem();
    }
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playpause.classList.remove("fa-pause");
    playpause.classList.add("fa-play");
  }

  function toggleMute() {
    audio.muted = !audio.muted;

    const volumeMute = document.getElementById("volumeMute");
    volumeMute.classList.toggle("fa-volume-up", !audio.muted);
    volumeMute.classList.toggle("fa-volume-xmark", audio.muted);
  }

  function playNext() {
    if (playlistArr.length > 1) {
      currentTrackIndex = (currentTrackIndex + 1) % playlistArr.length;
      updateActivePlaylistItem();
      playCurrentTrack();
    } else {
      isPlaying = false;
    }
  }

  function playPrevious() {
    if (playlistArr.length > 1) {
      currentTrackIndex =
        (currentTrackIndex - 1 + playlistArr.length) % playlistArr.length;
      playCurrentTrack();
    } else {
      isPlaying = false;
    }
  }

  function playCurrentTrack() {
    const currentTrack = playlistArr[currentTrackIndex];
    audio.src = currentTrack.src;
    musicname.innerHTML = currentTrack.name;
    audio.load();
    isPlaying ? audio.play() : audio.pause();
    updateActivePlaylistItem();
    updateUI();
  }

  function setupAudioVisualizer() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const visualizer = document.getElementById("visualizer");

    for (let i = 0; i < bufferLength; i++) {
      const bar = document.createElement("div");
      bar.className = "bar";
      visualizer.appendChild(bar);
    }

    function visualize() {
      analyser.getByteFrequencyData(dataArray);

      const bars = document.querySelectorAll(".bar");

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 10;
        bars[i].style.height = barHeight + "px";
        bars[i].style.backgroundColor = `rgb(${barHeight * 13}, ${
          barHeight * 30
        }, 255)`;
      }

      requestAnimationFrame(visualize);
    }

    visualize();
  }
})();
