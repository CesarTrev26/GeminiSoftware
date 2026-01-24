const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api';
let token = localStorage.getItem('token');
let currentTab = 'projects';

// Helper function to handle API calls with auth
async function apiCall(url, options = {}) {
  const currentToken = localStorage.getItem('token');
  
  if (!currentToken && !options.skipAuth) {
    localStorage.clear();
    showLogin();
    throw new Error('No token found');
  }
  
  const response = await fetch(url, options);
  
  // Check for auth errors
  if (response.status === 401 || response.status === 403) {
    const data = await response.json().catch(() => ({}));
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    token = null;
    alert('Sesión expirada. Por favor inicia sesión nuevamente.');
    showLogin();
    throw new Error(data.message || 'Token expired');
  }
  
  return response;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard();
    loadStats();
    loadProjects();
  } else {
    showLogin();
  }
});

// Auth Functions
function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  const btnText = document.getElementById('loginBtnText');
  const btnLoading = document.getElementById('loginBtnLoading');
  
  errorDiv.classList.add('hidden');
  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      token = data.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('adminToken', token); // Backward compatibility
      document.getElementById('adminName').textContent = data.data.user.name || data.data.user.email;
      showDashboard();
      loadStats();
      loadProjects();
    } else {
      errorDiv.textContent = data.message || 'Error al iniciar sesión';
      errorDiv.classList.remove('hidden');
    }
  } catch (error) {
    errorDiv.textContent = 'Error de conexión. Verifica que el servidor esté corriendo.';
    errorDiv.classList.remove('hidden');
  } finally {
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
  token = null;
  showLogin();
}

// Tab Functions
function switchTab(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
  document.getElementById(`${tab}Tab`).classList.remove('hidden');
  
  // Load data
  if (tab === 'projects') loadProjects();
  else if (tab === 'services') loadServices();
  else if (tab === 'contacts') loadContacts();
}

