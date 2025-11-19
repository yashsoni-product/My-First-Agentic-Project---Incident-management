# 🔧 Smart Maintenance Incident Management System

A comprehensive web-based maintenance incident reporting and review system with intelligent chat-based rejection validation.

## 🌟 Features

### ✨ **Core Functionality**
- **Real-time Incident Dashboard** - Mobile-first responsive design
- **Smart Status Management** - Streamlined workflow controls
- **Advanced Filtering & Search** - Location, priority, date, and status filters
- **Document Management** - File upload and attachment handling

### 🤖 **AI-Powered Validation**
- **Chat-Based Rejection Workflow** - Interactive validation for incident rejections
- **3-Question Validation System** - Ensures comprehensive reasoning
- **Automatic Decision Making** - Approves or requires supervisor intervention
- **Smart Response Analysis** - Natural language processing for answer evaluation

### 📱 **User Experience**
- **Mobile-First Design** - Optimized for all screen sizes
- **Dark/Light Theme** - User preference support
- **Real-time Notifications** - Status updates and feedback
- **Intuitive Navigation** - Tab-based interface with smooth transitions

## 🚀 Live Demo

**[View Live Application →](https://your-app-name.railway.app)**

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Python Flask
- **Storage:** LocalStorage (client-side persistence)
- **Deployment:** Railway Platform
- **Design:** Mobile-first responsive design

## 📋 System Workflow

### Standard Process
1. **Report Creation** - Users submit incident reports with details
2. **Dashboard Review** - Incidents appear in categorized dashboard
3. **Status Management** - Quick status updates with confirmation
4. **Document Handling** - Attachment support for evidence

### Rejection Validation Process
1. **Rejection Trigger** - User attempts to reject an incident
2. **Chat Interface** - AI assistant opens validation chat
3. **Question Series** - Three targeted questions about rejection reasons:
   - Primary reason for rejection
   - Safety concerns identification
   - Procedural violations or missing information
4. **Response Analysis** - System evaluates answer quality and comprehensiveness
5. **Decision Making**:
   - ✅ **Comprehensive answers** → Rejection approved
   - ⚠️ **Insufficient reasoning** → Supervisor contact required

## 🏗️ Installation & Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/maintenance-incident-management.git
cd maintenance-incident-management

# Install dependencies
pip install -r requirements.txt

# Run the application
python server.py
```

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

## 📊 Sample Data

The system includes 100 pre-generated sample incidents with:
- Diverse equipment types and locations
- Varied priority levels and statuses
- Realistic timestamps and descriptions
- Multiple assignee and reporter combinations

## 🎯 Key Benefits

- **Quality Control** - Ensures rejection decisions are well-reasoned
- **Supervisor Efficiency** - Reduces unnecessary escalations
- **Documentation** - Maintains detailed reasoning for all decisions
- **User Training** - Guides users toward better decision-making
- **Audit Trail** - Complete history of all status changes

## 🔒 Security Features

- Input validation and sanitization
- XSS protection
- CSRF protection ready
- Secure file upload handling

## 📱 Mobile Optimization

- Touch-friendly interface
- Optimized tap targets
- Swipe gestures support
- Responsive card layouts
- Mobile keyboard optimization

## 🎨 Design Philosophy

- **Minimalist Interface** - Clean, distraction-free design
- **Apple Design Language** - iOS-inspired aesthetics
- **Accessibility First** - WCAG compliant design
- **Performance Focused** - Optimized loading and interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙋‍♂️ Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for better maintenance management workflows**