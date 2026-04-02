import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const DEVTO_API = 'https://dev.to/api/articles?username=xuanhai0913&per_page=20';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Blog — Nguyễn Xuân Hải | React, .NET Core & AI Articles';

    const fetchArticles = async () => {
      try {
        const res = await fetch(DEVTO_API);
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
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-loading">
          <div className="blog-loading-bar" />
          <span>Fetching articles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
        <div className="blog-error">
          <p>Could not load articles. <a href="https://dev.to/xuanhai0913" target="_blank" rel="noopener noreferrer">View on Dev.to</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <Link to="/" className="blog-back">&larr; Back</Link>
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">
          Writing about React, .NET Core, AI, and building production web apps.
        </p>
      </div>

      <div className="blog-grid">
        {articles.map((article, index) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {article.cover_image && (
              <div className="blog-card-cover">
                <img
                  src={article.cover_image}
                  alt={`${article.title} — cover image`}
                  loading="lazy"
                />
              </div>
            )}

            <div className="blog-card-body">
              <div className="blog-card-meta">
                <time>{formatDate(article.published_at)}</time>
                <span className="blog-card-reading">{article.reading_time_minutes} min read</span>
              </div>

              <h2 className="blog-card-title">{article.title}</h2>

              <p className="blog-card-desc">{article.description}</p>

              <div className="blog-card-tags">
                {article.tag_list.map(tag => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>

              <div className="blog-card-stats">
                <span>{article.public_reactions_count} reactions</span>
                <span>{article.comments_count} comments</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="blog-footer">
        <a
          href="https://dev.to/xuanhai0913"
          target="_blank"
          rel="noopener noreferrer"
          className="blog-devto-link"
        >
          View all on Dev.to &rarr;
        </a>
      </div>
    </div>
  );
};

export default Blog;
