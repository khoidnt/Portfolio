/**
 * script.js - Portfolio interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('menu');
    const mobileLinks = document.querySelectorAll('.menu-links-mobile .nav-item');
    const themeToggle = document.getElementById('themeToggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const moreStatus = document.querySelector('.gallery-more-status');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev');
    const lightboxNextBtn = document.querySelector('.lightbox-next');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const albumModal = document.getElementById('albumModal');
    const albumModalGrid = document.getElementById('albumModalGrid');
    const albumModalTitle = document.getElementById('albumModalTitle');
    const albumModalMeta = document.getElementById('albumModalMeta');
    const closeAlbumModalBtn = document.getElementById('closeAlbumModal');
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const textareas = document.querySelectorAll('textarea');
    const sectionNodes = document.querySelectorAll('main section[id]');
    const navItemLinks = document.querySelectorAll('.nav-item[href^="#"]');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const mobileBreakpoint = 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setBodyScrollLock = (isLocked) => {
        document.body.style.overflow = isLocked ? 'hidden' : '';
    };

    const initThemeToggle = () => {
        if (!themeToggle) {
            return;
        }

        const root = document.documentElement;

        const applyTheme = (theme) => {
            const isLight = theme === 'light';
            if (isLight) {
                root.setAttribute('data-theme', 'light');
            } else {
                root.removeAttribute('data-theme');
            }

            themeToggle.setAttribute('aria-pressed', String(isLight));
            themeToggle.setAttribute('aria-label', isLight ? 'Bật giao diện tối' : 'Bật giao diện sáng');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isLight ? '#f5f1ea' : '#0c0b0a');
            }
        };

        applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

        themeToggle.addEventListener('click', () => {
            const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
            try {
                localStorage.setItem('theme', nextTheme);
            } catch (_error) {
                // Storage unavailable (e.g. private mode) - theme still applies for this visit
            }
        });
    };

    const setMenuState = (isOpen) => {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        if (isOpen) {
            mobileMenu.removeAttribute('hidden');
        } else {
            mobileMenu.setAttribute('hidden', '');
        }

        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
        if (navbar) {
            navbar.classList.toggle('menu-open', isOpen);
        }
        setBodyScrollLock(isOpen);
    };

    const initNavbarScroll = () => {
        if (!navbar) {
            return;
        }

        let ticking = false;

        const handleScroll = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    const initMobileMenu = () => {
        if (!menuToggle || !mobileMenu) {
            return;
        }

        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.hasAttribute('hidden');
            setMenuState(isOpen);
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > mobileBreakpoint) {
                setMenuState(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
                setMenuState(false);
                menuToggle.focus();
            }
        });
    };

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') {
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (!targetElement) {
                    return;
                }

                event.preventDefault();

                const offset = navbar ? navbar.offsetHeight - 20 : 70;
                window.scrollTo({
                    top: targetElement.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            });
        });
    };

    const initActiveNavSection = () => {
        if (!sectionNodes.length || !navItemLinks.length || !('IntersectionObserver' in window)) {
            return;
        }

        const linksById = new Map();
        const sectionAliasMap = {
            contact: 'about'
        };

        navItemLinks.forEach((link) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) {
                return;
            }

            const normalizedId = targetId.slice(1);
            if (!linksById.has(normalizedId)) {
                linksById.set(normalizedId, []);
            }
            linksById.get(normalizedId).push(link);
        });

        const setActive = (id) => {
            navItemLinks.forEach((link) => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });

            const resolvedId = linksById.has(id) ? id : sectionAliasMap[id];
            const matchingLinks = linksById.get(resolvedId) || [];
            matchingLinks.forEach((link) => {
                link.classList.add('active');
                link.setAttribute('aria-current', 'location');
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (!visible.length) {
                    return;
                }

                setActive(visible[0].target.id);
            },
            {
                rootMargin: '-35% 0px -45% 0px',
                threshold: [0.2, 0.4, 0.6]
            }
        );

        sectionNodes.forEach((section) => observer.observe(section));
        setActive('home');
    };

    let galleryData = [];
    let currentCategoryFilter = 'all';
    let currentPersonFilter = 'all';
    let visibleAlbums = [];
    let lightboxItems = [];
    let lightboxIndex = 0;
    let albumModalTrigger = null;
    let lightboxTrigger = null;

    const categoryLabelMap = {
        'chan-dung': 'Chân Dung',
        'ngoai-canh': 'Ngoại Cảnh',
        'doi-thuong': 'Đời Thường'
    };

    const toTitleCase = (value) => value
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const getAlbumTitle = (item) => {
        if (item.album && item.album.trim()) {
            return item.album.trim();
        }

        if (item.category === 'chan-dung' && item.person && item.person.trim()) {
            return toTitleCase(item.person.trim());
        }

        return categoryLabelMap[item.category] || 'Album';
    };

    const getAlbumKey = (item) => {
        if (item.album && item.album.trim()) {
            return `album-${item.category}-${item.album.trim().toLowerCase()}`;
        }

        if (item.category === 'chan-dung') {
            const personKey = (item.person || 'khac').trim().toLowerCase();
            return `portrait-${personKey}`;
        }

        return `category-${item.category}`;
    };

    const renderGalleryStatus = (message) => {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) {
            return;
        }

        galleryGrid.innerHTML = '';
        const status = document.createElement('p');
        status.className = 'gallery-status-message';
        status.textContent = message;
        galleryGrid.appendChild(status);
    };

    const renderStats = () => {
        const values = {
            photos: galleryData.length,
            albums: new Set(galleryData.map(getAlbumKey)).size,
            categories: new Set(galleryData.map((item) => item.category)).size
        };

        document.querySelectorAll('[data-stat]').forEach((node) => {
            const value = values[node.getAttribute('data-stat')];
            if (typeof value === 'number') {
                node.textContent = String(value).padStart(2, '0');
            }
        });
    };

    const loadGalleryData = async () => {
        try {
            const response = await fetch('./gallery-data.json');
            if (!response.ok) {
                throw new Error('Failed to load gallery data');
            }
            const data = await response.json();
            // Handle both direct array and wrapped { gallery: [...] } formats
            galleryData = Array.isArray(data) ? data : (data.gallery || []);
            if (galleryData.length > 0) {
                renderGalleryAlbums();
                renderStats();
            } else {
                renderGalleryStatus('Chưa có ảnh trong dữ liệu gallery.');
            }
        } catch (error) {
            console.error('Error loading gallery data:', error);
            renderGalleryStatus('Không tải được gallery-data.json. Hãy mở site bằng local server (VD: Live Server) để đọc dữ liệu JSON.');
        }
    };

    const isLightboxOpen = () => Boolean(lightbox && lightbox.classList.contains('active'));
    const isAlbumModalOpen = () => Boolean(albumModal && albumModal.classList.contains('active'));

    const showLightboxImage = (index) => {
        if (!lightboxImg || !lightboxItems.length) {
            return;
        }

        lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
        const item = lightboxItems[lightboxIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt || '';

        const hasMany = lightboxItems.length > 1;
        if (lightboxPrevBtn) {
            lightboxPrevBtn.hidden = !hasMany;
        }
        if (lightboxNextBtn) {
            lightboxNextBtn.hidden = !hasMany;
        }
        if (lightboxCounter) {
            lightboxCounter.hidden = !hasMany;
            lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
        }
    };

    const openLightbox = (items, index) => {
        if (!lightbox || !lightboxImg) {
            return;
        }

        lightboxTrigger = document.activeElement;
        lightboxItems = items;
        showLightboxImage(index);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        setBodyScrollLock(true);
        if (closeLightboxBtn) {
            closeLightboxBtn.focus();
        }
    };

    const openAlbumModal = (albumIndex) => {
        const album = visibleAlbums[albumIndex];
        if (!album || !albumModal || !albumModalGrid || !albumModalTitle || !albumModalMeta) {
            return;
        }

        albumModalTrigger = document.activeElement;
        albumModalTitle.textContent = album.title;
        albumModalMeta.textContent = `${album.items.length} ảnh • ${categoryLabelMap[album.category] || 'Album'}`;
        albumModalGrid.innerHTML = '';

        album.items.forEach((item, itemIndex) => {
            const imageButton = document.createElement('button');
            imageButton.type = 'button';
            imageButton.className = 'album-modal-item';
            imageButton.setAttribute('aria-label', `Xem ảnh ${item.alt}`);

            const image = document.createElement('img');
            image.src = item.src;
            image.alt = item.alt;
            image.loading = 'lazy';
            image.decoding = 'async';

            imageButton.appendChild(image);
            imageButton.addEventListener('click', () => openLightbox(album.items, itemIndex));

            albumModalGrid.appendChild(imageButton);
        });

        albumModal.classList.add('active');
        albumModal.setAttribute('aria-hidden', 'false');
        setBodyScrollLock(true);
        if (closeAlbumModalBtn) {
            closeAlbumModalBtn.focus();
        }
    };

    const closeAlbumModal = () => {
        if (!albumModal) {
            return;
        }

        albumModal.classList.remove('active');
        albumModal.setAttribute('aria-hidden', 'true');
        setBodyScrollLock(isLightboxOpen());
        if (albumModalTrigger && typeof albumModalTrigger.focus === 'function') {
            albumModalTrigger.focus();
        }
    };

    const initAlbumModal = () => {
        if (!albumModal) {
            return;
        }

        if (closeAlbumModalBtn) {
            closeAlbumModalBtn.addEventListener('click', closeAlbumModal);
        }

        const modalOverlay = albumModal.querySelector('.album-modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeAlbumModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isAlbumModalOpen() && !isLightboxOpen()) {
                closeAlbumModal();
            }
        });
    };

    const renderGalleryAlbums = () => {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid || !galleryData.length) {
            return;
        }

        galleryGrid.innerHTML = '';

        const filtered = galleryData.filter((item) => {
            const categoryMatch = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
            const personMatch = currentPersonFilter === 'all' || (item.person && item.person.toLowerCase() === currentPersonFilter.toLowerCase());
            return categoryMatch && personMatch;
        });

        const albumMap = new Map();
        filtered.forEach((item) => {
            const key = getAlbumKey(item);
            if (!albumMap.has(key)) {
                albumMap.set(key, {
                    key,
                    title: getAlbumTitle(item),
                    category: item.category,
                    cover: item.src,
                    items: []
                });
            }
            albumMap.get(key).items.push(item);
        });

        visibleAlbums = Array.from(albumMap.values());

        const personFilterContainer = document.getElementById('personFilter');
        if (personFilterContainer) {
            personFilterContainer.style.display = currentCategoryFilter === 'chan-dung' ? 'flex' : 'none';
        }

        if (moreStatus) {
            moreStatus.style.display = currentCategoryFilter === 'all' ? 'flex' : 'none';
        }

        if (!visibleAlbums.length) {
            renderGalleryStatus('Không có album nào phù hợp với bộ lọc hiện tại.');
            return;
        }

        visibleAlbums.forEach((album, index) => {
            const albumCard = document.createElement('button');
            albumCard.type = 'button';
            albumCard.className = 'album-card';
            albumCard.style.setProperty('--i', String(index));
            albumCard.setAttribute('aria-label', `Mở album ${album.title}, ${album.items.length} ảnh`);

            const cover = document.createElement('div');
            cover.className = 'album-card-cover';

            const image = document.createElement('img');
            image.src = album.cover;
            image.alt = '';
            image.loading = 'lazy';
            image.decoding = 'async';

            const overlay = document.createElement('div');
            overlay.className = 'album-card-overlay';
            overlay.setAttribute('aria-hidden', 'true');

            const text = document.createElement('div');
            const meta = document.createElement('span');
            meta.className = 'album-card-meta';
            meta.textContent = categoryLabelMap[album.category] || 'Album';
            const title = document.createElement('div');
            title.className = 'album-card-title';
            title.textContent = album.title;
            text.append(meta, title);

            const count = document.createElement('span');
            count.className = 'album-card-count';
            count.textContent = `${album.items.length} ảnh`;

            overlay.append(text, count);
            cover.appendChild(image);
            cover.appendChild(overlay);
            albumCard.appendChild(cover);

            albumCard.addEventListener('click', () => openAlbumModal(index));
            galleryGrid.appendChild(albumCard);
        });
    };

    const setPressed = (buttons, activeButton) => {
        buttons.forEach((item) => {
            const isActive = item === activeButton;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', String(isActive));
        });
    };

    const initGalleryFilter = () => {
        if (!filterButtons.length) {
            return;
        }

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                if (!filterValue) {
                    return;
                }

                currentCategoryFilter = filterValue;
                currentPersonFilter = 'all'; // Reset person filter when changing category

                setPressed(filterButtons, button);

                // Reset person filter buttons
                const personFilterBtns = document.querySelectorAll('.person-filter-btn');
                setPressed(personFilterBtns, personFilterBtns[0]);

                renderGalleryAlbums();
            });
        });
    };

    const initPersonFilter = () => {
        const personFilterBtns = document.querySelectorAll('.person-filter-btn');
        if (!personFilterBtns.length) {
            return;
        }

        personFilterBtns.forEach((button) => {
            button.addEventListener('click', () => {
                const personValue = button.getAttribute('data-person');
                if (!personValue) {
                    return;
                }

                currentPersonFilter = personValue;
                setPressed(personFilterBtns, button);
                renderGalleryAlbums();
            });
        });
    };

    const initLightbox = () => {
        if (!lightbox || !lightboxImg) {
            return;
        }

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            setBodyScrollLock(isAlbumModalOpen());
            if (lightboxTrigger && typeof lightboxTrigger.focus === 'function') {
                lightboxTrigger.focus();
            }
            window.setTimeout(() => {
                if (!isLightboxOpen()) {
                    lightboxImg.src = '';
                }
            }, prefersReducedMotion ? 0 : 400);
        };

        if (closeLightboxBtn) {
            closeLightboxBtn.addEventListener('click', closeLightbox);
        }

        if (lightboxPrevBtn) {
            lightboxPrevBtn.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
        }

        if (lightboxNextBtn) {
            lightboxNextBtn.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));
        }

        lightbox.addEventListener('click', (event) => {
            if (event.target.classList.contains('lightbox-overlay')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!isLightboxOpen()) {
                return;
            }

            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft' && lightboxItems.length > 1) {
                showLightboxImage(lightboxIndex - 1);
            } else if (event.key === 'ArrowRight' && lightboxItems.length > 1) {
                showLightboxImage(lightboxIndex + 1);
            }
        });
    };

    const initScrollReveal = () => {
        if (!revealElements.length) {
            return;
        }

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealElements.forEach((element) => element.classList.add('visible'));
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    };

    const initTextareaAutoResize = () => {
        if (!textareas.length) {
            return;
        }

        const resizeTextarea = (textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
            textarea.style.overflowY = 'hidden';
        };

        textareas.forEach((textarea) => {
            resizeTextarea(textarea);
            textarea.addEventListener('input', () => resizeTextarea(textarea));
        });
    };

    const initContactForm = () => {
        if (!contactForm || !formStatus) {
            return;
        }

        const fields = Array.from(contactForm.querySelectorAll('input[required], textarea[required]'));
        const submitButton = contactForm.querySelector('button[type="submit"]');

        const setStatus = (message, state) => {
            formStatus.textContent = message;
            formStatus.classList.remove('success', 'error');
            if (state) {
                formStatus.classList.add(state);
            }
        };

        const validateField = (field) => {
            const value = field.value.trim();
            let isValid = value.length > 0;

            if (isValid && field.type === 'email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            }

            field.classList.toggle('invalid', !isValid);
            field.setAttribute('aria-invalid', String(!isValid));
            return isValid;
        };

        fields.forEach((field) => {
            // Validate on blur; once a field is flagged, re-check as the user fixes it
            field.addEventListener('blur', () => {
                if (field.value.trim() || field.classList.contains('invalid')) {
                    validateField(field);
                }
            });
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    validateField(field);
                }
            });
        });

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const results = fields.map((field) => validateField(field));
            const firstInvalid = fields[results.indexOf(false)];
            if (firstInvalid) {
                setStatus('Vui lòng kiểm tra lại thông tin trước khi gửi.', 'error');
                firstInvalid.focus();
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
            }
            setStatus('Đang gửi tin nhắn...', null);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Form submit failed');
                }

                contactForm.reset();
                fields.forEach((field) => {
                    field.classList.remove('invalid');
                    field.removeAttribute('aria-invalid');
                });
                textareas.forEach((textarea) => {
                    textarea.style.height = 'auto';
                });
                setStatus('Đã gửi thành công. Mình sẽ phản hồi sớm nhất có thể.', 'success');
            } catch (_error) {
                setStatus('Gửi chưa thành công. Bạn thử lại sau hoặc liên hệ qua Instagram nhé.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    };

    const yearNode = document.getElementById('year');
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    initThemeToggle();
    loadGalleryData();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavSection();
    initGalleryFilter();
    initPersonFilter();
    initAlbumModal();
    initLightbox();
    initScrollReveal();
    initTextareaAutoResize();
    initContactForm();
});
