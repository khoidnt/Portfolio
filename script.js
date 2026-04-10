/**
 * script.js - Portfolio interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('menu');
    const mobileLinks = document.querySelectorAll('.menu-links-mobile .nav-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const moreStatus = document.querySelector('.gallery-more-status');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-item img');
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
                    top: targetElement.offsetTop - offset,
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

            const matchingLinks = linksById.get(id) || [];
            matchingLinks.forEach((link) => {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
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

    const initGalleryFilter = () => {
        if (!filterButtons.length || !galleryItems.length) {
            return;
        }

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                if (!filterValue) {
                    return;
                }

                filterButtons.forEach((item) => item.classList.remove('active'));
                button.classList.add('active');

                if (moreStatus) {
                    moreStatus.style.display = filterValue === 'all' ? 'flex' : 'none';
                }

                galleryItems.forEach((galleryItem) => {
                    const category = galleryItem.getAttribute('data-category');
                    const isVisible = filterValue === 'all' || category === filterValue;

                    if (isVisible) {
                        galleryItem.classList.remove('hidden');
                        if (prefersReducedMotion) {
                            galleryItem.style.opacity = '1';
                            galleryItem.style.transform = 'none';
                        } else {
                            requestAnimationFrame(() => {
                                galleryItem.style.opacity = '1';
                                galleryItem.style.transform = 'scale(1)';
                            });
                        }
                    } else {
                        galleryItem.style.opacity = '0';
                        galleryItem.style.transform = prefersReducedMotion ? 'none' : 'scale(0.9)';
                        window.setTimeout(() => {
                            galleryItem.classList.add('hidden');
                        }, prefersReducedMotion ? 0 : 350);
                    }
                });
            });
        });
    };

    const initLightbox = () => {
        if (!lightbox || !lightboxImg || !galleryImages.length) {
            return;
        }

        const openLightbox = (src) => {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            setBodyScrollLock(true);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setBodyScrollLock(false);
            window.setTimeout(() => {
                lightboxImg.src = '';
            }, prefersReducedMotion ? 0 : 400);
        };

        galleryImages.forEach((image) => {
            image.addEventListener('click', () => openLightbox(image.src));
        });

        if (closeLightboxBtn) {
            closeLightboxBtn.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (event) => {
            if (event.target.classList.contains('lightbox-overlay')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    };

    const initScrollReveal = () => {
        if (!revealElements.length) {
            return;
        }

        if (prefersReducedMotion) {
            revealElements.forEach((element) => element.classList.add('visible'));
            return;
        }

        if (!('IntersectionObserver' in window)) {
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
            return isValid;
        };

        fields.forEach((field) => {
            field.addEventListener('input', () => validateField(field));
            field.addEventListener('blur', () => validateField(field));
        });

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const allValid = fields.every((field) => validateField(field));
            if (!allValid) {
                setStatus('Vui lòng kiểm tra lại thông tin trước khi gửi.', 'error');
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
                fields.forEach((field) => field.classList.remove('invalid'));
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

    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavSection();
    initGalleryFilter();
    initLightbox();
    initScrollReveal();
    initTextareaAutoResize();
    initContactForm();
});