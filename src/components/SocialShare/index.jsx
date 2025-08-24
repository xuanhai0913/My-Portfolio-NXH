import React from 'react';
import { getSocialShareUrls } from '../../utils/metaTags';
import './SocialShare.css';

const SocialShare = ({ pageName = 'home', showText = true, size = 'medium' }) => {
  const shareUrls = getSocialShareUrls(pageName);

  const handleShare = (platform, url) => {
    // Open share URL in new window
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      url,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: shareUrls.facebook,
      color: '#1877F2',
      bgColor: '#1877F2'
    },
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      url: shareUrls.twitter,
      color: '#1DA1F2',
      bgColor: '#1DA1F2'
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin-in',
      url: shareUrls.linkedin,
      color: '#0A66C2',
      bgColor: '#0A66C2'
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      url: shareUrls.whatsapp,
      color: '#25D366',
      bgColor: '#25D366'
    },
    {
      name: 'Telegram',
      icon: 'fab fa-telegram-plane',
      url: shareUrls.telegram,
      color: '#0088CC',
      bgColor: '#0088CC'
    },
    {
      name: 'Pinterest',
      icon: 'fab fa-pinterest-p',
      url: shareUrls.pinterest,
      color: '#E60023',
      bgColor: '#E60023'
    },
    {
      name: 'Reddit',
      icon: 'fab fa-reddit-alien',
      url: shareUrls.reddit,
      color: '#FF4500',
      bgColor: '#FF4500'
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      url: shareUrls.email,
      color: '#EA4335',
      bgColor: '#EA4335'
    }
  ];

  // Web Share API for mobile devices
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.querySelector('meta[name="description"]')?.content || '',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className={`social-share social-share--${size}`}>
      {showText && <h3 className="social-share__title">Chia sẻ Portfolio</h3>}
      
      <div className="social-share__buttons">
        {/* Native share button for mobile */}
        {navigator.share && (
          <button
            className="social-share__button social-share__button--native"
            onClick={handleNativeShare}
            title="Chia sẻ"
          >
            <i className="fas fa-share-alt"></i>
            {showText && <span>Chia sẻ</span>}
          </button>
        )}

        {/* Social platform buttons */}
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            className={`social-share__button social-share__button--${platform.name.toLowerCase()}`}
            onClick={() => handleShare(platform.name, platform.url)}
            title={`Chia sẻ lên ${platform.name}`}
            style={{
              '--platform-color': platform.color,
              '--platform-bg': platform.bgColor
            }}
          >
            <i className={platform.icon}></i>
            {showText && <span>{platform.name}</span>}
          </button>
        ))}
      </div>

      {/* Copy link button */}
      <button
        className="social-share__button social-share__button--copy"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          // Show toast notification
          const toast = document.createElement('div');
          toast.className = 'social-share__toast';
          toast.textContent = 'Đã copy link!';
          document.body.appendChild(toast);
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 2000);
        }}
        title="Copy link"
      >
        <i className="fas fa-link"></i>
        {showText && <span>Copy Link</span>}
      </button>
    </div>
  );
};

export default SocialShare;
