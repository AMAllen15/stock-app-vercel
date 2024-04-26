import axios from "axios";

const fetchNews = async (keywords) => {
  const apiKey = process.env.REACT_APP_NEWSAPI_KEY; // Make sure this matches your environment variable key
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${keywords}&apiKey=${apiKey}`
    );
    return response.data.articles;
  } catch (error) {
    console.error(
      "Error fetching news:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

export { fetchNews };
