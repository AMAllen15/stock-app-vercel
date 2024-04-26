import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LineChart from "../components/Chart";
import axios from "axios";
import io from "socket.io-client";
import { usePortfolio } from "../components/StockPortfolio";
import { useWatchlist } from "../components/StockWatchlist";

const socket = io("http://localhost:4000");

const Stocks = () => {
  const [chartData, setChartData] = useState({});
  const [summary, setSummary] = useState(null);
  const [flag, setFlag] = useState(false);
  const [userName, setUserName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { state } = useLocation();
  const apiKey = process.env.REACT_APP_API_KEY;
  const { addStockToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isInPortfolio, setIsInPortfolio] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { addToPortfolio, removeFromPortfolio } = usePortfolio();

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const options = {
          method: "GET",
          url: `https://yfapi.net/v8/finance/chart/${state}?range=1mo&interval=1d`,
          headers: {
            "x-api-key": apiKey,
          },
        };

        const response = await axios.request(options);
        setChartData({
          labels: response.data.chart.result[0].timestamp.map((elem) =>
            new Date(elem * 1000).toLocaleDateString("en-US")
          ),
          datasets: [
            {
              label: "Changes Reflected Daily",
              data: response.data.chart.result[0].indicators.quote[0].close,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
        setSummary(response.data.chart.result[0].meta);
        setFlag(true);
      } catch (error) {
        console.error(error);
        setFlag(true);
      }
    };

    fetchTrend();

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [apiKey, state]);

  const sendMessage = () => {
    if (chatMessage && userName) {
      const messageData = {
        name: userName,
        message: chatMessage,
        id: Date.now(),
      };
      socket.emit("sendMessage", messageData);
      setChatMessage("");
      setUserName("");
    }
  };

  const togglePortfolio = () => {
    const stockDetails = {
      symbol: summary.symbol,
      price: summary.regularMarketPrice,
    };
    if (isInPortfolio) {
      removeFromPortfolio(summary.symbol); // Assuming you use symbol to identify stock
    } else {
      addToPortfolio({ ...stockDetails, quantity: 1 }); // Add quantity or other needed info
    }
    setIsInPortfolio(!isInPortfolio);
  };

  const toggleWatchlist = () => {
    const stockDetails = {
      symbol: summary.symbol,
      price: summary.regularMarketPrice,
    };
    if (isInWatchlist) {
      removeFromWatchlist(summary.symbol);
    } else {
      addStockToWatchlist(stockDetails);
    }
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <div className="stock-details">
      {flag ? (
        <>
          <div className="stock-row">
            <div className="stock-column-data">
              {summary && (
                <>
                  <h2>
                    {summary.exchangeName} ({summary.symbol}) $
                    {summary.regularMarketPrice}
                  </h2>
                  <div className="stock-headings">
                    <h4>Exchange Name: {summary.exchangeName}</h4>
                    <h4>Instrument Type: {summary.instrumentType}</h4>
                    <h4>Previous Close Price: ${summary.chartPreviousClose}</h4>
                    <h4>Current Price: ${summary.regularMarketPrice}</h4>
                    <button onClick={togglePortfolio}>
                      {isInPortfolio
                        ? "Remove from Portfolio"
                        : "Add to Portfolio"}
                    </button>
                    <button onClick={toggleWatchlist}>
                      {" "}
                      {isInWatchlist
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"}
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="stock-column-chart">
              <LineChart chartData={chartData} />
            </div>
          </div>
          <div className="chat-container">
            <h3>Chat about this stock</h3>
            <div className="message-container">
              {messages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.name}:</strong> {msg.message}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={userName}
              placeholder="Enter your name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              value={chatMessage}
              placeholder="Enter a message"
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      ) : (
        <p>Loading Data...</p>
      )}
    </div>
  );
};

export default Stocks;

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import LineChart from "../components/Chart";
// import axios from "axios";
// import io from "socket.io-client";
// import { usePortfolio } from "../components/StockPortfolio"; // Import the context hook for portfolio
// import { useWatchlist } from "../components/StockWatchlist"; // Import the context hook for watchlist

// const socket = io("http://localhost:4000");

// const Stocks = () => {
//   const [chartData, setChartData] = useState({});
//   const [summary, setSummary] = useState(null);
//   const [flag, setFlag] = useState(false);
//   const { state } = useLocation();
//   const apiKey = process.env.REACT_APP_API_KEY;
//   const { addToPortfolio, removeFromPortfolio } = usePortfolio();
//   const { addStockToWatchlist, removeFromWatchlist } = useWatchlist();
//   const [isInPortfolio, setIsInPortfolio] = useState(false);
//   const [isInWatchlist, setIsInWatchlist] = useState(false);

//   useEffect(() => {
//     const fetchTrend = async () => {
//       try {
//         const options = {
//           method: "GET",
//           url: `https://yfapi.net/v8/finance/chart/${state}?range=1mo&interval=1d`,
//           headers: { "x-api-key": apiKey },
//         };

//         const response = await axios.request(options);
//         setChartData({
//           labels: response.data.chart.result[0].timestamp.map((elem) =>
//             new Date(elem * 1000).toLocaleDateString("en-US")
//           ),
//           datasets: [
//             {
//               label: "Changes Reflected Daily",
//               data: response.data.chart.result[0].indicators.quote[0].close,
//               backgroundColor: "rgba(54, 162, 235, 0.2)",
//               borderColor: "rgba(54, 162, 235, 1)",
//               borderWidth: 1,
//             },
//           ],
//         });
//         setSummary(response.data.chart.result[0].meta);
//         setFlag(true);
//       } catch (error) {
//         console.error(error);
//         setFlag(true);
//       }
//     };

//     fetchTrend();
//   }, [apiKey, state]);

//   const togglePortfolio = () => {
//     const stockDetails = {
//       symbol: summary.symbol,
//       price: summary.regularMarketPrice,
//     };
//     if (isInPortfolio) {
//       removeFromPortfolio(summary.symbol); // Assuming you use symbol to identify stock
//     } else {
//       addToPortfolio({ ...stockDetails, quantity: 1 }); // Add quantity or other needed info
//     }
//     setIsInPortfolio(!isInPortfolio);
//   };

//   const toggleWatchlist = () => {
//     const stockDetails = {
//       symbol: summary.symbol,
//       price: summary.regularMarketPrice,
//     };
//     if (isInWatchlist) {
//       removeFromWatchlist(summary.symbol);
//     } else {
//       addStockToWatchlist(stockDetails);
//     }
//     setIsInWatchlist(!isInWatchlist);
//   };

//   return (
//     <div className="stock-details">
//       {flag ? (
//         <>
//           <div className="stock-row">
//             <div className="stock-column-data">
//               {summary && (
//                 <>
//                   <h2>
//                     {summary.exchangeName} ({summary.symbol}) $
//                     {summary.regularMarketPrice}
//                   </h2>
//                   <button onClick={togglePortfolio}>
//                     {isInPortfolio
//                       ? "Remove from Portfolio"
//                       : "Add to Portfolio"}
//                   </button>
//                   <button onClick={toggleWatchlist}>
//                     {isInWatchlist
//                       ? "Remove from Watchlist"
//                       : "Add to Watchlist"}
//                   </button>
//                 </>
//               )}
//             </div>
//             <div className="stock-column-chart">
//               <LineChart chartData={chartData} />
//             </div>
//           </div>
//         </>
//       ) : (
//         <p>Loading Data...</p>
//       )}
//     </div>
//   );
// };

// export default Stocks;
