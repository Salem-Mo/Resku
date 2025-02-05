import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Navbar from "../components/Navbar/Navbar";
import './styles/Home.css';
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [feedback, setFeedback] = useState({ email: "", experience: 5, ease: 5, ui: 5, helpful: 5, suggestions: "" });
  const [messages, setMessages] = useState([]);

  const getEmoji = (rating) => {
    if (rating <= 2) return "😡";
    if (rating <= 4) return "😟";
    if (rating <= 6) return "😐";
    if (rating <= 8) return "😊";
    return "😃";
  };

  const getColor = (rating) => {
    if (rating <= 2) return "bg-red-600";
    if (rating <= 4) return "bg-orange-500";
    if (rating <= 6) return "bg-yellow-400";
    if (rating <= 8) return "bg-green-400";
    return "bg-green-600";
  };

  const handleFeedbackSubmit = () => {
    if (feedback.email) {
      setMessages([...messages, feedback]);
      setFeedback({ email: "", experience: 5, ease: 5, ui: 5, helpful: 5, suggestions: "" });
    }
  };


  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/map"); 
  };


  return (
    <>
      <Navbar />
      <div className="home-container text-white w-full overflow-y-scroll scrollbar-hide " dir="ltr">
        <section className="h-[100vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#16404D] text-center flex items-center justify-center h-screen">
            <div>
              <h1 className="text-6xl font-bold text-[#DDA853]">ReskU</h1>
              <h2 className="text-5xl font-bold text-[#FBF5DD] mt-4">Community-Driven Emergency Response</h2>
              <p className="mt-4 text-xl text-[#A6CDC6]">Reducing on-road fatalities through real-time assistance.</p>
              <button
              onClick={handleNavigate}
              className="mt-6 py-2 px-6 bg-[#DDA853] text-[#16404D] font-bold rounded-full hover:bg-[#A8A853] transition-colors"
            >
              Try Out the Website
            </button>
            </div>
          </motion.div>
        </section>
        <section className="bg-[#DDA853] flex items-center justify-center h-[100vh] p-10">
          <div>
            <h2 className="text-4xl font-semibold text-[#16404D]">About the Project</h2>
            <p className="mt-4 text-lg text-[#FBF5DD] max-w-3xl">
              This platform empowers users to request and provide assistance during emergencies within a 4-5 km range. It features live location tracking using Mapbox and real-time communication through WebSockets.
            </p>
          </div>
        </section>

        <section className="bg-[#A6CDC6] flex items-center justify-center h-[100vh] p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-[#16404D] text-[#FBF5DD] shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent>
                <img src="/gifs/map.png" alt="Live Map" className="rounded-lg w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105" />
                <p className="text-center mt-2 text-lg font-semibold">Live Map with Incidents</p>
              </CardContent>
            </Card>
            <Card className="bg-[#16404D] text-[#FBF5DD] shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent>
                <img src="/gifs/realtime.png" alt="Chat Feature" className="rounded-lg w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105" />
                <p className="text-center mt-2 text-lg font-semibold">Real-Time Chat</p>
              </CardContent>
            </Card>
            <Card className="bg-[#16404D] text-[#FBF5DD] shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent>
                <img src="/gifs/response.png" alt="Response Time" className="rounded-lg w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105" />
                <p className="text-center mt-2 text-lg font-semibold">Under 5-Minute Response</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-[#FBF5DD] flex items-center justify-center h-[100vh] p-10 text-[#16404D]">
          <div className="w-full max-w-xl">
            <h2 className="text-3xl font-semibold">Feedback</h2>
            <Input
              type="email"
              placeholder="Your Email"
              value={feedback.email}
              onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
              className="mt-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Experience", key: "experience" },
                { label: "Ease of Use", key: "ease" },
                { label: "UI", key: "ui" },
                { label: "Helpful", key: "helpful" }
              ].map(({ label, key }) => (
                <div key={key} className="mt-4">
                  <label>{label}</label>
                  <div className="flex items-center gap-2">
                    <span>-</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={feedback[key]}
                      onChange={(e) => setFeedback({ ...feedback, [key]: e.target.value })}
                      className={`w-full ${getColor(feedback[key])}`}
                    />
                    <span>+</span>
                    <span className="text-2xl">{getEmoji(feedback[key])}</span>
                  </div>
                </div>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Any suggestions?"
              value={feedback.suggestions}
              onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
              className="mt-4"
            />
            <Button className="mt-4 bg-[#DDA853] text-[#16404D]" onClick={handleFeedbackSubmit}>Submit</Button>
          </div>
        </section>
      <Footer />
      </div>
    </>
  );
};

export default Home;
