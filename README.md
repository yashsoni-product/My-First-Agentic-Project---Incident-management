# Maintenance Incident Management System

A comprehensive web application for managing and tracking maintenance incidents with advanced workflow features and intelligent validation.

## 🚀 Live Demo

**[Maintenance Incident System](https://maintenance-incident-system.railway.app)** *(Deployed on Railway)*

## ✨ Key Features

- 📋 **Interactive Dashboard** - View all incidents with real-time filtering and search
- 📝 **Smart Incident Creation** - Intuitive form with auto-generated sample data  
- 🔄 **Advanced Status Management** - Workflow-based status tracking with confirmations
- 💬 **AI-Powered Rejection Chat** - Intelligent validation system for incident rejections
- 📱 **Mobile-First Design** - Optimized responsive interface for all devices
- 🌙 **Dark/Light Theme** - Toggle between themes for user preference
- 🔍 **Advanced Filtering** - Filter by status, location, priority, and date ranges
- 📊 **Real-Time Analytics** - Live statistics and progress tracking

## 🏆 Hackathon Solution

**Built for AFG's maintenance incident management challenge:**
- ✅ Eliminates fragmented documentation across email, forms, and phone calls
- ✅ Provides real-time visibility into incident status and pending approvals  
- ✅ Accelerates cycle times from incident to HQ review to approval
- ✅ Enables transparent cost tracking and reimbursement processes
- ✅ Identifies patterns, trends, and recurrent issues through analytics

---

## Core Features

### 1. **Upload Interface**
Service centre staff submit incident documentation:
- Upload incident reports (PDF, Word, images)
- Attach photos of equipment/damage
- Scanned parts images or supporting documents
- Link to incident details (service centre location, date, initial cost estimate)

### 2. **Incident Tracker**
Real-time view of all incidents and their status:
- List of incidents with current status (submitted → reviewed → approved → closed)
- Visibility into which stage each incident is in
- Track submission and approval dates
- Status history for each incident

### 3. **Reviewer Interface**
HQ team reviews and takes action:
- See pending incidents waiting for review
- View all uploaded documents and photos
- Add comments and findings
- Change status (approved/rejected/needs more info)
- Assign corrective actions
- Attach follow-up documents or inspection reports

### 4. **Dashboard**
High-level overview and analytics:
- Count of incidents by status (submitted, reviewed, approved, closed)
- Incidents grouped by service centre location
- Breakdown by cost bracket (minor, medium, major)
- Drill down into individual incidents for details
- Quick access to recent or high-cost incidents

### 5. **Search & Filter**
Find incidents quickly:
- Filter by date range (incident date or submission date)
- Filter by service centre location
- Filter by incident status
- Filter by cost bracket
- Search by incident ID or reference number

---

## Feature Ideas (Build One or More - Your Choice!)

**A) Upload Interface + Tracker** (Easiest - ~2 hrs)
- Form for service centre staff to submit incident details and upload documents
- Table showing all incidents with their current status
- Full end-to-end flow from submission to visibility

**B) Reviewer Interface** (Medium - ~2 hrs)
- Table of pending incidents awaiting HQ review
- View uploaded documents and photos
- Status change, comments, and corrective action assignment
- Focus on the review workflow

**C) Dashboard + Filters** (Quickest - ~1.5 hrs)
- Pre-loaded incidents with visualization of status distribution
- Filters by date, location, status, cost
- Basic analytics and drill-down capability

*Feeling ambitious? Combine multiple features! Or add your own twist like cost tracking, automated notifications, or incident pattern analysis.*

---

## Build It Your Way

Use whatever tech stack makes sense - vanilla HTML/CSS/JS, React, Vue, Svelte, a backend framework, Python, Node.js, whatever!

**Core requirements:**
- ✅ Data persists (localStorage, database, file storage, or backend API)
- ✅ Light/dark mode toggle
- ✅ Responsive design (works on mobile & desktop)
- ✅ Sample data pre-loaded (incidents from different service centres, various statuses)

---

## Recommendations for Implementation

### Data Structure (Think About, Don't Bind To)

Here's how you might think about organizing the data:

**Incident:**
- ID, service centre location, date, status (submitted/reviewed/approved/closed)
- Initial cost estimate, approved cost
- Submission date, review date, approval date

**Document:**
- ID, incident ID, document type (report, photo, scan, etc.)
- File name, upload date, uploaded by

**Review:**
- ID, incident ID, reviewer name, review date
- Status change (what changed), comments, corrective actions assigned
- Follow-up documents attached

**Service Centre:**
- ID, name, location, contact info

### Getting Started

1. **Plan the UI first** - Sketch or wireframe your chosen feature
2. **Think about your data flow** - How will service staff submit? How will HQ review and track?
3. **Start simple** - Get the basic CRUD operations working first (Create, Read, Update, Delete)
4. **Add polish** - Once core functionality works, style it and make it responsive
5. **Test the flow** - Make sure a service centre can submit and HQ can review (end-to-end)

### Pro Tips

- **Don't overthink it** - For a 2-hour hack, get something working first, then improve
- **Mock data is your friend** - Pre-load incidents from different service centres with various statuses to test faster
- **Photos matter** - If building the upload interface, make sure photos display correctly
- **Focus on UX** - A simple, clear interface beats fancy features you didn't finish
- **Validate early** - Check that data is saved and persists before moving on
- **Light/dark mode** - Even if you don't build the full feature, plan how you'll implement it

---

