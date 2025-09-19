// Explore.jsx
import React from "react";

const exploreByGoal = [
  "AI", "Data Science", "Data Analytics", "Full Stack Development", "UI/UX Design",
  "Web Development", "Mobile App Development", "Software Development", "Cybersecurity",
  "Cloud Computing", "IT & Software", "Personal Development", "Design", "Marketing",
];

const popularIssuers = ["C", "C++", "Java", "Python", "JavaScript", "Ruby", "PHP"];

const popularSubjects = [
  "Full Stack Development", "Cloud Certification", "Networking Certification",
  "Cybersecurity Certification", "Data Science Certification", "AI Certification",
];

const Explore = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <div className="absolute left-0 top-full   w-screen max-w-2xl bg-white shadow-lg rounded-md p-3 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-xl font-bold">Explore</h2>
        <button onClick={() => setIsMenuOpen(false)} className="text-black text-2xl font-bold">✕</button>
      </div>

      {/* Scrollable menu */}
      <div className="overflow-y-auto max-h-[80vh] pr-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white text-black">
          <div className="mb-6">
          <h3 className="text-black  font-semibold mb-2">Learn</h3>
          <ul className="space-y-1">
            {exploreByGoal.map((item) => (
              <li key={item} className="text-black hover:text-purple-400 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-black font-semibold mb-2">Programs</h3>
          <ul className="space-y-1">
            {popularIssuers.map((item) => (
              <li key={item} className="text-black hover:text-purple-400 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-black font-semibold mb-2">Popular Subjects</h3>
          <ul className="space-y-1">
            {popularSubjects.map((item) => (
              <li key={item} className="text-black hover:text-purple-400 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Explore;
