/**
 * FILE: script.js
 * Chức năng: Xử lý Lightbox, Bộ lọc Album (Filter), Navbar và Cuộn mượt.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. XỬ LÝ BỘ LỌC ALBUM (FILTER)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const moreStatus = document.querySelector('.gallery-more-status');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Đổi trạng thái nút Active
            filterBtns.forEach(navBtn => navBtn.classList.remove('active'));
            btn.classList.add('active');

            // Lấy giá trị lọc từ data-filter của nút
            const filterValue = btn.getAttribute('data-filter');
            if (filterValue === 'all') {
                if (moreStatus) moreStatus.style.display = 'flex';
            } else {
                if (moreStatus) moreStatus.style.display = 'none';
            }
            galleryItems.forEach(item => {
                // Lấy category của từng ảnh
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === itemCategory) {
                    // Hiển thị ảnh: dùng 'block' để Grid nhận diện lại vị trí
                    item.style.display = 'block';
                    // Hiệu ứng hiện hình mượt mà
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Ẩn ảnh
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // Đợi hiệu ứng transition trong CSS (nếu có)
                }
            });
        });
    });

    // 2. XỬ LÝ LIGHTBOX (XEM ẢNH PHÓNG TO)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const allImages = document.querySelectorAll('.gallery-item img');

    allImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden'; // Khóa cuộn trang khi xem ảnh
        });
    });

    // Đóng Lightbox khi bấm nút X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        });
    }

    // Đóng Lightbox khi bấm ra ngoài vùng ảnh
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // 3. THAY ĐỔI NAVBAR KHI CUỘN TRANG
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. CUỘN TRANG MƯỢT MÀ (SMOOTH SCROLL)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Trừ đi chiều cao navbar
                    behavior: 'smooth'
                });
            }
        });
    });

});