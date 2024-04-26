import React, { useState, useEffect } from "react";
import { fetchNews } from "./FetchNews"; // Adjust the path as necessary

const NewsComponent = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const fetchedArticles = await fetchNews("stock market");
      setArticles(fetchedArticles);
    };

    loadNews();
  }, []);

  return (
    <div className="news-container">
      <h2 className="news-title">Market News</h2>
      <div className="news-grid">
        {articles.map((article, index) => (
          <div className="news-card" key={index}>
            <h3 className="news-card-title">{article.title}</h3>
            <p className="news-card-description">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-read-more"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsComponent;
