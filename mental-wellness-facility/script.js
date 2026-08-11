console.log('PHO Wellness Center - Public Site Starting...');

let supabaseClient = null;

// Initialize Supabase client
function initSupabase() {
  console.log('🔧 Initializing Supabase...');
  try {
    if (typeof window.supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase client initialized for public site');
    } else {
      console.warn('⚠️ Supabase library or configuration missing. Relying on fallback mechanisms.');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
  initSupabase();
  await renderActivitiesHome();
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  const successModalOverlay = document.getElementById('success-modal-overlay');
  if (successModalOverlay) {
    successModalOverlay.addEventListener('click', (e) => {
      if (e.target.id === 'success-modal-overlay') {
        closeSuccessModal();
      }
    });
  }

  const consultForm = document.getElementById('consult-form');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitConsultation();
    });
  }

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  const contactInput = document.getElementById('consult-contact');
  if (contactInput) {
    contactInput.addEventListener('input', (e) => {
      // Allow only digits and limit to maximum 11 numbers
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
    });
  }
  
  console.log('✅ PHO Wellness Center Public Site Loaded!');
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// --------------------------
// Carousel
// --------------------------
let currentSlide = 0;
const totalSlides = 3;
const slideInterval = 5000; // 5 seconds

function showSlide(n) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  
  slides.forEach(slide => slide.classList.remove('active'));
  currentSlide = (n + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

document.addEventListener('DOMContentLoaded', () => {
  showSlide(0);
  setInterval(nextSlide, slideInterval);
});

// --------------------------
// Consultation Modal
// --------------------------
let currentService = '';

function openConsultModal(service) {
  currentService = service || '';
  const serviceInput = document.getElementById('consult-service');
  const titleElem = document.getElementById('consult-modal-title');
  const modalOverlay = document.getElementById('consult-modal-overlay');

  if (serviceInput) serviceInput.value = currentService;
  if (titleElem) titleElem.textContent = `Book a ${currentService} Consultation`;
  if (modalOverlay) modalOverlay.classList.remove('hidden');
}

function closeConsultModal() {
  const modalOverlay = document.getElementById('consult-modal-overlay');
  const consultForm = document.getElementById('consult-form');
  
  if (modalOverlay) modalOverlay.classList.add('hidden');
  if (consultForm) consultForm.reset();
}

function showSuccessModal(name, contact, service) {
  const detailsContainer = document.getElementById('success-details');
  if (!detailsContainer) return;

  // Safely clear existing content
  detailsContainer.replaceChildren();
  
  const hasDetails = name || contact || service;
  
  if (hasDetails) {
    const items = [
      { label: 'Service', value: service },
      { label: 'Name', value: name },
      { label: 'Contact', value: contact },
      { label: 'Status', value: 'Pending Review', customClass: 'status-pending' }
    ];

    items.forEach(item => {
      if (item.value) {
        const row = document.createElement('div');
        row.className = 'success-details-row';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'label';
        labelSpan.textContent = item.label;

        const valueSpan = document.createElement('span');
        valueSpan.className = 'value';
        if (item.customClass === 'status-pending') {
          valueSpan.style.color = 'var(--green-light)';
        }
        valueSpan.textContent = item.value;

        row.appendChild(labelSpan);
        row.appendChild(valueSpan);
        detailsContainer.appendChild(row);
      }
    });

    detailsContainer.classList.add('visible');
  } else {
    detailsContainer.classList.remove('visible');
  }
  
  const successOverlay = document.getElementById('success-modal-overlay');
  if (successOverlay) successOverlay.classList.remove('hidden');
}

function closeSuccessModal() {
  const successOverlay = document.getElementById('success-modal-overlay');
  if (successOverlay) successOverlay.classList.add('hidden');
}

// Handle form submission safely
async function submitConsultation() {
  const nameInput = document.getElementById('consult-name');
  const contactInput = document.getElementById('consult-contact');
  const serviceInput = document.getElementById('consult-service');
  const submitBtn = document.getElementById('consult-submit-btn');

  const name = nameInput ? nameInput.value.trim() : '';
  const contact = contactInput ? contactInput.value.trim() : '';
  const service = serviceInput ? serviceInput.value.trim() : '';

  if (contact.length !== 11) {
    alert('Please enter a valid 11-digit mobile number (e.g., 09123456789).');
    if (contactInput) contactInput.focus();
    return;
  }
  
  if (submitBtn) submitBtn.classList.add('loading');
  
  const newRequest = {
    service: service,
    name: name,
    contact: contact,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };
  
  try {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabaseClient
      .from('consultation_requests')
      .insert([newRequest])
      .select();
    
    if (error) {
      // Secure logging of raw backend error in console for debugging
      console.error('Supabase error saving consultation request:', error);
      throw new Error('Database operation failed');
    }
    
    console.log('New consultation request saved to Supabase:', data);
    closeConsultModal();
    showSuccessModal(name, contact, service);
  } catch (error) {
    // Graceful fallback to localStorage on network or Supabase error
    console.warn('Falling back to local storage due to error:', error.message || error);
    saveToLocalStorage(newRequest);
    closeConsultModal();
    showSuccessModal(name, contact, service);
  } finally {
    if (submitBtn) submitBtn.classList.remove('loading');
  }
}

function saveToLocalStorage(request) {
  try {
    const rawData = localStorage.getItem('pho_wellness_data');
    let data = rawData ? JSON.parse(rawData) : {};
    if (!data.consultationRequests) data.consultationRequests = [];
    
    request.id = Date.now();
    data.consultationRequests.push(request);
    localStorage.setItem('pho_wellness_data', JSON.stringify(data));
    console.log('Fallback: saved consultation request to localStorage');
  } catch (e) {
    console.error('Secure LocalStorage Error:', e);
  }
}

// --------------------------
// Render Functions
// --------------------------
async function renderActivitiesHome() {
  const container = document.getElementById('activities-container');
  if (!container) return;

  try {
    let activities = [];
    
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('activities')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Supabase fetch error for activities:', error);
      } else if (data) {
        activities = data;
      }
    }
    
    if (!activities.length) {
      // Fallback to localStorage
      try {
        const rawData = localStorage.getItem('pho_wellness_data');
        if (rawData) {
          const localStorageData = JSON.parse(rawData);
          if (localStorageData && Array.isArray(localStorageData.activities)) {
            activities = localStorageData.activities;
          }
        }
      } catch (e) {
        console.error('Error reading activities from localStorage:', e);
      }
    }
    
    // Safely replace container contents
    container.replaceChildren();

    if (!activities || activities.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.style.textAlign = 'center';
      emptyBox.style.padding = '2rem';
      emptyBox.style.color = '#666';

      const emptyTitle = document.createElement('h3');
      emptyTitle.textContent = 'No activities yet';

      const emptyDesc = document.createElement('p');
      emptyDesc.textContent = 'Check back soon!';

      emptyBox.appendChild(emptyTitle);
      emptyBox.appendChild(emptyDesc);
      container.appendChild(emptyBox);
    } else {
      activities.forEach(a => {
        const card = document.createElement('div');
        card.className = 'activity-card';

        const img = document.createElement('img');
        img.src = a.image_url || 'images/EXAMPLE.jpg';
        img.alt = a.title || 'Activity image';
        img.className = 'activity-img';

        const content = document.createElement('div');
        content.className = 'activity-content';

        const title = document.createElement('h3');
        title.textContent = a.title || '';

        const date = document.createElement('p');
        date.className = 'date';
        date.textContent = a.date || '';

        const desc = document.createElement('p');
        desc.textContent = a.description || '';

        content.appendChild(title);
        content.appendChild(date);
        content.appendChild(desc);

        card.appendChild(img);
        card.appendChild(content);

        container.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error rendering activities:', error);
    container.replaceChildren();
    
    const errorBox = document.createElement('div');
    errorBox.style.textAlign = 'center';
    errorBox.style.padding = '2rem';
    errorBox.style.color = '#c62828';
    
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Unable to load activities at this moment. Please try again later.';
    errorBox.appendChild(errorMsg);
    
    container.appendChild(errorBox);
  }
}

