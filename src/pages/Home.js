import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X, ArrowRight, Sparkles, Target, TrendingUp, Users, Briefcase, GraduationCap, Heart, Newspaper, DollarSign, Building2, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import './Home.css';
import logo from './logo.png';
import Footer from './Footer';

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
        image: 'https://media.licdn.com/dms/image/v2/D4D22AQHHgRpWIL0UCw/feedshare-shrink_2048_1536/B4DZo2qudUIMAw-/0/1761853765050?e=1764201600&v=beta&t=uDed3xADmsuRJP2MOPgA0nKNyOghzQlG5ucFB-UADQI'
      },
      {
        title: 'China Donates Agricultural Equipment to Boost Food Security',
        source: 'Trade & Development',
        time: '3 days ago',
        location: 'National',
        excerpt: 'Tractors, harvesters, and modern farming tools received to enhance mechanization and reduce import reliance.',
        tag: 'Agriculture',
        image: 'https://www.thereporter.co.ls/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-01-at-13.10.34.jpeg'
      },
      {
        title: 'BEDCO Launches Partnership with RSL and Standard Bank',
        source: 'Enterprise Development',
        time: '5 days ago',
        location: 'Maseru',
        excerpt: 'New initiative aims to support SME development and strengthen local entrepreneurship ecosystem.',
        tag: 'SMEs',
        image: 'https://lesotho.co.ls/wp-content/uploads/2025/06/498199856_685108344130164_8608115310218343840_n.jpg'
      },
      {
        title: 'CBL Wins 2025 Corporate Ethical Procurement Award',
        source: 'Banking',
        time: '1 week ago',
        location: 'Maseru',
        excerpt: 'Central Bank of Lesotho recognized by Chartered Institute for excellence in procurement practices.',
        tag: 'Finance',
        image: 'https://lesotho.co.ls/wp-content/uploads/2025/08/534642658_1330142072453780_828996383979864784_n.jpg'
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
        image: 'https://www.afro.who.int/sites/default/files/2024-12/339A7389.jpg'
      },
      {
        title: 'Health Workforce Density to Improve 27% by 2025',
        source: 'WHO Report',
        time: '2 weeks ago',
        location: 'National',
        excerpt: 'Doctors, nurses and midwives per 10,000 population projected to reach 26.73, representing significant progress.',
        tag: 'Healthcare',
        image: 'https://www.pih.org/sites/default/files/inline-images/Lesotho_0218_Botha-BotheMP_CAvila_050-web.jpg'
      },
      {
        title: 'TB Treatment Program Expands Community Outreach',
        source: 'Partners In Health',
        time: '3 weeks ago',
        location: 'Botšabelo',
        excerpt: 'MDR-TB and XDR-TB care now available with targeted education in schools and vulnerable sectors.',
        tag: 'Public Health',
        image: 'https://www.pih.org/sites/default/files/2025-02/Lesotho_20240420_TBHunterNkau_NChandrasekar_152.jpg'
      },
      {
        title: 'Chinese Medical Team Provides Free Services',
        source: 'Humanitarian Aid',
        time: '1 month ago',
        location: 'National',
        excerpt: 'Landmark humanitarian effort brings free medical services to communities across Lesotho.',
        tag: 'Healthcare Access',
        image: 'https://nul.ls/wp-content/uploads/2025/07/MG_0532-copy-scaled.jpg'
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
        image: 'https://lesotho.co.ls/wp-content/uploads/2025/09/545184082_1322917046510636_5282686795033644541_n-780x470.jpg'
      },
      {
        title: 'Ministry Implements New Curriculum with Teacher Training',
        source: 'Education Ministry',
        time: '4 days ago',
        location: 'All Districts',
        excerpt: 'Grade 8 teachers across all districts receive training in Scientific and Technological subjects for 2025.',
        tag: 'Curriculum',
        image: 'https://worldbank.scene7.com/is/image/worldbankprod/le-Lesotho-teacher-training?wid=780&hei=439&qlt=85,0&resMode=sharp'
      },
      {
        title: 'NUL Undergraduate Admissions 2024-2025 Open',
        source: 'National University',
        time: '1 week ago',
        location: 'Roma',
        excerpt: 'National University of Lesotho begins online admissions process for undergraduate programs.',
        tag: 'Higher Education',
        image: 'https://africanuniversities.org/wp-content/uploads/2023/06/National-University-of-Lesotho-Lesotho.png'
      },
      {
        title: 'Education Project Reduces Junior Secondary Dropout Rates',
        source: 'World Bank',
        time: '2 weeks ago',
        location: 'National',
        excerpt: 'Dropout rates fall from 27% to 19.8%, with female rates at just 5.2% - exceeding project targets.',
        tag: 'Education Success',
        image: 'https://pbs.twimg.com/media/Gak-m-DWMAAdMgb?format=jpg&name=4096x4096'
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
        image: 'https://mg.co.za/wp-content/uploads/2025/07/maseru_extra_large.jpeg'
      },
      {
        title: 'Youth Unemployment Declared State of Emergency',
        source: 'Labour Market',
        time: '1 week ago',
        location: 'National',
        excerpt: 'Government addresses deepening crisis as graduates face challenges between qualifications and opportunities.',
        tag: 'Employment',
        image: 'https://apanews.net/wp-content/uploads/2025/02/Unemployment-1-1024x430.jpeg'
      },
      {
        title: 'NSDP II Extended to 2028 with Focus on Private Sector',
        source: 'Government Policy',
        time: '2 weeks ago',
        location: 'Maseru',
        excerpt: 'Extended plan prioritizes inclusive growth, job creation, and strengthening human capital development.',
        tag: 'Policy',
        image: 'https://www.gov.ls/wp-content/uploads/2023/05/PS-TRADE.jpg'
      },
      {
        title: 'Trade Ministry Promotes Export Growth & SME Linkages',
        source: 'Trade Development',
        time: '3 weeks ago',
        location: 'Maseru',
        excerpt: 'New initiatives enhance logistics, attract investment, and support partnerships between large firms and local SMEs.',
        tag: 'Trade',
        image: 'https://www.gov.ls/wp-content/uploads/2021/11/Thetsane-Industial-Area.jpg'
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
              <div className="logo">
                <img 
                  src={logo}
                  alt="logo" 
                  width="50" 
                  height="75"
                />
              </div>
              <span className="logo-text">
               ThutoPele
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
          You're logged in as: {currentUser.email}
        </div>
      )}

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="location-badge">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="location-text">
              Mokorotlo oa thuto le mesebetsi 
            </span>
          </div>

          <h1 className="hero-title">
            Welcome to{' '}
            <span className="gradient-text">
              ThutoPele
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
         <Footer/> 
    </div>
  );
};

export default Home;