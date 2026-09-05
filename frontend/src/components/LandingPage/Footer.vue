<template>
  <footer class="footer">
    <div class="footer-top-border"></div>
    <div class="container">
      <div class="footer-grid">
        <!-- Brand Section -->
        <div class="footer-brand animate-fade-up">
          <a href="#" class="logo">
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.986 0L0 17.525H10.158L7.863 32L24 12.019H12.986V0Z" fill="var(--primary)"/>
            </svg>
            <span>ENERGY AGENCY</span>
          </a>
          <p class="brand-desc">
            Premium renewable energy solutions built for homes and businesses. Transitioning the world to clean power.
          </p>
          
          <div class="social-icons">
            <a href="#" class="social-icon" title="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Links Section -->
        <div class="footer-links-group animate-fade-up delay-100">
          <h4 class="footer-title">Company</h4>
          <ul class="footer-links">
            <li><router-link to="/#about">About Us</router-link></li>
            <li><router-link to="/#projects">Our Projects</router-link></li>
            <li><a href="#">Marketplace</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        
        <div class="footer-links-group animate-fade-up delay-200">
          <h4 class="footer-title">Services</h4>
          <ul class="footer-links">
            <li><a href="#">Solar Installation</a></li>
            <li><a href="#">Battery Storage</a></li>
            <li><a href="#">System Monitoring</a></li>
            <li><a href="#">Maintenance</a></li>
          </ul>
        </div>
        
        <!-- Newsletter Section -->
        <div class="footer-newsletter animate-fade-up delay-300">
          <h4 class="footer-title">Stay Updated</h4>
          <p class="newsletter-desc">Subscribe to our newsletter for the latest solar news and exclusive offers.</p>
          <form class="newsletter-form" @submit.prevent>
            <input type="email" placeholder="Enter your email" required class="newsletter-input" />
            <button type="submit" class="newsletter-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          <div class="contact-info">
            <a href="mailto:contact@energy.inc">contact@energy.inc</a>
            <span>+212 690 000 000</span>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom animate-fade-up delay-400">
        <p>&copy; 2026 Energy Agency. All rights reserved.</p>
        <div class="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background-color: #020d07; /* Ultra dark green to match hero */
  color: #f0fdf4;
  padding-top: 6rem;
  overflow: hidden;
}

.footer-top-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 128, 0.3) 50%, transparent 100%);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 5rem;
}

.footer-brand {
  padding-right: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
}

.logo span {
  color: #f0fdf4;
}

.brand-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(240, 253, 244, 0.6);
  margin-bottom: 2rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(240, 253, 244, 0.05);
  border: 1px solid rgba(240, 253, 244, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: rgba(240, 253, 244, 0.8);
}

.social-icon:hover {
  background-color: var(--primary);
  color: #020d07;
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(74, 222, 128, 0.2);
  border-color: var(--primary);
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #f0fdf4;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.footer-links a {
  font-size: 0.95rem;
  color: rgba(240, 253, 244, 0.6);
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--primary);
  transform: translateX(4px);
}

.footer-newsletter {
  display: flex;
  flex-direction: column;
}

.newsletter-desc {
  font-size: 0.95rem;
  color: rgba(240, 253, 244, 0.6);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  position: relative;
  margin-bottom: 2rem;
}

.newsletter-input {
  width: 100%;
  background: rgba(240, 253, 244, 0.05);
  border: 1px solid rgba(240, 253, 244, 0.1);
  padding: 14px 20px;
  padding-right: 50px; /* space for button */
  border-radius: 8px;
  color: #f0fdf4;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s;
}

.newsletter-input:focus {
  border-color: var(--primary);
  background: rgba(240, 253, 244, 0.08);
}

.newsletter-input::placeholder {
  color: rgba(240, 253, 244, 0.4);
}

.newsletter-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  bottom: 6px;
  width: 36px;
  background: var(--primary);
  color: #020d07;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.newsletter-btn:hover {
  background: #22c55e;
  transform: scale(1.05);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: rgba(240, 253, 244, 0.8);
}

.contact-info a {
  transition: color 0.2s ease;
}

.contact-info a:hover {
  color: var(--primary);
}

.footer-bottom {
  border-top: 1px solid rgba(240, 253, 244, 0.1);
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(240, 253, 244, 0.5);
}

.footer-legal {
  display: flex;
  gap: 2rem;
}

.footer-legal a {
  transition: color 0.2s ease;
}

.footer-legal a:hover {
  color: var(--primary);
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 4rem 2rem;
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .footer-brand {
    padding-right: 0;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}
</style>
