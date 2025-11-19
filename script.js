// Application State
class IncidentManager {
    constructor() {
        this.incidents = [];
        this.currentTab = 'tracker';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            location: '',
            status: '',
            priority: '',
            dateFrom: '',
            dateTo: '',
            search: ''
        };
        this.reviewFilter = 'all';
        this.pendingStatusChange = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.initEventListeners();
        this.initTheme();
        
        // Only generate sample data if we don't have any incidents
        if (this.incidents.length === 0) {
            this.generateSampleData();
        }
        
        console.log(`Total incidents loaded: ${this.incidents.length}`);
        console.log('Current tab:', this.currentTab);
        console.log('Available containers:', {
            tracker: !!document.getElementById('incidents-container'),
            submitted: !!document.getElementById('submitted-incidents'),
            reviewed: !!document.getElementById('reviewed-incidents'),
            approved: !!document.getElementById('approved-incidents')
        });
        this.renderIncidentCards(this.currentTab);
    }

    // Show incident form (placeholder for now)
    showIncidentForm() {
        this.showNotification('Incident form will open here', 'info');
        // TODO: Implement incident form modal
    }

    // Force regenerate sample data (for debugging)
    regenerateData() {
        localStorage.removeItem('afgIncidents');
        this.generateSampleData();
        this.renderIncidentCards(this.currentTab);
        this.showNotification('Sample data regenerated!', 'success');
    }

    // Generate 100 sample incidents
    generateSampleData() {
        // Clear existing data to ensure fresh generation
        this.incidents = [];
        
        const locations = ['Sydney CBD', 'Melbourne Central', 'Brisbane North', 'Perth South', 'Adelaide East'];
        const equipmentTypes = ['HVAC System', 'Elevator', 'Security System', 'Plumbing', 'Electrical', 'Fire Safety'];
        const priorities = ['Low', 'Medium', 'High', 'Critical'];
        const statuses = ['submitted', 'reviewed', 'approved', 'closed', 'rejected'];
        const reporters = ['John Smith', 'Sarah Wilson', 'Mike Johnson', 'Emma Davis', 'Alex Brown', 'Lisa Chen', 'David Miller', 'Rachel Green'];
        
        const descriptions = [
            'HVAC system not maintaining temperature in server room',
            'Elevator making unusual noises and jerky movements',
            'Security cameras in parking garage offline',
            'Water leak detected in basement storage area',
            'Electrical outlet sparking in office area',
            'Fire alarm system false triggering',
            'Air conditioning unit leaking water',
            'Elevator stuck between floors 3 and 4',
            'Access control system not reading key cards',
            'Burst pipe in mechanical room',
            'Faulty lighting in stairwell',
            'Smoke detector battery replacement needed',
            'Heating system not working in conference room',
            'Elevator emergency phone not functioning',
            'CCTV system hard drive failure',
            'Blocked drain causing flooding',
            'Circuit breaker keeps tripping',
            'Fire extinguisher needs inspection',
            'Ventilation fan making loud noise',
            'Door lock mechanism jammed'
        ];

        for (let i = 1; i <= 100; i++) {
            const incidentDate = new Date();
            incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 90));
            
            const submissionDate = new Date(incidentDate);
            submissionDate.setHours(submissionDate.getHours() + Math.floor(Math.random() * 24));
            
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            let reviewDate = null;
            let approvalDate = null;
            
            if (['reviewed', 'approved', 'closed', 'rejected'].includes(status)) {
                reviewDate = new Date(submissionDate);
                reviewDate.setDate(reviewDate.getDate() + Math.floor(Math.random() * 5) + 1);
            }
            
            if (['approved', 'closed'].includes(status)) {
                approvalDate = new Date(reviewDate);
                approvalDate.setDate(approvalDate.getDate() + Math.floor(Math.random() * 3) + 1);
            }

            const incident = {
                id: `INC-${String(i).padStart(4, '0')}`,
                serviceLocation: locations[Math.floor(Math.random() * locations.length)],
                incidentDate: incidentDate.toISOString().split('T')[0],
                equipmentType: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                estimatedCost: Math.floor(Math.random() * 15000) + 500,
                reportedBy: reporters[Math.floor(Math.random() * reporters.length)],
                status: status,
                submissionDate: submissionDate.toISOString(),
                reviewDate: reviewDate ? reviewDate.toISOString() : null,
                approvalDate: approvalDate ? approvalDate.toISOString() : null,
                documents: [],
                comments: status !== 'submitted' ? [`Initial review completed on ${reviewDate ? reviewDate.toLocaleDateString() : 'N/A'}`] : [],
                reviewer: status !== 'submitted' ? 'HQ Review Team' : null
            };

            this.incidents.push(incident);
        }
        
        console.log(`Generated ${this.incidents.length} sample incidents`);
        this.saveData();
    }

    // Event Listeners
    initEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form submission (only if form exists)
        const incidentForm = document.getElementById('incident-form');
        if (incidentForm) {
            incidentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitIncident();
            });
        }

        // Search and filters
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.renderIncidentCards(this.currentTab);
        });

        document.getElementById('location-filter').addEventListener('change', (e) => {
            this.filters.location = e.target.value;
            this.renderIncidentCards(this.currentTab);
        });

        // Status filter (only if it exists - removed in mobile design)
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.renderIncidentCards(this.currentTab);
            });
        }

        document.getElementById('date-from').addEventListener('change', (e) => {
            this.filters.dateFrom = e.target.value;
            this.renderIncidentCards(this.currentTab);
        });

        document.getElementById('date-to').addEventListener('change', (e) => {
            this.filters.dateTo = e.target.value;
            this.renderIncidentCards(this.currentTab);
        });

        // Pagination (only if pagination exists)
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        if (prevPage && nextPage) {
            prevPage.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderIncidentTable();
                }
            });

            nextPage.addEventListener('click', () => {
                const totalPages = Math.ceil(this.getFilteredIncidents().length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderIncidentTable();
                }
            });
        }

        // Filter toggle
        document.getElementById('filter-toggle').addEventListener('click', () => {
            const filterPanel = document.getElementById('filter-panel');
            filterPanel.classList.toggle('active');
        });

        // Priority filter
        document.getElementById('priority-filter').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.renderIncidentCards(this.currentTab);
        });

        // FAB click
        document.getElementById('add-incident-fab').addEventListener('click', () => {
            this.showIncidentForm();
        });

        // Regenerate data button
        document.getElementById('regenerate-data').addEventListener('click', () => {
            this.regenerateData();
        });

        // Modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Confirmation modal close
        document.querySelectorAll('.confirmation-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeConfirmationModal();
            });
        });

        // Confirm status change
        document.getElementById('confirm-status-change').addEventListener('click', () => {
            this.executeStatusChange();
        });

        // Chat modal event listeners
        document.getElementById('chat-send').addEventListener('click', () => {
            const input = document.getElementById('chat-input');
            if (input.value.trim() && this.chatState) {
                this.processAnswer(input.value.trim());
            }
        });

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const input = document.getElementById('chat-input');
                if (input.value.trim() && this.chatState) {
                    this.processAnswer(input.value.trim());
                }
            }
        });

        document.getElementById('chat-cancel').addEventListener('click', () => {
            this.closeChatModal();
        });

        document.getElementById('chat-complete').addEventListener('click', () => {
            this.completeChatProcess();
        });

        // Close chat modal when clicking outside
        document.getElementById('rejection-chat-modal').addEventListener('click', (e) => {
            if (e.target.id === 'rejection-chat-modal') {
                this.closeChatModal();
            }
        });

        // File upload (only if elements exist)
        const fileUpload = document.getElementById('document-upload');
        const uploadArea = document.getElementById('file-upload-area');
        
        if (fileUpload && uploadArea) {
            uploadArea.addEventListener('click', () => fileUpload.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = 'var(--border-color)';
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--border-color)';
                this.handleFileUpload(e.dataTransfer.files);
            });
            
            fileUpload.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Tab Management
    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.renderIncidentCards(tabName);
    }

    // Incident Management
    submitIncident() {
        const formData = new FormData(document.getElementById('incident-form'));
        const incident = {
            id: `INC-${String(this.incidents.length + 1).padStart(4, '0')}`,
            serviceLocation: document.getElementById('service-centre').value,
            incidentDate: document.getElementById('incident-date').value,
            equipmentType: document.getElementById('equipment-type').value,
            priority: document.getElementById('priority').value,
            description: document.getElementById('description').value,
            estimatedCost: parseFloat(document.getElementById('estimated-cost').value) || 0,
            reportedBy: document.getElementById('reported-by').value,
            status: 'submitted',
            submissionDate: new Date().toISOString(),
            reviewDate: null,
            approvalDate: null,
            documents: [],
            comments: [],
            reviewer: null
        };

        this.incidents.unshift(incident);
        this.saveData();
        
        // Reset form and show success message
        document.getElementById('incident-form').reset();
        document.getElementById('uploaded-files').innerHTML = '';
        
        this.showNotification('Incident submitted successfully!', 'success');
        this.renderIncidentCards(this.currentTab);
    }

    // File Upload
    handleFileUpload(files) {
        const uploadedFilesDiv = document.getElementById('uploaded-files');
        
        Array.from(files).forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'uploaded-file';
            fileDiv.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <button type="button" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            uploadedFilesDiv.appendChild(fileDiv);
        });
    }

    // Dashboard
    updateDashboard() {
        const filteredIncidents = this.getFilteredIncidents();
        const stats = this.calculateStats(filteredIncidents);
        
        document.getElementById('submitted-count').textContent = stats.submitted;
        document.getElementById('reviewed-count').textContent = stats.reviewed;
        document.getElementById('approved-count').textContent = stats.approved;
        document.getElementById('closed-count').textContent = stats.closed;
        
        this.renderRecentIncidents(filteredIncidents);
    }

    calculateStats(incidents) {
        return {
            submitted: incidents.filter(i => i.status === 'submitted').length,
            reviewed: incidents.filter(i => i.status === 'reviewed').length,
            approved: incidents.filter(i => i.status === 'approved').length,
            closed: incidents.filter(i => i.status === 'closed').length
        };
    }

    renderRecentIncidents(incidents) {
        const highPriorityIncidents = incidents
            .filter(i => ['High', 'Critical'].includes(i.priority))
            .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
            .slice(0, 5);

        const container = document.getElementById('recent-incidents-list');
        container.innerHTML = highPriorityIncidents.map(incident => `
            <div class="incident-card" onclick="incidentManager.showIncidentDetails('${incident.id}')">
                <div class="incident-header">
                    <h4>${incident.id}</h4>
                    <span class="priority-badge ${incident.priority.toLowerCase()}">${incident.priority}</span>
                </div>
                <p class="incident-description">${incident.description}</p>
                <div class="incident-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${incident.serviceLocation}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(incident.incidentDate).toLocaleDateString()}</span>
                    <span><i class="fas fa-dollar-sign"></i> $${incident.estimatedCost.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    }

    // Render Incident Cards
    renderIncidentCards(tabName = 'tracker') {
        let incidents = this.getFilteredIncidents();
        
        // Filter by tab
        if (tabName === 'submitted') {
            incidents = incidents.filter(i => i.status === 'submitted');
        } else if (tabName === 'reviewed') {
            incidents = incidents.filter(i => i.status === 'reviewed');
        } else if (tabName === 'approved') {
            incidents = incidents.filter(i => i.status === 'approved');
        }

        // Sort by date (newest first)
        incidents.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));

        const containerId = tabName === 'tracker' ? 'incidents-container' : `${tabName}-incidents`;
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Container not found: ${containerId}`);
            return;
        }
        
        console.log(`Rendering ${incidents.length} incidents in container: ${containerId}`);

        container.innerHTML = incidents.map(incident => {
            const timeAgo = this.getTimeAgo(new Date(incident.submissionDate));
            const assignee = incident.reportedBy || 'Unassigned';
            const actionButtons = this.getStatusActionButtons(incident);
            
            return `
                <div class="incident-card ${incident.status}">
                    <div onclick="incidentManager.showIncidentDetails('${incident.id}')">
                        <div class="incident-header">
                            <h3 class="incident-id">${incident.id}</h3>
                            <span class="status-badge ${incident.status}">${incident.status}</span>
                        </div>
                        <p class="incident-description">${incident.description}</p>
                        <div class="incident-meta">
                            <span class="incident-assignee">Assigned to: ${assignee}</span>
                            <span class="incident-time">${timeAgo}</span>
                        </div>
                    </div>
                    ${actionButtons}
                </div>
            `;
        }).join('');

        // Show empty state if no incidents
        if (incidents.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No incidents found</h3>
                    <p>No incidents match your current filters.</p>
                </div>
            `;
        }
    }

    // Helper method to get time ago
    getTimeAgo(date) {
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays}d ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours}h ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes}m ago`;
        } else {
            return 'Just now';
        }
    }

    // Get appropriate action buttons based on incident status
    getStatusActionButtons(incident) {
        const buttons = [];
        
        switch (incident.status) {
            case 'submitted':
                buttons.push({
                    action: 'reviewed',
                    label: 'Mark Reviewed',
                    icon: 'fas fa-eye',
                    class: 'review'
                });
                break;
                
            case 'reviewed':
                buttons.push({
                    action: 'approved',
                    label: 'Approve',
                    icon: 'fas fa-check',
                    class: 'approve'
                });
                buttons.push({
                    action: 'rejected',
                    label: 'Reject',
                    icon: 'fas fa-times',
                    class: 'reject'
                });
                break;
                
            case 'approved':
                buttons.push({
                    action: 'closed',
                    label: 'Close',
                    icon: 'fas fa-lock',
                    class: 'close'
                });
                break;
                
            case 'closed':
            case 'rejected':
                // No actions available for closed/rejected incidents
                return '';
        }
        
        if (buttons.length === 0) return '';
        
        const buttonHTML = buttons.map(btn => `
            <button class="card-action-btn ${btn.class}" 
                    onclick="event.stopPropagation(); incidentManager.confirmStatusChange('${incident.id}', '${btn.action}')">
                <i class="${btn.icon}"></i>
                ${btn.label}
            </button>
        `).join('');
        
        return `<div class="card-actions">${buttonHTML}</div>`;
    }

    // Review Queue
    renderReviewQueue() {
        let incidents = [...this.incidents];
        
        if (this.reviewFilter === 'pending') {
            incidents = incidents.filter(i => ['submitted', 'reviewed'].includes(i.status));
        } else if (this.reviewFilter === 'high-cost') {
            incidents = incidents.filter(i => i.estimatedCost > 5000);
        }

        incidents.sort((a, b) => {
            if (a.priority === 'Critical' && b.priority !== 'Critical') return -1;
            if (b.priority === 'Critical' && a.priority !== 'Critical') return 1;
            if (a.priority === 'High' && !['Critical', 'High'].includes(b.priority)) return -1;
            if (b.priority === 'High' && !['Critical', 'High'].includes(a.priority)) return 1;
            return new Date(b.submissionDate) - new Date(a.submissionDate);
        });

        const container = document.getElementById('review-list');
        container.innerHTML = incidents.map(incident => `
            <div class="review-card">
                <div class="review-card-header">
                    <div>
                        <div class="review-card-title">${incident.id} - ${incident.description}</div>
                        <div class="review-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${incident.serviceLocation}</span>
                            <span><i class="fas fa-calendar"></i> ${new Date(incident.incidentDate).toLocaleDateString()}</span>
                            <span><i class="fas fa-user"></i> ${incident.reportedBy}</span>
                            <span><i class="fas fa-dollar-sign"></i> $${incident.estimatedCost.toLocaleString()}</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                        <span class="priority-badge ${incident.priority.toLowerCase()}">${incident.priority}</span>
                        <span class="status-badge ${incident.status}">${incident.status}</span>
                    </div>
                </div>
                <div class="review-card-actions">
                    <button class="btn btn-sm btn-outline" onclick="incidentManager.showIncidentDetails('${incident.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${incident.status === 'submitted' ? `
                        <button class="btn btn-sm btn-outline" onclick="incidentManager.updateIncidentStatus('${incident.id}', 'reviewed')">
                            <i class="fas fa-eye"></i> Mark Reviewed
                        </button>
                    ` : ''}
                    ${incident.status === 'reviewed' ? `
                        <button class="btn btn-sm btn-primary" onclick="incidentManager.updateIncidentStatus('${incident.id}', 'approved')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="incidentManager.updateIncidentStatus('${incident.id}', 'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Filtering
    getFilteredIncidents() {
        return this.incidents.filter(incident => {
            const matchesLocation = !this.filters.location || incident.serviceLocation === this.filters.location;
            const matchesStatus = !this.filters.status || incident.status === this.filters.status;
            const matchesPriority = !this.filters.priority || incident.priority === this.filters.priority;
            const matchesSearch = !this.filters.search || 
                incident.id.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                incident.description.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                incident.serviceLocation.toLowerCase().includes(this.filters.search.toLowerCase());
            
            let matchesDateRange = true;
            if (this.filters.dateFrom) {
                matchesDateRange = matchesDateRange && incident.incidentDate >= this.filters.dateFrom;
            }
            if (this.filters.dateTo) {
                matchesDateRange = matchesDateRange && incident.incidentDate <= this.filters.dateTo;
            }

            return matchesLocation && matchesStatus && matchesPriority && matchesSearch && matchesDateRange;
        });
    }

    // Modal Management
    showIncidentDetails(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        const modal = document.getElementById('incident-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = `Incident ${incident.id}`;
        modalBody.innerHTML = `
            <div class="incident-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Status:</strong>
                        <span class="status-badge ${incident.status}">${incident.status}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Priority:</strong>
                        <span class="priority-badge ${incident.priority.toLowerCase()}">${incident.priority}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Service Location:</strong>
                        <span>${incident.serviceLocation}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Equipment Type:</strong>
                        <span>${incident.equipmentType}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Incident Date:</strong>
                        <span>${new Date(incident.incidentDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Reported By:</strong>
                        <span>${incident.reportedBy}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Estimated Cost:</strong>
                        <span>$${incident.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Submission Date:</strong>
                        <span>${new Date(incident.submissionDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="detail-description">
                    <strong>Description:</strong>
                    <p>${incident.description}</p>
                </div>
                ${incident.comments.length > 0 ? `
                    <div class="detail-comments">
                        <strong>Comments:</strong>
                        <ul>
                            ${incident.comments.map(comment => `<li>${comment}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('incident-modal').classList.remove('active');
    }

    // Show confirmation dialog for status change
    confirmStatusChange(incidentId, newStatus) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        // If status is being changed to "rejected", trigger chat validation
        if (newStatus === 'rejected') {
            this.startRejectionChat(incidentId);
            return;
        }

        // Store the pending change
        this.pendingStatusChange = { incidentId, newStatus };

        // Update confirmation modal content
        const modal = document.getElementById('confirmation-modal');
        const titleEl = document.getElementById('confirmation-title');
        const messageEl = document.getElementById('confirmation-message');
        const currentStatusEl = document.getElementById('current-status-badge');
        const newStatusEl = document.getElementById('new-status-badge');

        titleEl.textContent = `Confirm Status Change - ${incident.id}`;
        messageEl.textContent = `Are you sure you want to change the status of incident ${incident.id}?`;
        
        // Update status badges
        currentStatusEl.textContent = incident.status;
        currentStatusEl.className = `status-badge ${incident.status}`;
        newStatusEl.textContent = newStatus;
        newStatusEl.className = `status-badge ${newStatus}`;

        // Show the modal
        modal.classList.add('active');
    }

    // Execute the confirmed status change
    executeStatusChange() {
        if (!this.pendingStatusChange) return;

        const { incidentId, newStatus } = this.pendingStatusChange;
        this.updateIncidentStatus(incidentId, newStatus);
        
        // Clear pending change and close modal
        this.pendingStatusChange = null;
        this.closeConfirmationModal();
    }

    // Close confirmation modal
    closeConfirmationModal() {
        document.getElementById('confirmation-modal').classList.remove('active');
        this.pendingStatusChange = null;
    }

    // Start rejection chat validation
    startRejectionChat(incidentId) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        // Initialize chat state
        this.chatState = {
            incidentId,
            currentQuestion: 0,
            answers: [],
            isComplete: false
        };

        // Define validation questions
        this.chatQuestions = [
            {
                question: "What is the primary reason for rejecting this incident report?",
                key: "reason"
            },
            {
                question: "Have you identified any safety concerns that prevent approval?",
                key: "safety"
            },
            {
                question: "Are there specific procedural violations or missing information that need to be addressed?",
                key: "procedural"
            }
        ];

        // Show chat modal and start conversation
        this.showChatModal();
        this.sendBotMessage("Hello! I need to validate your rejection of incident " + incident.id + ". Please answer a few questions to proceed.");
        
        // Start with first question after a brief delay
        setTimeout(() => {
            this.askNextQuestion();
        }, 1000);
    }

    // Show chat modal
    showChatModal() {
        const modal = document.getElementById('rejection-chat-modal');
        const messagesContainer = document.getElementById('chat-messages');
        const inputContainer = document.getElementById('chat-input-container');
        const resultContainer = document.getElementById('chat-result');
        const completeBtn = document.getElementById('chat-complete');

        // Reset modal state
        messagesContainer.innerHTML = '';
        inputContainer.style.display = 'flex';
        resultContainer.style.display = 'none';
        completeBtn.style.display = 'none';

        // Enable input
        document.getElementById('chat-input').disabled = false;
        document.getElementById('chat-send').disabled = false;

        modal.classList.add('active');
    }

    // Send bot message
    sendBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message bot';
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">${message}</div>
        `;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send user message
    sendUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message user';
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">${message}</div>
        `;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingEl = document.createElement('div');
        typingEl.className = 'chat-message bot';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Remove typing indicator
    removeTypingIndicator() {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    // Ask next question
    askNextQuestion() {
        if (this.chatState.currentQuestion >= this.chatQuestions.length) {
            this.evaluateRejectionReasons();
            return;
        }

        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            const question = this.chatQuestions[this.chatState.currentQuestion];
            this.sendBotMessage(question.question);
            
            // Enable input for answer
            const input = document.getElementById('chat-input');
            const sendBtn = document.getElementById('chat-send');
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }, 1500);
    }

    // Process user answer
    processAnswer(answer) {
        if (!answer.trim()) return;

        const currentQuestion = this.chatQuestions[this.chatState.currentQuestion];
        
        // Store the answer
        this.chatState.answers.push({
            question: currentQuestion.question,
            answer: answer.trim(),
            key: currentQuestion.key
        });

        // Send user message
        this.sendUserMessage(answer);

        // Disable input
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        input.disabled = true;
        sendBtn.disabled = true;
        input.value = '';

        // Move to next question
        this.chatState.currentQuestion++;
        
        setTimeout(() => {
            this.askNextQuestion();
        }, 800);
    }

    // Evaluate rejection reasons
    evaluateRejectionReasons() {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            
            const answers = this.chatState.answers;
            const evaluation = this.validateRejectionReasons(answers);
            
            // Hide input container
            document.getElementById('chat-input-container').style.display = 'none';
            
            // Show result
            const resultContainer = document.getElementById('chat-result');
            const resultIcon = resultContainer.querySelector('.result-icon i');
            const resultTitle = document.getElementById('result-title');
            const resultMessage = document.getElementById('result-message');
            const completeBtn = document.getElementById('chat-complete');
            
            if (evaluation.isValid) {
                resultIcon.className = 'fas fa-check-circle';
                resultTitle.textContent = 'Rejection Approved';
                resultMessage.textContent = evaluation.message;
                completeBtn.style.display = 'inline-block';
                completeBtn.textContent = 'Complete Rejection';
                
                this.sendBotMessage("Thank you for providing detailed reasons. Your rejection has been validated and will be processed.");
            } else {
                resultIcon.className = 'fas fa-exclamation-triangle';
                resultTitle.textContent = 'Supervisor Required';
                resultMessage.textContent = evaluation.message;
                completeBtn.style.display = 'inline-block';
                completeBtn.textContent = 'Contact Supervisor';
                
                this.sendBotMessage("Based on your responses, this rejection requires supervisor approval. Please contact your supervisor before proceeding.");
            }
            
            resultContainer.style.display = 'block';
            this.chatState.evaluation = evaluation;
        }, 2000);
    }

    // Validate rejection reasons using simple logic
    validateRejectionReasons(answers) {
        const reasonAnswer = answers.find(a => a.key === 'reason')?.answer.toLowerCase() || '';
        const safetyAnswer = answers.find(a => a.key === 'safety')?.answer.toLowerCase() || '';
        const proceduralAnswer = answers.find(a => a.key === 'procedural')?.answer.toLowerCase() || '';

        // Check for substantial answers (more than just yes/no)
        const hasSubstantialReason = reasonAnswer.length > 10;
        const hasSafetyJustification = safetyAnswer.includes('yes') || safetyAnswer.includes('concern') || safetyAnswer.includes('risk') || safetyAnswer.length > 15;
        const hasProceduralJustification = proceduralAnswer.includes('yes') || proceduralAnswer.includes('missing') || proceduralAnswer.includes('violation') || proceduralAnswer.length > 15;

        // Simple validation logic
        const validationScore = [hasSubstantialReason, hasSafetyJustification, hasProceduralJustification].filter(Boolean).length;

        if (validationScore >= 2) {
            return {
                isValid: true,
                message: 'Your rejection reasons are comprehensive and justify the status change. The incident will be marked as rejected.',
                score: validationScore
            };
        } else {
            return {
                isValid: false,
                message: 'The rejection reasons provided are insufficient or unclear. Please contact your supervisor for guidance before rejecting this incident.',
                score: validationScore
            };
        }
    }

    // Complete chat process
    completeChatProcess() {
        if (!this.chatState.evaluation) return;

        const { incidentId } = this.chatState;
        
        if (this.chatState.evaluation.isValid) {
            // Approve the rejection
            this.updateIncidentStatus(incidentId, 'rejected');
            this.closeChatModal();
            
            // Show success message
            this.showNotification('Incident rejected successfully', 'success');
        } else {
            // Don't change status, just close modal
            this.closeChatModal();
            
            // Show supervisor contact message
            this.showNotification('Please contact your supervisor before rejecting this incident', 'warning');
        }
    }

    // Close chat modal
    closeChatModal() {
        document.getElementById('rejection-chat-modal').classList.remove('active');
        this.chatState = null;
    }

    // Show notification (simple implementation)
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#34C759' : type === 'warning' ? '#f59e0b' : '#007AFF'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Status Updates
    updateIncidentStatus(incidentId, newStatus) {
        const incident = this.incidents.find(i => i.id === incidentId);
        if (!incident) return;

        const oldStatus = incident.status;
        incident.status = newStatus;
        
        if (newStatus === 'reviewed' && !incident.reviewDate) {
            incident.reviewDate = new Date().toISOString();
            incident.reviewer = 'HQ Review Team';
            incident.comments.push(`Status updated to reviewed on ${new Date().toLocaleDateString()}`);
        } else if (['approved', 'rejected'].includes(newStatus) && !incident.approvalDate) {
            incident.approvalDate = new Date().toISOString();
            incident.comments.push(`Status updated to ${newStatus} on ${new Date().toLocaleDateString()}`);
        } else if (newStatus === 'closed') {
            incident.comments.push(`Incident closed on ${new Date().toLocaleDateString()}`);
        }

        this.saveData();
        this.renderIncidentCards(this.currentTab);
        
        this.showNotification(`Incident ${incidentId} status changed from ${oldStatus} to ${newStatus}`, 'success');
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Data Persistence
    saveData() {
        localStorage.setItem('afgIncidents', JSON.stringify(this.incidents));
    }

    loadData() {
        const saved = localStorage.getItem('afgIncidents');
        if (saved) {
            this.incidents = JSON.parse(saved);
        }
    }
}

// Initialize the application
let incidentManager;

document.addEventListener('DOMContentLoaded', () => {
    incidentManager = new IncidentManager();
});

// Additional CSS for notifications
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 1001;
    min-width: 300px;
    animation: slideIn 0.3s ease-out;
}

.notification-success {
    border-left: 4px solid var(--success-color);
}

.notification-error {
    border-left: 4px solid var(--danger-color);
}

.notification-info {
    border-left: 4px solid var(--info-color);
}

.notification button {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    margin-left: auto;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.incident-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: var(--transition);
}

.incident-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.incident-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.incident-description {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.incident-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-muted);
}

.incident-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-description,
.detail-comments {
    margin-bottom: 1rem;
}

.detail-comments ul {
    margin-top: 0.5rem;
    padding-left: 1.5rem;
}

.uploaded-file {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
}

.uploaded-file button {
    background: none;
    border: none;
    color: var(--danger-color);
    cursor: pointer;
    margin-left: auto;
}
`;

// Add the notification styles to the head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);