// Stats Functions
async function loadStats() {
  try {
    const [projectsRes, servicesRes] = await Promise.all([
      fetch(`${API_URL}/projects`),
      fetch(`${API_URL}/services`)
    ]);
    
    const projectsData = await projectsRes.json();
    const servicesData = await servicesRes.json();
    
    if (projectsData.success) {
      const projects = projectsData.data;
      document.getElementById('statsProjects').textContent = projects.length;
      document.getElementById('statsPublished').textContent = projects.filter(p => p.published).length;
    }
    
    if (servicesData.success) {
      document.getElementById('statsServices').textContent = servicesData.data.length;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Projects Functions
async function loadProjects() {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (data.success) {
      renderProjectsTable(data.data);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projectsTableBody').innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-16">
          <div class="flex flex-col items-center gap-3">
            <svg class="w-12 h-12 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-red-500/70 font-medium">Error al cargar proyectos</p>
          </div>
        </td>
      </tr>`;
  }
}

function renderProjectsTable(projects) {
  const tbody = document.getElementById('projectsTableBody');
  
  if (projects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-16">
          <div class="flex flex-col items-center gap-3">
            <svg class="w-12 h-12 text-dark-blue-500/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
            <p class="text-dark-blue-500/40 font-medium">No hay proyectos</p>
          </div>
        </td>
      </tr>`;
    return;
  }
  
  tbody.innerHTML = projects.map(project => `
    <tr>
      <td class="font-semibold text-dark-blue-500">${project.title}</td>
      <td class="text-dark-blue-500/60">${project.client || '-'}</td>
      <td>
        <span class="badge badge-info">
          ${project.category}
        </span>
      </td>
      <td class="text-dark-blue-500/70 font-medium">${project.year}</td>
      <td>
        <div class="flex flex-col gap-1">
          <span class="badge ${project.published ? 'badge-success' : 'badge-warning'}">
            ${project.published ? '✓ Publicado' : '● Borrador'}
          </span>
          ${project.inProgress ? '<span class="badge" style="background: #f59e0b; color: white;">🔧 En Progreso</span>' : ''}
        </div>
      </td>
      <td class="text-center">
        ${project.featured ? '<span class="text-amber-500 text-xl">★</span>' : '<span class="text-dark-blue-500/20 text-xl">☆</span>'}
      </td>
      <td>
        <div class="flex gap-2 justify-center">
          <button onclick='editProject(${JSON.stringify(project).replace(/'/g, "&apos;")})' 
            class="action-btn action-btn-edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Editar
          </button>
          <button onclick="deleteProject('${project.id}')" 
            class="action-btn action-btn-delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openProjectModal() {
  document.getElementById('projectModalTitle').textContent = 'Nuevo Proyecto';
  document.getElementById('projectForm').reset();
  document.getElementById('projectId').value = '';
  loadProjectImages([]);
  loadProjectResults([]);
  loadContentBlocks('');
  projectImagesPendingUpload = []; // Clear pending uploads
  document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('active');
  projectImagesPendingUpload = []; // Clear pending uploads on close
}

function editProject(project) {
  document.getElementById('projectModalTitle').textContent = 'Editar Proyecto';
  document.getElementById('projectId').value = project.id;
  document.getElementById('projectTitle').value = project.title;
  document.getElementById('projectSlug').value = project.slug;
  document.getElementById('projectCategory').value = project.category;
  document.getElementById('projectClient').value = project.client || '';
  document.getElementById('projectYear').value = project.year;
  document.getElementById('projectSubtitle').value = project.subtitle || '';
  document.getElementById('projectDescription').value = project.description;
  
  // Load content blocks
  loadContentBlocks(project.longDescription || '');
  
  document.getElementById('projectDuration').value = project.duration || '';
  document.getElementById('projectWebsite').value = project.website || '';
  document.getElementById('projectTags').value = Array.isArray(project.tags) ? project.tags.join(', ') : '';
  document.getElementById('projectType').value = project.projectType || '';
  document.getElementById('projectOrder').value = project.order || 0;
  document.getElementById('projectPublished').checked = project.published;
  document.getElementById('projectFeatured').checked = project.featured;
  document.getElementById('projectInProgress').checked = project.inProgress || false;
  
  // Load images
  loadProjectImages(project.images || []);
  
  // Load results
  const results = typeof project.results === 'string' ? JSON.parse(project.results) : (project.results || []);
  loadProjectResults(results);
  
  document.getElementById('projectModal').classList.add('active');
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('projectId').value;
  const isEdit = !!id;
  
  // Debug: Check checkbox states
  const inProgressChecked = document.getElementById('projectInProgress').checked;
  console.log('Form submission - In Progress checked:', inProgressChecked);
  
  const saveBtn = document.getElementById('projectSaveBtn');
  const saveLoading = document.getElementById('projectSaveLoading');
  saveBtn.style.display = 'none';
  saveLoading.style.display = 'block';
  
  try {
    // Upload pending images first
    if (projectImagesPendingUpload.length > 0) {
      await uploadPendingImages();
    }
    
    const projectData = {
      title: document.getElementById('projectTitle').value,
      slug: document.getElementById('projectSlug').value,
      category: document.getElementById('projectCategory').value,
      client: document.getElementById('projectClient').value || null,
      year: document.getElementById('projectYear').value,
      subtitle: document.getElementById('projectSubtitle').value || null,
      description: document.getElementById('projectDescription').value,
      longDescription: document.getElementById('projectLongDescription').value || null,
      duration: document.getElementById('projectDuration').value || null,
      website: document.getElementById('projectWebsite').value || null,
      tags: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
      results: getProjectResults(),
      images: getProjectImages(),
      projectType: document.getElementById('projectType').value || null,
      inProgress: document.getElementById('projectInProgress').checked,
      order: parseInt(document.getElementById('projectOrder').value) || 0,
      published: document.getElementById('projectPublished').checked,
      featured: document.getElementById('projectFeatured').checked,
    };
    
    const url = isEdit ? `${API_URL}/projects/${id}` : `${API_URL}/projects`;
    const method = isEdit ? 'PUT' : 'POST';
    
    const response = await apiCall(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeProjectModal();
      loadProjects();
      loadStats();
      alert(isEdit ? 'Proyecto actualizado' : 'Proyecto creado');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    if (error.message === 'Token expired' || error.message.includes('Token')) {
      return; // Token error already handled
    }
    console.error('Error saving project:', error);
    alert('Error al guardar el proyecto: ' + error.message);
  } finally {
    saveBtn.style.display = 'block';
    saveLoading.style.display = 'none';
  }
});

async function deleteProject(id) {
  if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
  
  try {
    const response = await apiCall(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      loadProjects();
      loadStats();
      alert('Proyecto eliminado');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    if (error.message === 'Token expired' || error.message.includes('Token')) {
      return; // Token error already handled
    }
    console.error('Error deleting project:', error);
    alert('Error al eliminar el proyecto');
  }
}

// Services Functions
async function loadServices() {
  try {
    const response = await fetch(`${API_URL}/services`);
    const data = await response.json();
    
    if (data.success) {
      renderServicesTable(data.data);
    }
  } catch (error) {
    console.error('Error loading services:', error);
    document.getElementById('servicesTableBody').innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-16">
          <div class="flex flex-col items-center gap-3">
            <svg class="w-12 h-12 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-red-500/70 font-medium">Error al cargar servicios</p>
          </div>
        </td>
      </tr>`;
  }
}

function renderServicesTable(services) {
  const tbody = document.getElementById('servicesTableBody');
  
  if (services.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-16">
          <div class="flex flex-col items-center gap-3">
            <svg class="w-12 h-12 text-dark-blue-500/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p class="text-dark-blue-500/40 font-medium">No hay servicios</p>
          </div>
        </td>
      </tr>`;
    return;
  }
  
  tbody.innerHTML = services.map(service => `
    <tr>
      <td class="font-semibold text-dark-blue-500">${service.title}</td>
      <td class="text-dark-blue-500/50 font-mono text-sm">${service.slug}</td>
      <td>
        <span class="badge badge-info">
          #${service.order}
        </span>
      </td>
      <td>
        <span class="badge ${service.published ? 'badge-success' : 'badge-warning'}">
          ${service.published ? '✓ Publicado' : '● Borrador'}
        </span>
      </td>
      <td>
        <div class="flex gap-2 justify-center">
          <button onclick='editService(${JSON.stringify(service).replace(/'/g, "&apos;")})' 
            class="action-btn action-btn-edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Editar
          </button>
          <button onclick="deleteService('${service.id}')" 
            class="action-btn action-btn-delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openServiceModal() {
  document.getElementById('serviceModalTitle').textContent = 'Nuevo Servicio';
  document.getElementById('serviceForm').reset();
  document.getElementById('serviceId').value = '';
  document.getElementById('serviceModal').classList.add('active');
}

function closeServiceModal() {
  document.getElementById('serviceModal').classList.remove('active');
}

function editService(service) {
  document.getElementById('serviceModalTitle').textContent = 'Editar Servicio';
  document.getElementById('serviceId').value = service.id;
  document.getElementById('serviceTitle').value = service.title;
  document.getElementById('serviceSlug').value = service.slug;
  document.getElementById('serviceDescription').value = service.description;
  document.getElementById('serviceIcon').value = service.icon || '';
  document.getElementById('serviceOrder').value = service.order || 0;
  document.getElementById('servicePublished').checked = service.published;
  document.getElementById('serviceModal').classList.add('active');
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('serviceId').value;
  const isEdit = !!id;
  
  const serviceData = {
    title: document.getElementById('serviceTitle').value,
    slug: document.getElementById('serviceSlug').value,
    description: document.getElementById('serviceDescription').value,
    icon: document.getElementById('serviceIcon').value || null,
    order: parseInt(document.getElementById('serviceOrder').value) || 0,
    published: document.getElementById('servicePublished').checked,
  };
  
  const saveBtn = document.getElementById('serviceSaveBtn');
  const saveLoading = document.getElementById('serviceSaveLoading');
  saveBtn.style.display = 'none';
  saveLoading.style.display = 'block';
  
  try {
    const url = isEdit ? `${API_URL}/services/${id}` : `${API_URL}/services`;
    const method = isEdit ? 'PUT' : 'POST';
    
    const response = await apiCall(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serviceData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeServiceModal();
      loadServices();
      loadStats();
      alert(isEdit ? 'Servicio actualizado' : 'Servicio creado');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    if (error.message === 'Token expired' || error.message.includes('Token')) {
      return; // Token error already handled
    }
    console.error('Error saving service:', error);
    alert('Error al guardar el servicio');
  } finally {
    saveBtn.style.display = 'block';
    saveLoading.style.display = 'none';
  }
});

async function deleteService(id) {
  if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
  
  try {
    const response = await apiCall(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      loadServices();
      loadStats();
      alert('Servicio eliminado');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    if (error.message === 'Token expired' || error.message.includes('Token')) {
      return; // Token error already handled
    }
    console.error('Error deleting service:', error);
    alert('Error al eliminar el servicio');
  }
}

// Contacts Functions
async function loadContacts() {
  const tbody = document.getElementById('contactsTableBody');
  
  try {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8">
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 text-cyan-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-dark-blue-500/60">Cargando contactos...</span>
          </div>
        </td>
      </tr>`;

    const response = await fetch(`${API_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar contactos');
    }
    
    const contacts = data.data || [];
    
    // Update stats
    const statsContacts = document.getElementById('statsContacts');
    if (statsContacts) statsContacts.textContent = contacts.length;
    
    if (contacts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-16">
            <div class="flex flex-col items-center gap-3">
              <svg class="w-12 h-12 text-dark-blue-500/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <p class="text-dark-blue-500/40 font-medium">No hay contactos aún</p>
            </div>
          </td>
        </tr>`;
      return;
    }
    
    tbody.innerHTML = contacts.map(contact => {
      const date = new Date(contact.createdAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        CONTACTED: 'bg-blue-100 text-blue-700',
        RESOLVED: 'bg-green-100 text-green-700',
        ARCHIVED: 'bg-gray-100 text-gray-700'
      };
      
      const statusLabels = {
        PENDING: 'Pendiente',
        CONTACTED: 'Contactado',
        RESOLVED: 'Resuelto',
        ARCHIVED: 'Archivado'
      };
      
      return `
        <tr class="border-b border-dark-blue-500/5 hover:bg-dark-blue-500/5 transition-colors">
          <td class="px-6 py-4">
            <div class="flex flex-col">
              <span class="font-medium text-dark-blue-500">${contact.name}</span>
              <span class="text-sm text-dark-blue-500/50">${date}</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-col gap-1">
              <a href="mailto:${contact.email}" class="text-sm text-cyan-600 hover:text-cyan-700">${contact.email}</a>
              ${contact.phone ? `<a href="tel:${contact.phone}" class="text-sm text-dark-blue-500/60">${contact.phone}</a>` : '<span class="text-sm text-dark-blue-500/30">-</span>'}
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="text-sm text-dark-blue-500/70">${contact.service || '-'}</span>
          </td>
          <td class="px-6 py-4 max-w-xs">
            <p class="text-sm text-dark-blue-500/70 line-clamp-2">${contact.message}</p>
          </td>
          <td class="px-6 py-4">
            <select 
              class="px-3 py-1 rounded-full text-xs font-medium ${statusColors[contact.status] || statusColors.PENDING}"
              onchange="updateContactStatus('${contact.id}', this.value)"
            >
              ${Object.keys(statusLabels).map(key => `
                <option value="${key}" ${contact.status === key ? 'selected' : ''}>${statusLabels[key]}</option>
              `).join('')}
            </select>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <button 
                onclick="viewContactDetails('${contact.id}')"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button 
                onclick="deleteContact('${contact.id}')"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
    
  } catch (error) {
    console.error('Error loading contacts:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8">
          <p class="text-red-500">Error al cargar contactos: ${error.message}</p>
        </td>
      </tr>`;
  }
}

async function updateContactStatus(contactId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar estado');
    }
    
    showNotification('Estado actualizado correctamente', 'success');
  } catch (error) {
    console.error('Error updating contact status:', error);
    showNotification('Error al actualizar estado', 'error');
    loadContacts(); // Reload to revert UI
  }
}

async function viewContactDetails(contactId) {
  try {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    const data = await response.json();
    const contact = data.data.find(c => c.id === contactId);
    
    if (!contact) {
      showNotification('Contacto no encontrado', 'error');
      return;
    }
    
    const date = new Date(contact.createdAt).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    alert(`
DETALLES DEL CONTACTO
━━━━━━━━━━━━━━━━━━━━━━

Nombre: ${contact.name}
Email: ${contact.email}
Teléfono: ${contact.phone || 'No proporcionado'}
Servicio: ${contact.service || 'No especificado'}
Fecha: ${date}

Mensaje:
${contact.message}

${contact.source ? `Origen: ${contact.source}` : ''}
${contact.ip ? `IP: ${contact.ip}` : ''}
    `.trim());
    
  } catch (error) {
    console.error('Error viewing contact:', error);
    showNotification('Error al cargar detalles', 'error');
  }
}

async function deleteContact(contactId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar contacto');
    }
    
    showNotification('Contacto eliminado correctamente', 'success');
    loadContacts();
  } catch (error) {
    console.error('Error deleting contact:', error);
    showNotification('Error al eliminar contacto', 'error');
  }
}


// ============================================
// PROJECT IMAGES MANAGEMENT
// ============================================
let projectImageCounter = 0;
let projectImagesPendingUpload = []; // Store images locally until project save

function addProjectImage(url = '', alt = '', caption = '', file = null) {
  const container = document.getElementById('projectImagesContainer');
  const imageId = `project-image-${projectImageCounter++}`;
  
  const imageRow = document.createElement('div');
  imageRow.className = 'flex gap-3 items-start bg-white rounded-lg p-4 border border-dark-blue-500/10';
  imageRow.dataset.imageId = imageId;
  
  // Store file data for later upload
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = imageRow.querySelector('.image-preview-container');
      if (preview) {
        preview.innerHTML = `<img src="${e.target.result}" alt="${alt}" class="w-full h-32 object-cover rounded-lg border border-dark-blue-500/10" />`;
      }
      projectImagesPendingUpload.push({
        imageId: imageId,
        file: file,
        base64: e.target.result
      });
    };
    reader.readAsDataURL(file);
  }
  
  imageRow.innerHTML = `
    <div class="flex-1 space-y-3">
      <div>
        <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Imagen</label>
        ${url || file ? `
          <div class="relative mb-2 image-preview-container">
            ${url ? `<img src="${url}" alt="${alt}" class="w-full h-32 object-cover rounded-lg border border-dark-blue-500/10" />` : '<div class="w-full h-32 bg-dark-blue-500/5 rounded-lg animate-pulse"></div>'}
          </div>
        ` : ''}
        <input type="hidden" class="project-image-url" value="${url}" />
        <input type="hidden" class="project-image-is-new" value="${file ? 'true' : 'false'}" />
        ${file ? `<p class="text-xs text-cyan-600 font-medium"><svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Pendiente de subir</p>` : ''}
      </div>
      <div>
        <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Texto alternativo (opcional)</label>
        <input 
          type="text" 
          class="project-image-alt w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" 
          placeholder="Descripción de la imagen"
          value="${alt}"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Leyenda (opcional)</label>
        <input 
          type="text" 
          class="project-image-caption w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" 
          placeholder="Texto que se muestra debajo de la imagen"
          value="${caption || ''}"
        />
      </div>
    </div>
    <button 
      type="button" 
      onclick="removeProjectImage('${imageId}')"
      class="w-8 h-8 flex-shrink-0 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex items-center justify-center mt-6"
      title="Eliminar imagen"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    </button>
  `;
  
  container.appendChild(imageRow);
}

// Handle multiple image files at once
function handleMultipleImages() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo "${file.name}" es demasiado grande. El tamaño máximo es 5MB.`);
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`El archivo "${file.name}" no es una imagen válida.`);
        return;
      }
      
      // Add image row with file (will be uploaded on save)
      addProjectImage('', '', '', file);
    });
  };
  
  input.click();
}

