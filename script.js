// M5 Website - Interactive Features and Product Management
class M5Website {
    constructor() {
        this.products = this.loadProducts();
        this.submissions = this.loadSubmissions();
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.isAdmin = false;
        this.adminPassword = this.getAdminPassword();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateStats();
        this.setupSmoothScrolling();
        this.setupParticleEffects();
        this.loadSettings();
        this.updateNavigation();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Buttons
        document.getElementById('submitProductBtn').addEventListener('click', () => this.openModal('submitProductModal'));
        document.getElementById('adminLoginBtn').addEventListener('click', () => this.openModal('adminLoginModal'));
        document.getElementById('adminBtn').addEventListener('click', () => this.openModal('adminModal'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('exploreBtn').addEventListener('click', () => this.scrollToSection('products'));
        document.getElementById('submitBtn').addEventListener('click', () => this.openModal('submitProductModal'));

        // Modal Controls
        document.getElementById('closeSubmitModal').addEventListener('click', () => this.closeModal('submitProductModal'));
        document.getElementById('closeLoginModal').addEventListener('click', () => this.closeModal('adminLoginModal'));
        document.getElementById('closeAdminAddModal').addEventListener('click', () => this.closeModal('adminAddProductModal'));
        document.getElementById('closeAdminModal').addEventListener('click', () => this.closeModal('adminModal'));
        document.getElementById('closeDetailModal').addEventListener('click', () => this.closeModal('productDetailModal'));

        // Forms
        document.getElementById('submitProductForm').addEventListener('submit', (e) => this.handleSubmitProduct(e));
        document.getElementById('adminLoginForm').addEventListener('submit', (e) => this.handleAdminLogin(e));
        document.getElementById('adminAddProductForm').addEventListener('submit', (e) => this.handleAdminAddProduct(e));
        document.getElementById('cancelSubmit').addEventListener('click', () => this.closeModal('submitProductModal'));
        document.getElementById('cancelLogin').addEventListener('click', () => this.closeModal('adminLoginModal'));
        document.getElementById('cancelAdminAdd').addEventListener('click', () => this.closeModal('adminAddProductModal'));

        // Admin Panel
        document.getElementById('adminAddProduct').addEventListener('click', () => this.openModal('adminAddProductModal'));
        document.getElementById('adminAddProductFromTab').addEventListener('click', () => this.openModal('adminAddProductModal'));
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('exportDataFromTab').addEventListener('click', () => this.exportData());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());

        // Filter and Search
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderProducts();
        });

        // Admin Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabSwitch(e));
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Navigation Handling
    handleNavigation(link) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const target = link.getAttribute('href').substring(1);
        this.scrollToSection(target);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Load admin data if admin modal
            if (modalId === 'adminModal') {
                this.loadSubmissions();
                this.loadAdminProducts();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            
            // Clear form if add product modal
            if (modalId === 'addProductModal') {
                document.getElementById('addProductForm').reset();
            }
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
    }

    // Navigation Management
    updateNavigation() {
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        const adminBtn = document.getElementById('adminBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (this.isAdmin) {
            adminLoginBtn.style.display = 'none';
            adminBtn.style.display = 'inline-flex';
            logoutBtn.style.display = 'inline-flex';
        } else {
            adminLoginBtn.style.display = 'inline-flex';
            adminBtn.style.display = 'none';
            logoutBtn.style.display = 'none';
        }
    }

    // Admin Authentication
    handleAdminLogin(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === this.adminPassword) {
            this.isAdmin = true;
            this.updateNavigation();
            this.closeModal('adminLoginModal');
            this.showNotification('Admin access granted!', 'success');
        } else {
            this.showNotification('Invalid admin password!', 'error');
        }
        
