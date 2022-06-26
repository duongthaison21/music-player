const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");


const app = {
    currentIndex: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    volume: 1,
    song: [
        {
            name: "Sweet but Psych",
            singer: "Ava Max",
            path: "./assets/audio/1.mp3",
            image: "./assets/img/1.jpg"
        },
        {
            name: "Your Man",
            singer: "Josh Turner",
            path: "./assets/audio/2.mp3",
            image: "./assets/img/2.jpg"
        },
        {
            name: "Jar of Hearts (remix lofi)",
            singer: "Fasetya",
            path: "./assets/audio/3.mp3",
            image: "./assets/img/3.jpg"
        },
        {
            name: "Try",
            singer: "Colbie Caillat",
            path: "./assets/audio/4.mp3",
            image: "./assets/img/4.jpg"
        },
        {
            name: "Comethru",
            singer: "Jeremy Zucker",
            path: "./assets/audio/5.mp3",
            image: "./assets/img/5.jpg"
        },
        {
            name: "Little Bit",
            singer: "MattyBRaps",
            path: "./assets/audio/6.mp3",
            image: "./assets/img/6.jpg"
        },
        {
            name: "Let Me Down Slowly",
            singer: "Alec Benjamin",
            path: "./assets/audio/7.mp3",
            image: "./assets/img/7.jpg"
        }
    ],

    render: function() {
        const currentIndex = this.currentIndex;          
        var HTMLs = this.song.map(function(song, index) {
            return `
                <div class="song ${index === currentIndex ? "active" : ""} ">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = HTMLs.join('') 
    },

    handleEvents: function() {
        const _this = this          // Lưu this ở ngoài vào để dùng bên trong hàm này
        const cdWidth = cd.offsetWidth

        // Handle CD thumb
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 7000,         // 7 seconds
            iterations: Infinity    // Loop
        })
        cdThumbAnimate.pause()


        // Phóng to/thu nhỏ CD 
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            var newWidth = (cdWidth - scrollTop) > 0 ? (cdWidth - scrollTop) : 0
            var newOpacity = newWidth / cdWidth
            cd.style.width = newWidth + 'px'   
            cd.style.opacity = newOpacity            
        }

        // Click Play
        playBtn.onclick = function() {
            if(!_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
        }

        // Audio Play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Audio Pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Handle playing
        audio.ontimeupdate = function() {
            if(audio.currentTime/audio.duration) {
                progress.value = audio.currentTime/audio.duration*100
            }
        }

        // Audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                _this.repeatSong()
            }
            else {
                if(_this.isRandom) {
                    _this.randomSong()
                }
                else {
                    _this.nextSong() 
                }
            }
            _this.handlePlaySong() 
        }

        // Next
        nextBtn.onclick = function() {
            if(_this.isRepeat) {
                _this.repeatSong()
            }
            else {
                if(_this.isRandom) {
                    _this.randomSong()
                }
                else {
                    _this.nextSong() 
                }
            }
            _this.handlePlaySong()         
        }

        // Prev
        prevBtn.onclick = function() {
            if(_this.isRepeat) {
                _this.repeatSong()
            }
            else {
                if(_this.isRandom) {
                    _this.randomSong()
                }
                else {
                    _this.prevSong()
                }
            }
            _this.handlePlaySong()
        }

        // Seek
        progress.onchange = function() {
            var newValue = this.value
            audio.currentTime = newValue / 100 *  audio.duration
        }

        // Repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = ! _this.isRepeat
            repeatBtn.classList.toggle('active')
            _this.repeatSong() 
        }

        // Ramdom
        randomBtn.onclick = function() {
            _this.isRandom = ! _this.isRandom
            randomBtn.classList.toggle('active')
            if(!_this.isRepeat) {
                _this.randomSong() 
            }
        }
        
        // Songs clicked
        playlist.onclick = function(e) {
            const songs = $$(".song")
            const optionsBtn = $$(".option")
            for(let i = 0; i < optionsBtn.length; i++) {
                optionsBtn[i].onclick = function(e) {
                    e.stopPropagation()
                }
            }
            for(let i = 0; i < songs.length; i++) {
                songs[i].onclick = function() {
                    if(i !== _this.currentIndex) {
                        _this.currentIndex = i;
                        _this.handlePlaySong()
                    }
                }
            }
        }
    },

    setInitialState: function() {
        audio.volume = this.volume
    },

    getCurrentSong: function() {
        return this.song[this.currentIndex]
    },

    loadCurrentSong: function() {
        var newName = this.getCurrentSong().name
        var newImage = this.getCurrentSong().image
        var newAudio = this.getCurrentSong().path
        heading.innerText = newName
        cdThumb.style.backgroundImage = `url('${newImage}')`
        audio.src = `${newAudio}`
    },

    scrollActiveSong: function() {
        const activeSong = $('.song.active')
        setTimeout(() => {
            activeSong.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
        }, 300);
    },

    handlePlaySong: function() {
        this.loadCurrentSong()
        this.render()
        this.scrollActiveSong()
        audio.play()
    },
    
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex > this.song.length - 1) {
            this.currentIndex = 0
        }
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1
        }
    },

    randomSong: function() {
        do {
            var newIndex = Math.floor(Math.random() * (this.song.length))
        }
        while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
    },

    repeatSong: function() {
        var index = this.currentIndex
        this.currentIndex = index
        // Giữ nguyên index song
    },

    start: function() {
        this.setInitialState()
        this.render()
        this.handleEvents()
        this.loadCurrentSong()
    }
}

app.start()
