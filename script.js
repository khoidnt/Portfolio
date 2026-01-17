// Xử lý Lightbox (Xem ảnh phóng to)
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

// Khi click vào ảnh bất kỳ
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = "flex";
        lightboxImg.src = item.src; // Lấy nguồn ảnh vừa click gán vào lightbox
    });
});

// Khi click nút đóng (x)
closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
});

// Khi click ra ngoài vùng ảnh cũng đóng luôn
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = "none";
    }
});

// Cuộn trang mượt mà (Smooth Scroll) cho các link menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Thay đổi màu nền navbar khi cuộn trang
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// Xử lý bật/tắt nhạc nền
const musicBtn = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const audio = document.getElementById('bgMusic');

if (musicBtn && audio) {
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            // Đổi sang icon loa đang phát
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            // Đổi lại icon loa gạch chéo
            musicIcon.classList.remove('fa-volume-up');
            musicIcon.classList.add('fa-volume-mute');
            musicBtn.classList.remove('playing');
        }
    });
}

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Kiểm tra xem máy đã nhận lệnh click chưa
        console.log("Đã nhấn nút đổi màu!"); 

        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if(themeIcon) themeIcon.innerText = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if(themeIcon) themeIcon.innerText = '☀️';
        }
    });
} else {
    console.log("Lỗi: Không tìm thấy nút có ID là theme-toggle");
}