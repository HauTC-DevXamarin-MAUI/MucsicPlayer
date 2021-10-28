const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'abc_player';

const cd = $('.cd');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const playBtn = $('.btn-toggle-play');
const player = $('.player');

const progress = $('#progress');

const nextSong = $('.btn-next');
const prevSong = $('.btn-prev');

const randomBtn = $('.btn-random');
const repeattBtn = $('.btn-repeat');

const playlist = $('.playlist');





//chứa bài hát
const app = {
    crrentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
        name: 'Despacito',
        singer: 'Luis',
        path: './assets/music/Despacito-Mandarin-Version-Luis-Fonsi.mp3',
        image: './assets/img/song1_des.jpeg'
    }, {
        name: 'Xe đạp',
        singer: 'Thùy Chi - M4U',
        path: './assets/music/Xe-Dap-Thuy-Chi-M4U.mp3',
        image: './assets/img/song2_xedap.jpeg'
    }, {
        name: 'Thu Hà Nội',
        singer: 'Yanbi -Mr.T',
        path: './assets/music/Thu-Ha-Noi-Yanbi-Mr-T.mp3',
        image: './assets/img/song3_thuhanoi.jpeg'
    }, {
        name: 'Yếu Đuối',
        singer: 'Hoàng Dũng',
        path: './assets/music/Yeu-Duoi-Hoang-Dung.mp3',
        image: './assets/img/song4_yeuduoi.jpeg'
    }, {
        name: 'Dĩ Vãng Nhạt Nhoà',
        singer: 'Tô Chấn Phong - Lương Bích Hữu',
        path: './assets/music/Di-Vang-Nhat-Nhoa-To-Chan-Phong-Luu-Bich.mp3',
        image: './assets/img/song5_divangnhatnhoa.jpeg'
    }, {
        name: 'Em Đâu Đủ Tư Cách',
        singer: 'Sơn Tùng M-TP  - DeePink',
        path: './assets/music/Em-Dau-Du-Tu-Cach-DeePink-Son-Tung-M-TP.mp3',
        image: './assets/img/song6_emdauduttucach.jpeg'
    }, {
        name: 'Nhạt',
        singer: 'Phan Mạnh Quỳnh',
        path: './assets/music/Nhat-Phan-Manh-Quynh.mp3',
        image: './assets/img/song7_nhat.jpeg'
    }],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
     <div class="song ${index === this.crrentIndex ? 'active':' '}" data-index="${index}">
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
        });
        //    console.log(htmls)
        playlist.innerHTML = htmls.join('');
    },
    //định nghĩa thuộc tính
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.crrentIndex];
            }
        })
    },
    handleEvents: function() {
        const cdWidtth = cd.offsetWidth;

        //Xử lý quay của cd

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const newWidth = cdWidtth - scrollTop;

            cd.style.opacity = newWidth / cdWidtth;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            if (newWidth < 25) {
                cd.style.width = 0;
            }
        }

        //Xử lý khi onlClick Play
        playBtn.onclick = function() {
                if (app.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            //Khi bài hát đang chạy
        audio.onplay = function() {
                app.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            //Khi bài hát ngừng
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }

        // tiến trtinhf của bài hatts
        audio.ontimeupdate = function() {
            if (audio.duration) //Nếu k phải NaN
            {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100);
            }
        }

        // Tua bài hát
        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
            audio.play()
        };
        //Xử lý next bài hát
        nextSong.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            //khi cần acttive bài hát trtong list
            app.render();
            app.scrollToActiveSong();
        };
        //Xử lý prev bài hát
        prevSong.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            //khi cần acttive bài hát trtong list
            app.render();
            app.scrollToActiveSong();
        };
        //xử lý bật tắt Repeat
        repeattBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);

            repeattBtn.classList.toggle('active', app.isRepeat);
        }

        //Xử lý bật tắt random bài hát
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            app.setConfig('isRandom', app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        }

        //Xử lý next Song khi audio ended

        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextSong.onclick()
            }
        }

        // Lắng nghe hành click vào PlayLisst
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                //Xử lý khi click vào song
                if (e.target.closest('.song:not(.active)')) {
                    app.crrentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                //Xử lý khi click vào Song Option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.crrentIndex++;
        if (this.crrentIndex >= this.songs.length) {
            this.crrentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.crrentIndex--;
        if (this.crrentIndex <= 0) {
            this.crrentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.crrentIndex)

        this.crrentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong() {
        setTimeout(() => {
            if (this.currentIndex <= 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }, 300);
    },
    start: function() {
        //Gán cấu hình từ Config vào
        this.loadConfig();

        //Dịnh nghĩa các thuộc ttinhs cho Obj
        this.defineProperties();

        // Lắng nghe  DOM Envent
        this.handleEvents();

        // Tải info của bài đầu ttieen vào UI
        this.loadCurrentSong();

        //Render Playlisst
        this.render();

        //Hiện thị trạng thái ban đâu của repeattBtn và randomBtn
        repeattBtn.classList.toggle('active', app.isRepeat); // ở đây isRepeat lấy ra từ this.loadConfig();
        randomBtn.classList.toggle('active', app.isRandom); // ở đây isRandom lấy ra từ this.loadConfig();
    }
}

app.start();