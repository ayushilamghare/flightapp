// Get DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const navLinks = document.querySelectorAll('.nav-links a');

// ===== HAMBURGER MENU FUNCTIONALITY =====
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== MODAL FUNCTIONALITY =====

// Login Button - Open Login Modal
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
});

// Signup Button - Open Signup Modal
signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
});

// Close Login Modal
closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close Signup Modal
closeSignupModal.addEventListener('click', () => {
    signupModal.style.display = 'none';
});

// Close modal when clicking outside of it (Login Modal)
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

// ===== USER AUTHENTICATION SYSTEM =====

// Initialize users from localStorage
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Get all registered users
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Save user to localStorage
function saveUser(userData) {
    const users = getUsers();
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
}

// Check if email already exists
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Verify login credentials
function verifyLogin(email, password) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
}

// Set current logged-in user
function setLoggedInUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateNavbarForLoggedIn(user);
}

// Get current logged-in user
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    updateNavbarForLoggedOut();
}

// Show custom success popup
function showSuccessPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">✓</div>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="popup-btn">Continue</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    popup.style.display = 'block';
    
    popup.querySelector('.popup-btn').addEventListener('click', () => {
        popup.style.display = 'none';
        popup.remove();
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.display = 'none';
            popup.remove();
        }
    }, 5000);
}

// Show error popup
function showErrorPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">✕</div>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="popup-btn">Try Again</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    popup.style.display = 'block';
    
    popup.querySelector('.popup-btn').addEventListener('click', () => {
        popup.style.display = 'none';
        popup.remove();
    });
    
    // Auto close after 4 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.display = 'none';
            popup.remove();
        }
    }, 4000);
}

// Update navbar when logged in
function updateNavbarForLoggedIn(user) {
    const authButtons = document.querySelector('.auth-buttons');
    const currentUser = getLoggedInUser();
    
    if (currentUser) {
        authButtons.innerHTML = `
            <span class="user-name">Welcome, ${currentUser.name}!</span>
            <button class="btn btn-logout" id="logoutBtn">Logout</button>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            logoutUser();
        });
    }
}

// Update navbar when logged out
function updateNavbarForLoggedOut() {
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <button class="btn btn-login" id="loginBtn">Login</button>
        <button class="btn btn-signup" id="signupBtn">Sign Up</button>
    `;
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        loginModal.style.display = 'block';
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
    
    document.getElementById('signupBtn').addEventListener('click', () => {
        signupModal.style.display = 'block';
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    initializeUsers();
    const currentUser = getLoggedInUser();
    if (currentUser) {
        updateNavbarForLoggedIn(currentUser);
    }
});

// ===== FORM SUBMISSION HANDLING =====

// Login Form Submit
const loginForm = loginModal.querySelector('form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showErrorPopup('Missing Fields', 'Please fill in all fields');
        return;
    }

    const user = verifyLogin(email, password);
    
    if (user) {
        setLoggedInUser(user);
        showSuccessPopup('Login Successful', `Welcome back, ${user.name}!`);
        loginForm.reset();
        loginModal.style.display = 'none';
    } else {
        showErrorPopup('Login Failed', 'Invalid email or password');
    }
});

// Signup Form Submit
const signupForm = signupModal.querySelector('form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirm').value;

    if (!name || !email || !password || !confirmPassword) {
        showErrorPopup('Missing Fields', 'Please fill in all fields');
        return;
    }

    // Check for duplicate email
    if (emailExists(email)) {
        showErrorPopup('Email Already Used', 'This email is already registered. Please login or use a different email.');
        return;
    }

    if (password !== confirmPassword) {
        showErrorPopup('Password Mismatch', 'Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        showErrorPopup('Weak Password', 'Password must be at least 6 characters long');
        return;
    }

    // Valid email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorPopup('Invalid Email', 'Please enter a valid email address');
        return;
    }

    // Create new user
    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    saveUser(newUser);
    setLoggedInUser(newUser);
    
    showSuccessPopup('Account Created', `Welcome, ${name}! Your account has been created.`);
    signupForm.reset();
    signupModal.style.display = 'none';
});

// ===== CAROUSEL FUNCTIONALITY =====
function scrollCarousel(carouselType, direction) {
    let carouselId;
    
    if (carouselType === 'destinations') {
        carouselId = 'destinationsCarousel';
    } else if (carouselType === 'benefits') {
        carouselId = 'benefitsCarousel';
    } else if (carouselType === 'testimonials') {
        carouselId = 'testimonialsCarousel';
    }
    
    const carousel = document.getElementById(carouselId);
    if (carousel) {
        const scrollAmount = 250;
        carousel.scrollLeft += direction * scrollAmount;
    }
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value.trim();
        
        if (email) {
            showSuccessPopup('Subscribed!', `Welcome to SkyWings newsletter! Check your email at ${email}`);
            newsletterForm.reset();
        }
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ===== KEYBOARD ACCESSIBILITY =====
// Close modal with ESC key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }
});

// ===== CONTACT FORM HANDLER =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        // Store contact message in localStorage (for demo purposes)
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        const contactMessage = {
            id: 'CM' + Date.now(),
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        messages.push(contactMessage);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Show success message
        showSuccessPopup('Message Sent!', 'Thank you for contacting us. We will get back to you soon!');
        
        // Reset form
        contactForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== HERO IMAGE CAROUSEL =====
let heroCarouselIndex = 0;
const heroImages = document.querySelectorAll('.hero-carousel-img');
function showHeroCarouselImage(idx) {
    heroImages.forEach((img, i) => {
        img.classList.toggle('active', i === idx);
    });
}
function moveHeroCarousel(dir) {
    heroCarouselIndex = (heroCarouselIndex + dir + heroImages.length) % heroImages.length;
    showHeroCarouselImage(heroCarouselIndex);
}
// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    showHeroCarouselImage(heroCarouselIndex);
});
