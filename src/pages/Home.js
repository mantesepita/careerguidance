import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X, ArrowRight, Sparkles, Target, TrendingUp, Users, Briefcase, GraduationCap, Heart, Newspaper, DollarSign, Building2, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeNewsTab, setActiveNewsTab] = useState('business');

  const handleLogout = async () => {
    try {
      setShowLogoutConfirm(true);
      setTimeout(async () => {
        await logout();
        setShowLogoutConfirm(false);
        alert('Logged out successfully!');
      }, 1500);
    } catch (error) {
      console.error('Logout error:', error);
      setShowLogoutConfirm(false);
    }
  };

  const handleGetStarted = () => {
    if (currentUser) {
      // User is logged in, navigate to dashboard or profile
      navigate("/dashboard");
    } else {
      // User is not logged in, navigate to login
      navigate("/login");
    }
  };

  const features = [
    {
      icon: Target,
      title: 'Career Planning',
      description: 'Set and track your professional goals with personalized roadmaps'
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      description: 'Access curated learning resources aligned with Lesotho\'s job market'
    },
    {
      icon: Users,
      title: 'Local Networking',
      description: 'Connect with Basotho professionals and mentors across sectors'
    },
    {
      icon: Sparkles,
      title: 'AI Career Insights',
      description: 'Get intelligent recommendations tailored to Lesotho\'s economy'
    }
  ];

  const newsCategories = {
    business: [
      {
        title: 'Vodacom Lesotho Hosts Law & Technology Symposium',
        source: 'Business News',
        time: '2 days ago',
        location: 'Maseru',
        excerpt: 'Recent symposium explores digital regulation and tech-driven future for Lesotho\'s business landscape.',
        tag: 'Technology',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
      },
      {
        title: 'China Donates Agricultural Equipment to Boost Food Security',
        source: 'Trade & Development',
        time: '3 days ago',
        location: 'National',
        excerpt: 'Tractors, harvesters, and modern farming tools received to enhance mechanization and reduce import reliance.',
        tag: 'Agriculture',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'
      },
      {
        title: 'BEDCO Launches Partnership with RSL and Standard Bank',
        source: 'Enterprise Development',
        time: '5 days ago',
        location: 'Maseru',
        excerpt: 'New initiative aims to support SME development and strengthen local entrepreneurship ecosystem.',
        tag: 'SMEs',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80'
      },
      {
        title: 'CBL Wins 2025 Corporate Ethical Procurement Award',
        source: 'Banking',
        time: '1 week ago',
        location: 'Maseru',
        excerpt: 'Central Bank of Lesotho recognized by Chartered Institute for excellence in procurement practices.',
        tag: 'Finance',
        image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80'
      }
    ],
    health: [
      {
        title: 'Lesotho Validates Digital Health Strategy 2025-2030',
        source: 'Health Ministry',
        time: '1 week ago',
        location: 'Maseru',
        excerpt: 'New strategy leverages remote monitoring and big data analytics to transform healthcare delivery nationwide.',
        tag: 'Digital Health',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
      },
      {
        title: 'Health Workforce Density to Improve 27% by 2025',
        source: 'WHO Report',
        time: '2 weeks ago',
        location: 'National',
        excerpt: 'Doctors, nurses and midwives per 10,000 population projected to reach 26.73, representing significant progress.',
        tag: 'Healthcare',
        image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80'
      },
      {
        title: 'TB Treatment Program Expands Community Outreach',
        source: 'Partners In Health',
        time: '3 weeks ago',
        location: 'Botšabelo',
        excerpt: 'MDR-TB and XDR-TB care now available with targeted education in schools and vulnerable sectors.',
        tag: 'Public Health',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80'
      },
      {
        title: 'Chinese Medical Team Provides Free Services',
        source: 'Humanitarian Aid',
        time: '1 month ago',
        location: 'National',
        excerpt: 'Landmark humanitarian effort brings free medical services to communities across Lesotho.',
        tag: 'Healthcare Access',
        image: 'https://images.unsplash.com/photo-1551601651-05686bc1b4ab?w=800&q=80'
      }
    ],
    education: [
      {
        title: '50 Youths Selected for Business Development Training',
        source: 'Youth Development',
        time: '1 day ago',
        location: 'Maseru',
        excerpt: 'Participants to receive training on business plan development and pitching skills for 2025 initiatives.',
        tag: 'Entrepreneurship',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80'
      },
      {
        title: 'Ministry Implements New Curriculum with Teacher Training',
        source: 'Education Ministry',
        time: '4 days ago',
        location: 'All Districts',
        excerpt: 'Grade 8 teachers across all districts receive training in Scientific and Technological subjects for 2025.',
        tag: 'Curriculum',
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80'
      },
      {
        title: 'NUL Undergraduate Admissions 2024-2025 Open',
        source: 'National University',
        time: '1 week ago',
        location: 'Roma',
        excerpt: 'National University of Lesotho begins online admissions process for undergraduate programs.',
        tag: 'Higher Education',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'
      },
      {
        title: 'Education Project Reduces Junior Secondary Dropout Rates',
        source: 'World Bank',
        time: '2 weeks ago',
        location: 'National',
        excerpt: 'Dropout rates fall from 27% to 19.8%, with female rates at just 5.2% - exceeding project targets.',
        tag: 'Education Success',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
      }
    ],
    corporate: [
      {
        title: 'Lesotho Economy Faces Diversification Crossroads',
        source: 'Economic Analysis',
        time: '3 days ago',
        location: 'National',
        excerpt: 'Experts call for economic diversification beyond textiles and subsistence agriculture for sustainable growth.',
        tag: 'Economy',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
      },
      {
        title: 'Youth Unemployment Declared State of Emergency',
        source: 'Labour Market',
        time: '1 week ago',
        location: 'National',
        excerpt: 'Government addresses deepening crisis as graduates face challenges between qualifications and opportunities.',
        tag: 'Employment',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80'
      },
      {
        title: 'NSDP II Extended to 2028 with Focus on Private Sector',
        source: 'Government Policy',
        time: '2 weeks ago',
        location: 'Maseru',
        excerpt: 'Extended plan prioritizes inclusive growth, job creation, and strengthening human capital development.',
        tag: 'Policy',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'
      },
      {
        title: 'Trade Ministry Promotes Export Growth & SME Linkages',
        source: 'Trade Development',
        time: '3 weeks ago',
        location: 'Maseru',
        excerpt: 'New initiatives enhance logistics, attract investment, and support partnerships between large firms and local SMEs.',
        tag: 'Trade',
        image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=800&q=80'
      }
    ]
  };

  const upcomingEvents = [
    {
      title: 'NUL Career Fair 2025',
      date: 'Nov 15, 2025',
      location: 'Roma Campus',
      type: 'Career Fair'
    },
    {
      title: 'Digital Skills Workshop',
      date: 'Nov 20, 2025',
      location: 'Maseru',
      type: 'Workshop'
    },
    {
      title: 'Entrepreneurship Summit',
      date: 'Dec 5, 2025',
      location: 'Manthabiseng Centre',
      type: 'Summit'
    }
  ];

  const quickStats = [
    { label: 'Active Job Seekers', value: '2.3K+', icon: Users },
    { label: 'Partner Companies', value: '150+', icon: Building2 },
    { label: 'Success Stories', value: '500+', icon: Sparkles },
    { label: 'Training Programs', value: '80+', icon: GraduationCap }
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="logo-text">
                CareerSide
              </span>
            </div>

            <div className="nav-links">
              <a href="#news" className="nav-link">News</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="#events" className="nav-link">Events</a>
              
              {currentUser ? (
                <div className="user-section">
                  <span className="user-email">{currentUser.email}</span>
                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="logout-btn"
                >
                  <span>Login</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <a href="#news" className="mobile-link">News</a>
              <a href="#features" className="mobile-link">Features</a>
              <a href="#events" className="mobile-link">Events</a>
              {currentUser ? (
                <div className="mobile-user-section">
                  <p className="mobile-user-email">{currentUser.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mobile-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="mobile-logout-btn"
                >
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showLogoutConfirm && (
        <div className="logout-confirm">
          <div className="confirm-content">
            <div className="confirm-icon">
              <span>✓</span>
            </div>
            <span className="confirm-text">Logging out...</span>
          </div>
        </div>
      )}

      {/* Debug Info - Only show if you want to see login status */}
      {currentUser && (
        <div style={{ 
          background: '#fffbeb', 
          border: '1px solid #fed7aa', 
          padding: '10px', 
          textAlign: 'center',
          fontSize: '14px',
          color: '#c2410c'
        }}>
          ✅ You're logged in as: {currentUser.email}
        </div>
      )}

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="location-badge">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="location-text">
              Empowering Basotho Professionals
            </span>
          </div>

          <h1 className="hero-title">
            Welcome to{' '}
            <span className="gradient-text">
              CareerSide
            </span>
          </h1>

          <p className="hero-description">
            Your one-stop platform for managing career development and professional growth in Lesotho. 
            Navigate your career journey with confidence and local insights.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleGetStarted}>
              <span className="btn-content">
                <span>{currentUser ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="btn-arrow" />
              </span>
            </button>
            
            <button className="secondary-btn" onClick={() => navigate("/resources")}>
              Explore Resources
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <stat.icon className="stat-icon" />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      {/* News Section */}
      <div id="news" className="section">
        <div className="section-title">
          <h2 className="section-heading">
            Latest News &{' '}
            <span className="gradient-text">
              Updates
            </span>
          </h2>
          <p className="section-subtitle">Stay informed with Lesotho's latest developments</p>
        </div>

        {/* News Tabs */}
        <div className="news-tabs">
          {[
            { id: 'business', label: 'Business & Trade', icon: Briefcase },
            { id: 'health', label: 'Health & Lifestyle', icon: Heart },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'corporate', label: 'Corporate Life', icon: Building2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveNewsTab(tab.id)}
              className={`news-tab ${activeNewsTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="news-grid">
          {newsCategories[activeNewsTab].map((news, index) => (
            <div
              key={index}
              className="news-card"
            >
              {/* News Image */}
              <div className="news-image">
                <img 
                  src={news.image} 
                  alt={news.title}
                />
                <div className="news-tag">
                  {news.tag}
                </div>
                <div className="news-time">
                  <Clock className="w-3 h-3" />
                  <span>{news.time}</span>
                </div>
              </div>
              
              {/* News Content */}
              <div className="news-content">
                <h3 className="news-title">
                  {news.title}
                </h3>
                
                <p className="news-excerpt">{news.excerpt}</p>
                
                <div className="news-meta">
                  <div className="news-location">
                    <MapPin className="w-4 h-4" />
                    <span>{news.location}</span>
                    <span>{news.source}</span>
                  </div>
                  <button className="news-read-more">
                    <span>Read more</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section">
        <div className="section">
          <div className="section-title">
            <h2 className="section-heading">
              Powerful Features for{' '}
              <span className="gradient-text">
                Your Success
              </span>
            </h2>
            <p className="section-subtitle">Tools designed for the Lesotho job market</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
              >
                <div className="feature-icon">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div id="events" className="section">
        <div className="section-title">
          <h2 className="section-heading">
            Upcoming{' '}
            <span className="gradient-text">
              Events
            </span>
          </h2>
          <p className="section-subtitle">Don't miss out on career opportunities</p>
        </div>

        <div className="events-grid">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="event-card"
            >
              <div className="event-header">
                <div className="event-icon">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="event-type">
                  {event.type}
                </span>
              </div>
              
              <h3 className="event-title">{event.title}</h3>
              
              <div className="event-details">
                <div className="event-detail">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>{event.date}</span>
                </div>
                <div className="event-detail">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <button className="event-register">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div className="logo-icon">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="logo-text">
                  CareerSide
                </span>
              </div>
              <p className="footer-description">
                Empowering Basotho professionals to reach their full potential.
              </p>
            </div>
            
            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Resources</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-heading">Location</h4>
              <p className="footer-location">
                <MapPin className="w-4 h-4 inline mr-1 text-orange-500" />
                Maseru, Lesotho
              </p>
              <p className="footer-description">
                Serving all 10 districts of Lesotho
              </p>
            </div>
          </div>
          
          <div className="footer-copyright">
            © 2025 CareerSide. Empowering careers across Lesotho, one step at a time.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;