import React from 'react';
import { MapPin } from 'lucide-react';
import logo from '../pages/logo.png'; // Assuming logo is correctly located

const Footer = () => {
  const styles = {
    footer: {
      background: 'white',
      borderTop: '1px solid #fed7aa',
      marginTop: '3rem'
    },
    footerContent: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '3rem 1rem'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    footerLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    footerText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    footerDescription: {
      color: '#4b5563',
      fontSize: '0.875rem'
    },
    footerHeading: {
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.75rem'
    },
    footerLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    footerLink: {
      fontSize: '0.875rem',
      color: '#4b5563',
      textDecoration: 'none'
    },
    footerCopyright: {
      borderTop: '1px solid #fed7aa',
      paddingTop: '2rem',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#4b5563'
    }
  };

 return (
   <footer style={styles.footer}>
     <div style={styles.footerContent}>
       <div style={styles.footerGrid}>
         <div>
            <div style={styles.footerLogo}>
               <img src={logo} alt="logo" width="40" height="60" />
                <span style={styles.footerText}>ThutoPele</span>
            </div>
               <p style={styles.footerDescription}>
                  Mokorotlo oa thuto le mesebetsi
                </p>
            </div>

        <div>
            <h4 style={styles.footerHeading}>Quick Links</h4>
             <div style={styles.footerLinks}>
              <a href="#" style={styles.footerLink}>About Us</a>
              <a href="#" style={styles.footerLink}>Careers</a>
              <a href="#" style={styles.footerLink}>Resources</a>
              <a href="#" style={styles.footerLink}>Blog</a>
         </div>
     </div>
     <div>
      <h4 style={styles.footerHeading}>Support</h4>
     <div style={styles.footerLinks}>
        <a href="#" style={styles.footerLink}>Help Center</a>
        <a href="#" style={styles.footerLink}>Contact Us</a>
        <a href="#" style={styles.footerLink}>Privacy Policy</a>
        <a href="#" style={styles.footerLink}>Terms of Service</a>
     </div>
    </div>

    <div>
     <h4 style={styles.footerHeading}>Location</h4>
        <p style={{ ...styles.footerDescription, marginBottom: '0.5rem' }}>
         <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem', color: '#f97316' }} />
             Maseru, Lesotho
        </p>
            <p style={styles.footerDescription}>
                Serving all 10 districts of Lesotho
            </p>
            </div>
    </div>

     <div style={styles.footerCopyright}>
         &copy; 2025 ThutoPele. Empowering careers across Lesotho & Beyond, one step at a time.
     </div>
    </div>
  </footer>
 );
};

export default Footer;