// Upload pending images when saving project
async function uploadPendingImages() {
  const uploadedUrls = {};
  
  for (const pending of projectImagesPendingUpload) {
    try {
      const formData = new FormData();
      formData.append('image', pending.file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        uploadedUrls[pending.imageId] = `${API_URL.replace('/api', '')}${data.data.url}`;
        
        // Update the UI
        const imageRow = document.querySelector(`[data-image-id="${pending.imageId}"]`);
        if (imageRow) {
          imageRow.querySelector('.project-image-url').value = uploadedUrls[pending.imageId];
          imageRow.querySelector('.project-image-is-new').value = 'false';
        }
      } else {
        throw new Error(data.message || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Error al subir imagen: ${pending.file.name}`);
    }
  }
  
  projectImagesPendingUpload = [];
  return uploadedUrls;
}

function removeProjectImage(imageId) {
  const imageRow = document.querySelector(`[data-image-id="${imageId}"]`);
  if (imageRow) {
    imageRow.remove();
  }
  
  // Remove from pending uploads if exists
  projectImagesPendingUpload = projectImagesPendingUpload.filter(p => p.imageId !== imageId);
}

// ========================================
// PROJECT RESULTS MANAGEMENT
// ========================================
let projectResultCounter = 0;

function addProjectResult(value = '', label = '') {
  const container = document.getElementById('projectResultsContainer');
  const resultId = `project-result-${projectResultCounter++}`;
  
  const resultRow = document.createElement('div');
  resultRow.className = 'flex gap-3 items-start bg-white rounded-lg p-4 border border-dark-blue-500/10';
  resultRow.dataset.resultId = resultId;
  
  resultRow.innerHTML = `
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Valor/Métrica</label>
        <input 
          type="text" 
          class="result-value w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" 
          placeholder="Ej: 50%, 10K, +200%"
          value="${value}"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Descripción</label>
        <input 
          type="text" 
          class="result-label w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" 
          placeholder="Ej: Aumento en ventas"
          value="${label}"
        />
      </div>
    </div>
    <button 
      type="button" 
      onclick="removeProjectResult('${resultId}')"
      class="w-8 h-8 flex-shrink-0 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex items-center justify-center mt-6"
      title="Eliminar resultado"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `;
  
  container.appendChild(resultRow);
}

function removeProjectResult(resultId) {
  const resultRow = document.querySelector(`[data-result-id="${resultId}"]`);
  if (resultRow) {
    resultRow.remove();
  }
}

function getProjectImages() {
  const imageRows = document.querySelectorAll('#projectImagesContainer > div');
  const images = [];
  
  imageRows.forEach(row => {
    const url = row.querySelector('.project-image-url').value.trim();
    const alt = row.querySelector('.project-image-alt').value.trim();
    const caption = row.querySelector('.project-image-caption').value.trim();
    
    if (url) {
      images.push({ url, alt: alt || null, caption: caption || null });
    }
  });
  
  return images;
}

function getProjectResults() {
  const resultRows = document.querySelectorAll('#projectResultsContainer > div');
  const results = [];
  
  resultRows.forEach(row => {
    const value = row.querySelector('.result-value').value.trim();
    const label = row.querySelector('.result-label').value.trim();
    
    if (value && label) {
      results.push({ value, label });
    }
  });
  
  return results;
}

function loadProjectImages(images) {
  const container = document.getElementById('projectImagesContainer');
  container.innerHTML = '';
  projectImageCounter = 0;
  
  if (images && images.length > 0) {
    images.forEach(image => {
      addProjectImage(image.url, image.alt || '', image.caption || '');
    });
  }
}

function loadProjectResults(results) {
  const container = document.getElementById('projectResultsContainer');
  container.innerHTML = '';
  projectResultCounter = 0;
  
  if (results && results.length > 0) {
    results.forEach(result => {
      addProjectResult(result.value || '', result.label || '');
    });
  }
}

// ============================================
// CONTENT BLOCKS MANAGEMENT
// ============================================
let contentBlockCounter = 0;
let quillEditors = {}; // Store Quill instances

function addContentBlock(type, data = {}) {
  const container = document.getElementById('contentBlocksContainer');
  const blockId = `content-block-${contentBlockCounter++}`;
  
  const blockDiv = document.createElement('div');
  blockDiv.className = 'content-block bg-white rounded-xl border border-dark-blue-500/10 p-4';
  blockDiv.dataset.blockId = blockId;
  blockDiv.dataset.blockType = type;
  
  let blockHTML = '';
  
  switch(type) {
    case 'text':
      blockHTML = `
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-dark-blue-500/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-dark-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span class="text-sm font-semibold text-dark-blue-500/70">Bloque de Texto</span>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="moveBlockUp('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover arriba">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>
            <button type="button" onclick="moveBlockDown('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover abajo">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button type="button" onclick="removeContentBlock('${blockId}')" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div id="${blockId}-editor" class="quill-editor block-content"></div>
      `;
      break;
      
    case 'two-column':
      blockHTML = `
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-18v18m0-18l10.5 0M9 22l10.5 0m0-18a2 2 0 012 2v14a2 2 0 01-2 2"/>
              </svg>
            </div>
            <span class="text-sm font-semibold text-dark-blue-500/70">Dos Columnas</span>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="moveBlockUp('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover arriba">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>
            <button type="button" onclick="moveBlockDown('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover abajo">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button type="button" onclick="removeContentBlock('${blockId}')" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="h-fit">
            <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Columna Izquierda</label>
            <div id="${blockId}-editor-left" class="quill-editor block-content-left"></div>
          </div>
          <div class="h-fit">
            <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Columna Derecha</label>
            <div id="${blockId}-editor-right" class="quill-editor block-content-right"></div>
          </div>
        </div>
      `;
      break;
      
    case 'highlight':
      blockHTML = `
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-sm font-semibold text-dark-blue-500/70">Bloque Destacado</span>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="moveBlockUp('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover arriba">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>
            <button type="button" onclick="moveBlockDown('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover abajo">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button type="button" onclick="removeContentBlock('${blockId}')" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <textarea class="block-content auto-resize w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" rows="3" placeholder="Texto destacado o nota importante...">${data.content || ''}</textarea>
      `;
      break;
      
    case 'cards':
      blockHTML = `
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z"/>
              </svg>
            </div>
            <span class="text-sm font-semibold text-dark-blue-500/70">Tarjetas (Grid 3 columnas)</span>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="moveBlockUp('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover arriba">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </button>
            <button type="button" onclick="moveBlockDown('${blockId}')" class="w-7 h-7 rounded-lg bg-dark-blue-500/5 hover:bg-dark-blue-500/10 text-dark-blue-500/60 flex items-center justify-center transition-colors" title="Mover abajo">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <button type="button" onclick="removeContentBlock('${blockId}')" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Tarjeta 1</label>
            <input type="text" class="block-card-title-1 w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 mb-2" placeholder="Título" value="${data.card1Title || ''}" />
            <textarea class="block-card-content-1 auto-resize w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" rows="3" placeholder="Contenido...">${data.card1Content || ''}</textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Tarjeta 2</label>
            <input type="text" class="block-card-title-2 w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 mb-2" placeholder="Título" value="${data.card2Title || ''}" />
            <textarea class="block-card-content-2 auto-resize w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" rows="3" placeholder="Contenido...">${data.card2Content || ''}</textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-dark-blue-500/60 mb-1.5">Tarjeta 3</label>
            <input type="text" class="block-card-title-3 w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 mb-2" placeholder="Título" value="${data.card3Title || ''}" />
            <textarea class="block-card-content-3 auto-resize w-full px-3 py-2 border border-dark-blue-500/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500" rows="3" placeholder="Contenido...">${data.card3Content || ''}</textarea>
          </div>
        </div>
      `;
      break;
  }
  
  blockDiv.innerHTML = blockHTML;
  container.appendChild(blockDiv);
  
  // Initialize Quill editors for this block
  setTimeout(() => {
    if (type === 'text') {
      const editor = new Quill(`#${blockId}-editor`, {
        theme: 'snow',
        placeholder: 'Escribe el contenido aquí...',
        modules: {
          toolbar: [
            [{ 'header': [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ]
        }
      });
      
      // Set initial content
      if (data.content) {
        editor.root.innerHTML = data.content;
      }
      
      quillEditors[blockId] = editor;
    } else if (type === 'two-column') {
      const editorLeft = new Quill(`#${blockId}-editor-left`, {
        theme: 'snow',
        placeholder: 'Contenido izquierdo...',
        modules: {
          toolbar: [
            [{ 'header': [3, false] }],
            ['bold', 'italic'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ]
        }
      });
      
      const editorRight = new Quill(`#${blockId}-editor-right`, {
        theme: 'snow',
        placeholder: 'Contenido derecho...',
        modules: {
          toolbar: [
            [{ 'header': [3, false] }],
            ['bold', 'italic'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ]
        }
      });
      
      // Set initial content
      if (data.left) {
        editorLeft.root.innerHTML = data.left;
      }
      if (data.right) {
        editorRight.root.innerHTML = data.right;
      }
      
      quillEditors[`${blockId}-left`] = editorLeft;
      quillEditors[`${blockId}-right`] = editorRight;
    }
  }, 0);
  
  updateContentBlocksJSON();
}

function removeContentBlock(blockId) {
  const block = document.querySelector(`[data-block-id="${blockId}"]`);
  if (block) {
    // Clean up Quill editors
    delete quillEditors[blockId];
    delete quillEditors[`${blockId}-left`];
    delete quillEditors[`${blockId}-right`];
    
    block.remove();
    updateContentBlocksJSON();
  }
}

function moveBlockUp(blockId) {
  const block = document.querySelector(`[data-block-id="${blockId}"]`);
  if (block && block.previousElementSibling) {
    block.parentNode.insertBefore(block, block.previousElementSibling);
    updateContentBlocksJSON();
  }
}

function moveBlockDown(blockId) {
  const block = document.querySelector(`[data-block-id="${blockId}"]`);
  if (block && block.nextElementSibling) {
    block.parentNode.insertBefore(block.nextElementSibling, block);
    updateContentBlocksJSON();
  }
}

function updateContentBlocksJSON() {
  const blocks = document.querySelectorAll('.content-block');
  const blocksData = [];
  
  blocks.forEach(block => {
    const type = block.dataset.blockType;
    const blockId = block.dataset.blockId;
    const blockData = { type };
    
    switch(type) {
      case 'text':
        // Get content from Quill editor
        const editor = quillEditors[blockId];
        blockData.content = editor ? editor.root.innerHTML : '';
        break;
      case 'two-column':
        // Get content from both Quill editors
        const editorLeft = quillEditors[`${blockId}-left`];
        const editorRight = quillEditors[`${blockId}-right`];
        blockData.left = editorLeft ? editorLeft.root.innerHTML : '';
        blockData.right = editorRight ? editorRight.root.innerHTML : '';
        break;
      case 'highlight':
        blockData.content = block.querySelector('.block-content').value;
        break;
      case 'cards':
        blockData.card1Title = block.querySelector('.block-card-title-1').value;
        blockData.card1Content = block.querySelector('.block-card-content-1').value;
        blockData.card2Title = block.querySelector('.block-card-title-2').value;
        blockData.card2Content = block.querySelector('.block-card-content-2').value;
        blockData.card3Title = block.querySelector('.block-card-title-3').value;
        blockData.card3Content = block.querySelector('.block-card-content-3').value;
        break;
    }
    
    blocksData.push(blockData);
  });
  
  document.getElementById('projectLongDescription').value = JSON.stringify(blocksData);
}

function loadContentBlocks(blocksJSON) {
  const container = document.getElementById('contentBlocksContainer');
  container.innerHTML = '';
  contentBlockCounter = 0;
  quillEditors = {}; // Clear Quill editors
  
  try {
    const blocks = typeof blocksJSON === 'string' ? JSON.parse(blocksJSON) : (blocksJSON || []);
    
    if (blocks.length > 0) {
      blocks.forEach(blockData => {
        addContentBlock(blockData.type, blockData);
      });
    }
  } catch (e) {
    console.error('Error loading content blocks:', e);
    // If it's old HTML format, convert to single text block
    if (blocksJSON && typeof blocksJSON === 'string' && blocksJSON.trim()) {
      addContentBlock('text', { content: blocksJSON });
    }
  }
}

// Add event listener to save Quill content changes
document.addEventListener('DOMContentLoaded', () => {
  // Listen for Quill text changes
  setInterval(() => {
    // Update JSON periodically to capture Quill changes
    if (document.querySelector('.content-block')) {
      updateContentBlocksJSON();
    }
  }, 1000);
});

// Add event delegation for updating JSON when content changes
document.addEventListener('input', (e) => {
  if (e.target.closest('.content-block')) {
    updateContentBlocksJSON();
  }
});

// ============================================
// AUTO-GENERATE SLUG
// ============================================

// Auto-generate slug from title
document.getElementById('projectTitle').addEventListener('input', (e) => {
  if (!document.getElementById('projectId').value) {
    const slug = e.target.value
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    document.getElementById('projectSlug').value = slug;
  }
});

document.getElementById('serviceTitle').addEventListener('input', (e) => {
  if (!document.getElementById('serviceId').value) {
    const slug = e.target.value
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    document.getElementById('serviceSlug').value = slug;
  }
});
