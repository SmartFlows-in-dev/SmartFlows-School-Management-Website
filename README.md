
# School Management System

A modern, responsive school website built with React.js featuring a comprehensive admission system with document capture functionality.

## 🚀 Features

### 🔐 Multi-User Login System
- **Student Portal** - Access academic resources and personal dashboard
- **Faculty Portal** - Manage courses, assignments, and student progress
- **Administration Portal** - School management system with enhanced security

### 📱 Responsive Design
- Fully responsive across all devices (mobile, tablet, desktop)
- Modern UI with professional color scheme
- Consistent design language throughout the application

### 🎓 Admission System
- **Multi-step admission form** with progress tracking
- **Document capture system** using device camera
- **Real-time form validation**
- **Professional application workflow**

### 📄 Document Capture Features
- **Camera Integration** - Direct camera access for document scanning
- **Multiple Document Types**:
  - Aadhar Card
  - Birth Certificate
  - Previous Marksheet
  - Transfer Certificate
  - Passport Photo
- **Image Preview & Retake** functionality
- **Required document validation**

## 🛠️ Technology Stack

- **Frontend**: React.js with JSX
- **Styling**: Pure CSS (No Tailwind)
- **Routing**: React Router DOM
- **Camera API**: MediaDevices API
- **Icons**: Emoji-based for cross-platform compatibility

## 📁 Project Structure
```
school-website/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LoginPortal.jsx
│   │   ├── StudentLogin.jsx
│   │   ├── TeacherLogin.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Admissions.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── LoginPortal.css
│   │   ├── StudentLogin.css
│   │   ├── TeacherLogin.css
│   │   ├── AdminLogin.css
│   │   └── Admissions.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to http://localhost:3000

### 📋 Available Scripts
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎯 Key Components

- **LoginPortal.jsx**  
  Main landing page with role-based access  
  Professional school branding  
  Admissions banner with call-to-action

- **StudentLogin.jsx / TeacherLogin.jsx / AdminLogin.jsx**  
  Role-specific login interfaces  
  Secure authentication forms  
  Professional design for each user type

- **Admissions.jsx**  
  Comprehensive 5-step admission form  
  Camera integration for document capture  
  Progress tracking and form validation  
  Document management system

## 📸 Camera Features
The admission system includes advanced camera functionality:

- **Auto Camera Detection** - Uses back camera on mobile devices
- **High-Resolution Capture** - Optimized for document scanning
- **Live Preview** - Real-time camera feed with capture controls
- **Image Management** - Preview, retake, and validation
- **Mobile-Optimized** - Touch-friendly camera interface

## 🎨 Design System

### Color Palette
- **Primary Blue**: #1e40af - Trust and professionalism
- **Accent Gold**: #d97706 - Excellence and prestige
- **Neutral Grays**: Clean and modern aesthetic

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive scaling** for all screen sizes

### Components
- Consistent button styles and hover effects
- Card-based layout system
- Professional form controls
- Smooth animations and transitions

## 🔒 Security Features
- **Admin Security**: Multi-factor authentication simulation
- **Form Validation**: Client-side validation for all inputs
- **Secure Routing**: Protected route structure
- **Camera Permissions**: Secure media access handling

## 📱 Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
This creates a build folder with optimized production files.

### Deployment Options
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload build files to S3 bucket
- **Traditional Web Hosting**: Upload build files to web server

## 🔮 Future Enhancements
- Backend API integration
- OCR for document information extraction
- Payment gateway integration
- Email notification system
- Student dashboard with course management
- Teacher portal with grade management
- Admin panel with analytics
- Mobile app development

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support
For support and queries:

- **Email**: support@bfacademy.edu
- **Phone**: +91 98765 43210
- **Address**: 123 Education Street, Knowledge City

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- React.js community
- Modern CSS techniques
- MediaDevices API documentation
- Educational institution design patterns

Built with ❤️ for Bright Future Academy
