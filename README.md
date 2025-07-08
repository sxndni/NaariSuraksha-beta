# 🛡️ NaariSuraksha - Women Safety App

[![Beta Release](https://img.shields.io/badge/Status-Beta-orange.svg)](https://naarisuraksha-beta.vercel.app/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://naarisuraksha-beta.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)

> **Beta Release of Project Udaan** 🚀  
> Empowering women with smart safety tools, emergency assistance, and community support.

## 🌟 Live Demo

**[Try NaariSuraksha Beta →](https://naarisuraksha-beta.vercel.app/)**

## 📱 Features

### 🚨 Emergency SOS
- **One-tap emergency alerts** with 5-second countdown
- **Automatic location sharing** with emergency contacts
- **Quick dial** to police, women's helpline, and medical services
- **Pre-written emergency messages** for instant sharing

### 🗺️ Interactive Safety Map
- **Real-time location tracking** with high accuracy
- **Nearby emergency services** (police stations, hospitals, fire stations)
- **Satellite and street view** toggle
- **One-click directions** and contact information
- **Live emergency service data** from OpenStreetMap

### 🤖 AI Safety Assistant
- **24/7 AI chatbot** trained on safety best practices
- **Contextual safety advice** for various situations
- **Emergency guidance** and support
- **Quick reply suggestions** for common safety concerns

### 📞 Emergency Contacts Management
- **Categorized contacts** (family, friends, police, medical)
- **Quick call functionality** with one-tap dialing
- **Contact organization** by relationship and priority
- **Emergency hotline integration**

### 💡 Safety Tips & Education
- **Curated safety guidelines** for different scenarios
- **Searchable knowledge base** with filtering options
- **Priority-based tips** (high, medium, low)
- **Category-wise organization** (personal, travel, digital, home, workplace)

### 👤 User Profile & Settings
- **Secure authentication** with Clerk
- **Privacy controls** and notification preferences
- **Emergency information** storage (blood type, medical conditions)
- **Customizable safety settings**

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Vite 5.4.2** - Fast build tool and dev server

### Authentication & Backend
- **Clerk** - Secure user authentication and management
- **React Router 6.26.0** - Client-side routing with protected routes

### Maps & Location
- **Leaflet 1.9.4** - Interactive maps with OpenStreetMap
- **Geolocation API** - High-accuracy location services
- **Overpass API** - Real-time emergency services data

### UI & Icons
- **Lucide React** - Beautiful, customizable icons
- **Responsive Design** - Mobile-first approach
- **Progressive Web App** ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/naarisuraksha-beta.git
   cd naarisuraksha-beta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Clerk publishable key to `.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🔐 Security Features

- **Protected Routes** - All pages require authentication
- **Secure Authentication** - Powered by Clerk with industry standards
- **Location Privacy** - User location only shared during emergencies
- **Data Encryption** - All sensitive data is encrypted
- **Emergency-First Design** - Quick access to help without barriers

## 📱 Mobile Responsive

NaariSuraksha is designed mobile-first with:
- **Touch-friendly interface** optimized for emergency situations
- **Offline capabilities** for critical features
- **Fast loading** even on slow networks
- **Intuitive navigation** with bottom tab bar on mobile

## 🌍 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Special thanks to [Sounak Chakraborty](https://github.com/sounak-chakraborty)** for guidance and support
- **OpenStreetMap** community for emergency services data
- **Clerk** for robust authentication infrastructure
- **Vercel** for seamless deployment platform

## 📞 Emergency Contacts

**In case of immediate danger, contact:**
- **Police Emergency**: 100
- **Women's Helpline**: 1091  
- **Medical Emergency**: 108
- **Fire Emergency**: 101

## 🔗 Links

- **Live Demo**: [naarisuraksha-beta.vercel.app](https://naarisuraksha-beta.vercel.app/)
- **Documentation**: [Coming Soon]
- **Support**: [Create an Issue](https://github.com/YOUR_USERNAME/naarisuraksha-beta/issues)

---

**Made with ❤️ for women's safety**  
*Part of Project Udaan - Empowering through technology*