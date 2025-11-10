// Updated file: src/pages/Resources.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Award, FileText, Briefcase, Globe, ExternalLink, 
  ChevronRight, GraduationCap, DollarSign, MapPin, Building2, 
  Users, TrendingUp, ArrowLeft, Search, Filter, X, Download,
  Play, Star, Clock, UserCheck
} from 'lucide-react';
import Footer from './Footer';
import logo from './logo.png';

const Resources = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [viewCounts, setViewCounts] = useState({});
  const [brokenImages, setBrokenImages] = useState(new Set());

  

  const scholarshipResources = [
    {
      title: 'Lesotho National Manpower Development Secretariat (NMDS)',
      description: 'Government scholarships for Basotho students to study locally and abroad with comprehensive support and mentorship programs',
      url: 'http://www.scholarships.manp.gov.ls/',
      type: 'scholarship',
      location: 'Local & International',
      icon: Award,
      color: 'from-orange-500 to-pink-500',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ-KKDUVRmWwLG8_08_Dz9J60goGJm_fspL-cQSMbdLCbyUayCviKEaNmWAPqIWY-QVyQ&usqp=CAU',
      duration: '2-5 years',
      deadline: 'Varies',
      popularity: 95,
      features: ['Full tuition', 'Monthly stipend', 'Accommodation', 'Book allowance']
    },
    {
      title: 'Commonwealth Scholarships',
      description: 'Prestigious scholarships for master\'s and PhD students from Commonwealth countries with research opportunities',
      url: 'https://cscuk.fcdo.gov.uk/scholarships/',
      type: 'scholarship',
      location: 'UK',
      icon: Globe,
      color: 'from-blue-500 to-purple-500',
      image: 'https://www.hunterlodge.co.uk/wp-content/uploads/2024/12/happy-african-american-female-student-600nw-2345738157.webp',
      duration: '1-3 years',
      deadline: 'December 15',
      popularity: 88,
      features: ['Tuition fees', 'Airfare', 'Living expenses', 'Thesis grant']
    },
    {
      title: 'Mastercard Foundation Scholars Program',
      description: 'Comprehensive scholarships for academically talented youth from Africa with leadership development',
      url: 'https://mastercardfdn.org/all/scholars/',
      type: 'scholarship',
      location: 'Various',
      icon: Award,
      color: 'from-green-500 to-teal-500',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB2-iSG2AEa5VsDKUGdUFna2gRPMix_JksrA&s',
      duration: '4 years',
      deadline: 'January 31',
      popularity: 92,
      features: ['Full scholarship', 'Leadership training', 'Mentorship', 'Career support']
    },
    {
      title: 'Chinese Government Scholarship',
      description: 'Full scholarships for undergraduate and postgraduate studies in China with language preparation',
      url: 'https://www.scholarshipset.com/scholarships-in/china',
      type: 'scholarship',
      location: 'China',
      icon: Globe,
      color: 'from-red-500 to-orange-500',
      image: 'https://media.licdn.com/dms/image/v2/D4E12AQHKaI0ODVN7ww/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1677147422020?e=2147483647&v=beta&t=JUlFOxJB2egeqwwisUKVI2IvtwJYqdkv0w6NDKPvj2Y',
      duration: '4-6 years',
      deadline: 'April 30',
      popularity: 85,
      features: ['Tuition waiver', 'Accommodation', 'Medical insurance', 'Monthly allowance']
    },
    {
      title: 'South African Government Scholarships',
      description: 'Opportunities for Basotho students to study in South African universities with cultural exchange programs',
      url: 'https://www.dhet.gov.za/bursaries/',
      type: 'scholarship',
      location: 'South Africa',
      icon: Award,
      color: 'from-yellow-500 to-red-500',
      image: 'https://www.internationalscholarships.dhet.gov.za/images/article/French%20Scholarship.jpg',
      duration: '1-4 years',
      deadline: 'September 30',
      popularity: 78,
      features: ['Tuition coverage', 'Accommodation', 'Meal allowance', 'Study materials']
    }
  ];

  const careerResources = [
    {
      title: 'CV Writing Guide',
      description: 'Learn how to write a professional CV tailored for the Lesotho job market with local examples and templates',
      url:'https://www.google.com/aclk?sa=L&ai=DChsSEwik-qKjzeeQAxUXkFAGHYKgHd0YACICCAEQARoCZGc&co=1&ase=2&gclid=CjwKCAiAt8bIBhBpEiwAzH1w6V55Mc_p7Yjg5_l5IRHrv72PHwRCwM9CCpd_Cwoca6LXeJ4a2Z6C-BoCvkEQAvD_BwE&cid=CAASY-RoY3wHynj-V9oXX4ozNI2of9WviM07-D5MciH5EQBvHsPQ1CqkopQOe3dDl1Y4u0JWvtMdvmHW1jn7Sg_ZXrP0DE9RQDFClS9GLxAscBovx98wJPni0esUCw6pDURY73NlqQ&cce=2&category=acrcp_v1_32&sig=AOD64_2UZWSE3FwE0_MMRKtSZiVjd7rqHw&q&nis=4&adurl&ved=2ahUKEwjE6JujzeeQAxUgVkEAHXlbILIQ0Qx6BAgXEAE',
      type: 'career',
      icon: FileText,
      color: 'from-orange-500 to-pink-500',
      content: 'internal',
      image: 'https://admin.expatica.com/za/wp-content/uploads/sites/12/2023/11/cv-south-africa-1536x1024.jpg',
      duration: '15 min read',
      features: ['Local templates', 'Industry examples', 'ATS optimization', 'Cover letter guide'],
      
    },
    {
      title: 'Interview Preparation Tips',
      description: 'Master interview techniques and common questions asked by Lesotho employers with mock interview videos',
      url:'https://www.indeed.com/career-advice/interviewing/how-to-prepare-for-an-interview',
      type: 'career',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      content: 'internal',
      image: 'https://www.povertyactionlab.org/sites/default/files/styles/full_evaluation_image/public/5415-high_0.jpg?itok=ttHN5jKW',
      duration: '25 min read',
      features: ['Common questions', 'Body language tips', 'Salary negotiation', 'Follow-up etiquette'],
      
    },
    {
      title: 'Job Search Strategies',
      description: 'Effective strategies for finding employment in Lesotho\'s competitive market with local employer insights',
      url:'https://www.indeed.com/career-advice/finding-a-job/job-searching-strategies',
      type: 'career',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      content: 'internal',
      image: 'https://www.africanresearchers.org/wp-content/uploads/2025/02/A-Scoping-Review-on-Exploring-Job-Search-Strategies-for-Unemployed-Youth-Implications-for-the-Agro-Sector-in-Sub-Saharan-Africa.jpg',
      duration: '20 min read',
      features: ['Networking tips', 'Online platforms', 'Company research', 'Application tracking']
    }
  ];

  const educationResources = [
    {
      title: 'National University of Lesotho (NUL)',
      description: 'Lesotho\'s premier institution of higher learning offering undergraduate and postgraduate programs across diverse fields',
      url: 'https://www.nul.ls',
      type: 'education',
      location: 'Roma',
      icon: GraduationCap,
      color: 'from-indigo-500 to-purple-500',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/National_University_of_Lesotho_Administration_Block.jpg',
      programs: ['Undergraduate', 'Postgraduate', 'Research', 'Distance Learning'],
      ranking: '#1 in Lesotho'
    },
    {
      title: 'Lesotho College of Education',
      description: 'Teacher training and education programs for aspiring educators with practical teaching experience',
      url: 'https://www.lce.ac.ls',
      type: 'education',
      location: 'Maseru',
      icon: Book,
      color: 'from-green-500 to-emerald-500',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2SWSFtYdc5gzTgJBecZGNaCK09haVpEG2gQ&s',
      programs: ['Diploma in Education', 'Bachelor of Education', 'In-service Training'],
      ranking: 'Top Education College'
    },
    {
      title: 'Limkokwing University of Creative Technology',
      description: 'Creative technology, design, and innovation programs with industry partnerships',
      url: 'https://www.limkokwing.net/lesotho/',
      type: 'education',
      location: 'Maseru',
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkiVzJEHsCjHFMgY6h-YqbASudi0ToIIesQ&s',
      programs: ['Design', 'Business', 'Technology', 'Communication'],
      ranking: 'Innovation Focus'
    },
    {
      title: 'Lerotholi Polytechnic',
      description: 'Technical and vocational education and training programs for skilled professionals',
      url: 'https://www.lerotholi.ac.ls',
      type: 'education',
      location: 'Maseru',
      icon: Building2,
      color: 'from-cyan-500 to-blue-500',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5meR1ufg98tbdrMivVeyUwDOHqAqQ5xup7w&s',
      programs: ['Engineering', 'Business Studies', 'Hospitality', 'Computer Science'],
      ranking: 'Leading TVET Institution'
    }
  ];

  const financialResources = [
    {
      title: 'Study Loan Information',
      description: 'Comprehensive information about student loans and financial aid options available in Lesotho with application guidance',
      url:'https://www.google.com/aclk?sa=L&ai=DChsSEwiZweaTzueQAxXJlFAGHTEjBMIYACICCAEQABoCZGc&co=1&ase=2&gclid=CjwKCAiAt8bIBhBpEiwAzH1w6f-yeKGwN0feFIzwzBDfHF6-YCyw4oflISWc_LTB1lgaM3TXlx62-hoCMAkQAvD_BwE&cid=CAASY-RoBTCiblxyX5lFYf2wiN852QwVhKfLTEbFUPM27Q_DGLcvq6xOo1lVuGVExZVn8YDNPaMQu-YvO3f5HVdGecFpGQAqk8Ii-_VJuwb7wJnrDkrklmGhZJhTmpXoEj2jnUTuPA&cce=2&category=acrcp_v1_32&sig=AOD64_3oX75mO36dwpoB4UwkK-Lll4d8Dw&q&nis=4&adurl&ved=2ahUKEwio1uCTzueQAxU-QEEAHUXwB-sQ0Qx6BAgKEAE',
      type: 'financial',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      content: 'internal',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZpbmFuY2lhbCUyMGFkdmljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
      duration: '18 min read',
      features: ['Eligibility criteria', 'Application process', 'Repayment terms', 'Interest rates']
    },
    {
      title: 'Budgeting for Students',
      description: 'Practical tips on managing finances while studying in Lesotho with local cost of living insights',
      url:'https://www.thecompleteuniversityguide.co.uk/student-advice/after-you-start/budgeting-for-university',
      type: 'financial',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      content: 'internal',
      image: 'https://www.shutterstock.com/image-photo/african-woman-budgeting-south-rands-260nw-2500989015.jpg',
      duration: '12 min read',
      features: ['Monthly budgeting', 'Saving strategies', 'Expense tracking', 'Financial goals']
    }
  ];

  const allResources = [
    ...scholarshipResources,
    ...careerResources,
    ...educationResources,
    ...financialResources
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: Book, count: allResources.length },
    { id: 'scholarship', label: 'Scholarships', icon: Award, count: scholarshipResources.length },
    { id: 'career', label: 'Career Development', icon: Briefcase, count: careerResources.length },
    { id: 'education', label: 'Institutions', icon: GraduationCap, count: educationResources.length },
    { id: 'financial', label: 'Financial Aid', icon: DollarSign, count: financialResources.length }
  ];

  // Filter resources based on active category and search query
  const filteredResources = allResources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.type === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

 const handleResourceClick = (resource) => {
  // Track view count
  setViewCounts(prev => ({
    ...prev,
    [resource.title]: (prev[resource.title] || 0) + 1
  }));

  // Determine the target URL
  let targetUrl;
  if (resource.url) {
    // Resource has a direct external URL
    targetUrl = resource.url;
  } else {
    // Resource is an internal guide/content item, create a clean path (slug)
    const slug = resource.title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove all non-word characters (except spaces and hyphens)
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
    targetUrl = `/resources/${slug}`;
  }

  // Open the determined link in a new tab
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

  const toggleFavorite = (resourceTitle, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(resourceTitle)) {
        newFavorites.delete(resourceTitle);
      } else {
        newFavorites.add(resourceTitle);
      }
      return newFavorites;
    });
  };

  
 

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fffbeb, #fef2f2, #fffbeb)' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #fed7aa',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => navigate('/')}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fed7aa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft size={24} />
              </button>
              <div className="logo">
                <img 
                  src={logo}
                  alt="logo" 
                  width="50" 
                  height="75"
                />
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #dc2626, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Resources Hub
              </h1>
            </div>
            
            {/* Search Bar */}
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: '0.75rem',
                  border: '2px solid #fed7aa',
                  background: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = '#fed7aa'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(236, 72, 153, 0.8)), url('https://scontent.fmsu1-1.fna.fbcdn.net/v/t39.30808-6/542756806_1216593647179318_942734107807098013_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=YE4_p-eRIeYQ7kNvwHgauSJ&_nc_oc=AdmXqBu2KAQNJvim-o-HJ8Nsw0GBvC52IPxBkFtOUMy9AIC35oGw0C5lQFBtEJAaWxc&_nc_zt=23&_nc_ht=scontent.fmsu1-1.fna&_nc_gid=Au_D8FRKsebhcAGVDssGVg&oh=00_Afh8sqKNIITTZdT8NCubZnlpSv15NyHQPtdGEGMwdqa9PA&oe=691549A5')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '4rem 1rem'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div style={{
          position: 'relative',
          maxWidth: '80rem',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '1.5rem'
          }}>
            <MapPin size={16} />
            <span>Bohlale bo Bonesang Tsela</span>
          </div>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #ffffff, #fef3c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            The Path to Mosotho Excellence
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '42rem',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Discover scholarships, career resources, and educational opportunities to advance your future in Lesotho and beyond
          </p>
          
          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>50+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Resources</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>15+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Institutions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>25+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Scholarships</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{
        maxWidth: '80rem',
        margin: '-2rem auto 2rem',
        padding: '0 1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeCategory === category.id 
                      ? 'linear-gradient(to right, #f97316, #ec4899)' 
                      : 'transparent',
                    color: activeCategory === category.id ? 'white' : '#374151',
                    transform: activeCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: activeCategory === category.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                    position: 'relative'
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: '0.875rem' }}>{category.label}</span>
                  <span style={{
                    background: activeCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                    color: activeCategory === category.id ? 'white' : '#6b7280',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    marginLeft: '0.25rem'
                  }}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <Filter size={16} />
            <span>Filter</span>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '0 1rem 4rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '2rem'
        }}>
          {filteredResources.map((resource, index) => {
            const Icon = resource.icon;
            const isExternal = resource.url;
            const isFavorite = favorites.has(resource.title);
            const viewCount = viewCounts[resource.title] || 0;
            const isImageBroken = brokenImages.has(resource.image);
            
            return (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  border: '1px solid #fed7aa',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-0.5rem) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  e.currentTarget.style.borderColor = '#fdba74';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#fed7aa';
                }}
                onClick={() => handleResourceClick(resource)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(resource.title, e)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2.5rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.2s'
                  }}
                >
                  <Star 
                    size={18} 
                    fill={isFavorite ? '#f59e0b' : 'transparent'} 
                    color={isFavorite ? '#f59e0b' : '#6b7280'} 
                  />
                </button>

                {/* Resource Image - FIXED IMAGE PLACEMENT */}
                

                    {/* Resource Image - IMPROVED IMAGE HANDLING */}
                    <div style={{
                    height: '160px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#f3f4f6' // Fallback background color
                    }}>
                    {/* Main Image */}
                    {!brokenImages.has(resource.image) ? (
                        <img 
                        src={resource.image} 
                        alt={resource.title}
                        onError={() => handleImageError(resource.image)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                        />
                    ) : (
                        /* Fallback when image is broken */
                        <div style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${resource.color.split(' ')[1]}, ${resource.color.split(' ')[3]})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        color: 'white',
                        padding: '1rem'
                        }}>
                        <Icon size={48} />
                        <div style={{ 
                            marginTop: '0.5rem', 
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            {resource.title}
                        </div>
                        </div>
                    )}
                    
                    {/* Overlay with icon and location */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
                        padding: '1.5rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '0.75rem',
                            borderRadius: '0.75rem'
                        }}>
                            <Icon style={{ color: 'white' }} size={24} />
                        </div>
                        {resource.location && (
                            <span style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'white'
                            }}>
                            {resource.location}
                            </span>
                        )}
                        </div>
                        
                        {/* Popularity Bar */}
                        {resource.popularity && (
                        <div style={{ 
                            background: 'rgba(0, 0, 0, 0.3)', 
                            borderRadius: '9999px', 
                            height: '4px', 
                            overflow: 'hidden' 
                        }}>
                            <div style={{ 
                            width: `${resource.popularity}%`, 
                            height: '100%', 
                            background: 'white',
                            transition: 'width 0.5s ease-in-out'
                            }}></div>
                        </div>
                        )}
                    </div>
                    </div>

                {/* Card Body */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.75rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {resource.title}
                  </h3>
                  
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.6',
                    fontSize: '0.875rem'
                  }}>
                    {resource.description}
                  </p>

                  {/* Resource Metadata */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {resource.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      {viewCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <UserCheck size={14} />
                          <span>{viewCount} views</span>
                        </div>
                      )}
                    </div>
                    
                    {resource.ranking && (
                      <div style={{ 
                        background: '#fef3c7', 
                        color: '#d97706',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontWeight: '600'
                      }}>
                        {resource.ranking}
                      </div>
                    )}
                  </div>

                  {/* Action Section */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#f97316',
                      fontWeight: '600',
                      transition: 'color 0.3s',
                      fontSize: '0.875rem'
                    }}>
                      <span>{isExternal ? 'Visit Website' : 'Explore Resource'}</span>
                      {isExternal ? (
                        <ExternalLink size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>

                    {resource.download && (
                      <button
                        onClick={(e) => handleDownload(resource, e)}
                        style={{
                          background: '#fffbeb',
                          border: '1px solid #fed7aa',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#f97316',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Download size={14} />
                        PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              No resources found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'linear-gradient(to right, #f97316, #ec4899)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316, #ec4899)',
        color: 'white',
        padding: '4rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div style={{
          position: 'relative',
          maxWidth: '56rem',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Ready to Start Your Journey?
          </h3>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Create an account to apply for courses, track applications, and access personalized resources tailored for Basotho students
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'white',
              color: '#f97316',
              padding: '1rem 2.5rem',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }}
          >
            Get Started Now →
          </button>
        </div>
      </div>

      <Footer />
      
      
    </div>
  );
};

export default Resources;