        document.getElementById('adminPassword').value = '';
    }

    logout() {
        this.isAdmin = false;
        this.updateNavigation();
        this.closeAllModals();
        this.showNotification('Logged out successfully!', 'success');
    }

    // Product Submission Management
    handleSubmitProduct(e) {
        e.preventDefault();
        
        const submission = {
            id: Date.now().toString(),
            name: document.getElementById('submitProductName').value,
            description: document.getElementById('submitProductDescription').value,
            price: parseFloat(document.getElementById('submitProductPrice').value),
            category: document.getElementById('submitProductCategory').value,
            image: document.getElementById('submitProductImage').value,
            creator: document.getElementById('submitCreatorName').value,
            email: document.getElementById('submitCreatorEmail').value,
            phone: document.getElementById('submitCreatorPhone').value || '',
            website: document.getElementById('submitCreatorWebsite').value || '',
            dateSubmitted: new Date().toISOString(),
            status: 'pending'
        };

        this.submissions.push(submission);
        this.saveSubmissions();
        this.closeModal('submitProductModal');
        
        // Show success message
        this.showNotification('Product submitted for review! We will contact you soon.', 'success');
        
        // Clear form
        document.getElementById('submitProductForm').reset();
    }

    // Admin Product Management
    handleAdminAddProduct(e) {
        e.preventDefault();
        
        const product = {
            id: Date.now().toString(),
            name: document.getElementById('adminProductName').value,
            description: document.getElementById('adminProductDescription').value,
            price: parseFloat(document.getElementById('adminProductPrice').value),
            category: document.getElementById('adminProductCategory').value,
            image: document.getElementById('adminProductImage').value,
            creator: document.getElementById('adminProductCreator').value,
            dateAdded: new Date().toISOString()
        };

        this.products.push(product);
        this.saveProducts();
        this.renderProducts();
        this.updateStats();
        this.closeModal('adminAddProductModal');
        
        // Show success message
        this.showNotification('Product added successfully!', 'success');
        
        // Clear form
        document.getElementById('adminAddProductForm').reset();
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const filteredProducts = this.getFilteredProducts();
        
        if (filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-gray); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-gray); margin-bottom: 0.5rem;">No products found</h3>
                    <p style="color: var(--text-gray);">Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" onclick="m5Website.showProductDetail('${product.id}')">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <span class="product-category">${this.capitalizeFirst(product.category)}</span>
                    </div>
                    <p class="product-creator">by ${product.creator}</p>
                </div>
            </div>
        `).join('');
    }

    getFilteredProducts() {
        let filtered = this.products;
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm) ||
                product.creator.toLowerCase().includes(this.searchTerm)
            );
        }
        
        return filtered;
    }

    handleFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderProducts();
    }

    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('detailProductName').textContent = product.name;
        document.getElementById('detailProductDescription').textContent = product.description;
        document.getElementById('detailProductPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('detailProductCategory').textContent = this.capitalizeFirst(product.category);
        document.getElementById('detailProductCreator').textContent = product.creator;
        document.getElementById('detailProductImage').src = product.image;
        
        this.openModal('productDetailModal');
    }

    // Admin Panel
    loadAdminProducts() {
        const container = document.getElementById('adminProductsList');
        if (this.products.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No published products yet.</p>';
            return;
        }

        container.innerHTML = this.products.map(product => `
            <div class="admin-product-item">
                <div class="admin-product-info">
                    <h4>${product.name}</h4>
                    <p>by ${product.creator} • $${product.price.toFixed(2)} • ${this.capitalizeFirst(product.category)}</p>
                </div>
                <div class="admin-product-actions">
                    <button class="btn-secondary btn-small" onclick="m5Website.editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger btn-small" onclick="m5Website.deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadSubmissions() {
        const container = document.getElementById('submissionsList');
        if (this.submissions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No pending submissions.</p>';
            return;
        }

        container.innerHTML = this.submissions.map(submission => `
            <div class="submission-item">
                <div class="submission-info">
                    <h4>${submission.name}</h4>
                    <p><strong>Creator:</strong> ${submission.creator}</p>
                    <p><strong>Email:</strong> ${submission.email}</p>
                    <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
                    <p><strong>Website:</strong> ${submission.website || 'Not provided'}</p>
                    <p><strong>Price:</strong> $${submission.price.toFixed(2)} • <strong>Category:</strong> ${this.capitalizeFirst(submission.category)}</p>
                    <p><strong>Description:</strong> ${submission.description}</p>
                    <p><strong>Submitted:</strong> ${new Date(submission.dateSubmitted).toLocaleDateString()}</p>
                </div>
                <div class="submission-actions">
                    <button class="btn-primary btn-small" onclick="m5Website.approveSubmission('${submission.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-secondary btn-small" onclick="m5Website.viewSubmissionImage('${submission.image}')">
                        <i class="fas fa-image"></i> View Image
                    </button>
                    <button class="btn-danger btn-small" onclick="m5Website.rejectSubmission('${submission.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `).join('');
    }

    approveSubmission(submissionId) {
        const submission = this.submissions.find(s => s.id === submissionId);
        if (!submission) return;

        // Create product from submission
        const product = {
            id: Date.now().toString(),
            name: submission.name,
            description: submission.description,
            price: submission.price,
            category: submission.category,
            image: submission.image,
            creator: submission.creator,
            dateAdded: new Date().toISOString()
        };

        // Add to products
        this.products.push(product);
        this.saveProducts();

        // Remove from submissions
        this.submissions = this.submissions.filter(s => s.id !== submissionId);
        this.saveSubmissions();

        // Update displays
        this.renderProducts();
        this.loadSubmissions();
        this.updateStats();

        this.showNotification('Product approved and published!', 'success');
    }

    rejectSubmission(submissionId) {
        if (confirm('Are you sure you want to reject this submission?')) {
            this.submissions = this.submissions.filter(s => s.id !== submissionId);
            this.saveSubmissions();
            this.loadSubmissions();
            this.showNotification('Submission rejected.', 'success');
        }
    }

    viewSubmissionImage(imageUrl) {
        window.open(imageUrl, '_blank');
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.renderProducts();
            this.loadAdminProducts();
            this.updateStats();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCreator').value = product.creator;

        // Store editing product ID
        document.getElementById('addProductForm').dataset.editingId = productId;

        this.closeModal('adminModal');
        this.openModal('addProductModal');
    }

    handleTabSwitch(e) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        e.target.classList.add('active');
        const tabId = e.target.dataset.tab;
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    // Settings Management
    loadSettings() {
        const settings = this.getSettings();
        document.getElementById('siteTitle').value = settings.siteTitle || 'M5';
        document.getElementById('siteDescription').value = settings.siteDescription || 'The Future of Product Discovery';
    }

    saveSettings() {
        const settings = {
            siteTitle: document.getElementById('siteTitle').value,
            siteDescription: document.getElementById('siteDescription').value
        };
        
        // Save admin password if provided
        const newPassword = document.getElementById('adminPasswordSetting').value;
        if (newPassword) {
            this.saveAdminPassword(newPassword);
            document.getElementById('adminPasswordSetting').value = '';
        }
        
        localStorage.setItem('m5-settings', JSON.stringify(settings));
        this.showNotification('Settings saved successfully!', 'success');
        
        // Update page title
        document.title = `${settings.siteTitle} - Futuristic Product Showcase`;
    }

    getSettings() {
        const defaultSettings = {
            siteTitle: 'M5',
            siteDescription: 'The Future of Product Discovery'
        };
        
        try {
            return JSON.parse(localStorage.getItem('m5-settings')) || defaultSettings;
        } catch {
            return defaultSettings;
        }
    }

    // Data Management
    loadProducts() {
        try {
            const saved = localStorage.getItem('m5-products');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
        
        // Return sample products if none exist
        return [
            {
                id: '1',
                name: 'Quantum Display Pro',
                description: 'Revolutionary holographic display technology that projects 3D images in mid-air without any screen.',
                price: 2999.99,
                category: 'tech',
                image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop',
                creator: 'TechVision Inc.',
                dateAdded: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Neural Interface Headset',
                description: 'Direct brain-computer interface allowing seamless control of digital devices through thought.',
                price: 1599.99,
                category: 'innovation',
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
                creator: 'MindLink Technologies',
                dateAdded: new Date().toISOString()
            },
            {
                id: '3',
                name: 'AeroGlide Chair',
                description: 'Floating office chair that hovers using magnetic levitation technology for ultimate comfort.',
                price: 2499.99,
                category: 'design',
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
                creator: 'FutureFurniture Co.',
                dateAdded: new Date().toISOString()
            }
        ];
    }

    loadSubmissions() {
        try {
            const saved = localStorage.getItem('m5-submissions');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading submissions:', error);
        }
        return [];
    }

    saveSubmissions() {
        try {
            localStorage.setItem('m5-submissions', JSON.stringify(this.submissions));
        } catch (error) {
            console.error('Error saving submissions:', error);
            this.showNotification('Error saving submissions!', 'error');
        }
    }

    getAdminPassword() {
        try {
            const saved = localStorage.getItem('m5-admin-password');
            return saved || 'admin123'; // Default password
        } catch (error) {
            console.error('Error loading admin password:', error);
            return 'admin123';
        }
    }

    saveAdminPassword(password) {
        try {
            localStorage.setItem('m5-admin-password', password);
            this.adminPassword = password;
        } catch (error) {
            console.error('Error saving admin password:', error);
        }
    }

    saveProducts() {
        try {
            localStorage.setItem('m5-products', JSON.stringify(this.products));
        } catch (error) {
            console.error('Error saving products:', error);
            this.showNotification('Error saving products!', 'error');
        }
    }

    exportData() {
        const data = {
            products: this.products,
            submissions: this.submissions,
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `m5-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }

    // Statistics
    updateStats() {
        const productCount = this.products.length;
        const creatorCount = new Set(this.products.map(p => p.creator)).size;
        const innovationCount = this.products.filter(p => p.category === 'innovation').length;
        
        this.animateNumber(document.querySelector('.stat-item:nth-child(1) .stat-number'), productCount);
        this.animateNumber(document.querySelector('.stat-item:nth-child(2) .stat-number'), creatorCount);
        this.animateNumber(document.querySelector('.stat-item:nth-child(3) .stat-number'), innovationCount);
    }

    animateNumber(element, target) {
        if (!element) return;
        
        const start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Visual Effects
    setupParticleEffects() {
        // Add mouse trail effect
        let mouseTrail = [];
        const maxTrailLength = 20;
        
        document.addEventListener('mousemove', (e) => {
            mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (mouseTrail.length > maxTrailLength) {
                mouseTrail.shift();
            }
            
            // Remove old trail points
            mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
            
            this.updateMouseTrail(mouseTrail);
        });
    }

    updateMouseTrail(trail) {
        // Remove existing trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());
        
        // Add new trail elements
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            trailElement.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${(index / trail.length) * 0.5};
                transform: translate(-50%, -50%);
                transition: opacity 0.1s ease;
            `;
            document.body.appendChild(trailElement);
            
            // Remove after animation
            setTimeout(() => {
                if (trailElement.parentNode) {
                    trailElement.parentNode.removeChild(trailElement);
                }
            }, 1000);
        });
    }

    // Utility Functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-color)' : type === 'error' ? 'var(--secondary-color)' : 'var(--accent-color)'};
            color: var(--text-light);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-glow);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.m5Website = new M5Website();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.product-card, .stat-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add some additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Button ripple effect
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
