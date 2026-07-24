import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './Blog.css';

const DEVTO_API = 'https://dev.to/api/articles?username=xuanhai0913&per_page=20';

// Dev.to API returns HTML entities in descriptions
const decodeEntities = (str) => {
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
};

const Blog = () => {
  const { t, i18n: i18nInstance } = useTranslation('content');
  const { localizePath } = useLocaleNavigation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = t('blog.documentTitle');
  }, [t]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Cache-bust to get latest articles
        const cacheBuster = `&_t=${Date.now()}`;
        const res = await fetch(DEVTO_API + cacheBuster, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(
      i18nInstance.resolvedLanguage === 'vi' ? 'vi-VN' : 'en-US',
      {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
      }
    );
  };

  const localizeArticle = (article) => {
    if (i18nInstance.resolvedLanguage !== 'vi') return article;

    const slug = article.slug || article.url?.split('/').filter(Boolean).pop();
    const key = `blog.articles.${slug}`;

    return {
      ...article,
      title: t(`${key}.title`, { defaultValue: article.title }),
      description: t(`${key}.description`, { defaultValue: article.description })
    };
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-loading">
          <div className="blog-loading-bar" />
          <span>{t('blog.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
        <div className="blog-error">
          <p>{t('blog.error')} <a href="https://dev.to/xuanhai0913" target="_blank" rel="noopener noreferrer">{t('blog.viewOnDevto')}</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <Link to={localizePath('/')} className="blog-back">&larr; {t('blog.back')}</Link>
        <h1 className="blog-title">{t('blog.title')}</h1>
        <p className="blog-subtitle">
          {t('blog.subtitle')}
        </p>
      </div>

      <div className="blog-grid">
        {articles.map((rawArticle, index) => {
          const article = localizeArticle(rawArticle);

          return (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="blog-card-cover">
              {(article.cover_image || article.social_image) ? (
                <img
                  src={article.cover_image || article.social_image}
                  alt={t('blog.coverAlt', { title: article.title })}
                  loading="lazy"
                />
              ) : (
                <div className="blog-card-cover-fallback">
                  <span>{article.tag_list?.[0] || '{ }'}</span>
                </div>
              )}
            </div>

            <div className="blog-card-body">
              <div className="blog-card-meta">
                <time>{formatDate(article.published_at)}</time>
                <span className="blog-card-reading">{t('blog.minutesRead', { count: article.reading_time_minutes })}</span>
              </div>

              <h2 className="blog-card-title">{article.title}</h2>

              <p className="blog-card-desc">{decodeEntities(article.description)}</p>

              <div className="blog-card-tags">
                {article.tag_list.map(tag => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>

              <div className="blog-card-stats">
                <span>❤️ {t('blog.reactions', { count: article.public_reactions_count })}</span>
                <span>💬 {t('blog.comments', { count: article.comments_count })}</span>
              </div>
            </div>
          </a>
          );
        })}
      </div>

      <div className="blog-footer">
        <a
          href="https://dev.to/xuanhai0913"
          target="_blank"
          rel="noopener noreferrer"
          className="blog-devto-link"
        >
          {t('blog.viewAll')} &rarr;
        </a>
      </div>
    </div>
  );
};

export default Blog;
