// main.js
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            lerp: 0.1,
            wheelMultiplier: 1.1,
            infinite: false,
            gestureOrientation: 'vertical',
            normalizeWheel: true,
            smoothTouch: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');
        const closeMenu = document.getElementById('closeMenu');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');

        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMenu.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        mobileNavOverlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Typing animation logic
        const typingAnimation = () => {
            const typedTextEl = document.querySelector(".typed-text-container");
            const textArray = ["Decoding the Timeless.", "Journey Through the Vedas."];
            const typingDelay = 120;
            const erasingDelay = 80;
            const newTextDelay = 2000; // Delay between words
            let textArrayIndex = 0;
            let charIndex = 0;

            function type() {
                if (charIndex < textArray[textArrayIndex].length) {
                    typedTextEl.textContent += textArray[textArrayIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(type, typingDelay);
                } else {
                    setTimeout(erase, newTextDelay);
                }
            }

            function erase() {
                if (charIndex > 0) {
                    typedTextEl.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                    charIndex--;
                    setTimeout(erase, erasingDelay);
                } else {
                    textArrayIndex++;
                    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                    setTimeout(type, typingDelay + 300);
                }
            }

            if (textArray.length) {
                 setTimeout(type, newTextDelay - 500);
            }
        };


        // Handle loading animation
        window.addEventListener('load', function () {
            const loader = document.getElementById('loader');
            setTimeout(function () {
                loader.classList.add('loader-hidden');
                 // Start typing animation after loader is hidden
                typingAnimation();
            }, 1500);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                lenis.scrollTo(this.getAttribute('href'), {
                    offset: -80,
                    duration: 1.5
                });

                // Update active link
                document.querySelectorAll('nav a, .mobile-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            });
        });

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled-header');
            } else {
                header.classList.remove('scrolled-header');
            }
        });

        // Form submission
        document.getElementById('consultationForm').addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for your consultation request! Abhishek will contact you within 24 hours.');
            this.reset();
        });

        // Section observer for active navigation
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a, .mobile-nav a');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });