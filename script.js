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
