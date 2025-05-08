import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../Navbar.jsx";

export default function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [suggestedRepos, setSuggestedRepos] = useState([]);

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    const fetchUserRepositories = async () => {
      try {
        const userRepos = await axios.get(
          `http://localhost:8080/Repo/fetchForCurrentUser/${userID}`
        );
        setRepositories(userRepos.data.repository);
      } catch (error) {
        console.error("Error while fetching User repos", error);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const allRepo = await axios.get(`http://localhost:8080/Repo/getAll`);
        setSuggestedRepos(allRepo.data.repositories);
      } catch (error) {
        console.error("Error while fetching All repos", error);
      }
    };
    fetchUserRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResult(repositories);
    } else {
      const repos = repositories.filter((repo) => {
        return repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setSearchResult(repos);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <div>
            <h3>Sugge Repos</h3>
            {suggestedRepos.map((repo) => {
              return (
                <div key={repo._id}>
                  <h5>{repo.name}</h5>
                  <h5>{repo.description}</h5>
                </div>
              );
            })}
          </div>
        </aside>
        <main>
          <div>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search Repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <h3>Your Repos</h3>
            {searchResult.map((repo) => {
              return (
                <div key={repo._id}>
                  <h5>{repo.name}</h5>
                  <h5>{repo.description}</h5>
                </div>
              );
            })}
          </div>
        </main>
        <aside>Upcoming events</aside>
      </section>
    </>
  );
}
