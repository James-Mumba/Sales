import { faBell, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { app, db } from "../Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Navbar() {
  const auth = getAuth(app);
  const [showNoty, setShowNoty] = useState(false);
  const notyRef = useRef(null);

  const toggleNotyDisplay = () => {
    setShowNoty((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (notyRef.current && !notyRef.current.contains(event.target)) {
      setShowNoty(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowNoty(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [previousSearches, setPreviousSearches] = useState([]);

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      // Perform Firestore search query
      const q = query(
        collection(db, "Sales-Data"),
        where("item", ">=", value),
        where("item", "<=", value + "\uf8ff") // For prefix matching
      );

      const querySnapshot = await getDocs(q);
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setSearchResults(results);

      // Store this search for future suggestions
      const updatedSearches = [...previousSearches, value];
      const uniqueSearches = [...new Set(updatedSearches)]; // Avoid duplicates
      setPreviousSearches(uniqueSearches);
      localStorage.setItem("previousSearches", JSON.stringify(uniqueSearches));
    } else {
      setSearchResults([]); // Clear search results if input is empty
    }
  };

  //fetch user
  const [user, setUser] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        console.log(userId);

        const fetchData = async () => {
          const q = query(
            collection(db, "clients-Data"),
            where("userId", "==", userId)
          );
          let clientsNames = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((clientsDoc) => {
            clientsNames.push({
              id: clientsDoc.id,
              ...clientsDoc.data(),
            });
          });
          setUser(clientsNames); // Update after loop
        };
        fetchData();
      }
    });
  }, [auth]);

  return (
    <div className="navbar">
      <div className="tafuta">
        <input
          type="search"
          name=""
          id="search"
          placeholder="Search here"
          onFocus={() => setSearchResults(previousSearches)}
        />
        <button className="search" type="submit">
          search
        </button>
      </div>
      <div className="buttons">
        <button className="notification" onClick={toggleNotyDisplay}>
          <FontAwesomeIcon className="log" icon={faBell} />
          {searchTerm === "" && previousSearches.length > 0 && (
            <ul>
              {previousSearches.map((search, index) => (
                <li key={index} onClick={() => setSearchTerm(search)}>
                  {search}
                </li>
              ))}
            </ul>
          )}

          {/* Display search results */}
          {searchTerm !== "" && searchResults.length > 0 && (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id}>
                  {result.item} - {result.pieces} pcs
                </li>
              ))}
            </ul>
          )}
        </button>
        {showNoty && (
          <div className="noty-display" ref={notyRef}>
            <h6>Notifications</h6>
            <div className="noty-content">
              <div className="box-1-noty">
                <p>
                  Broccoli <span className="noty-qty"> 2kgs </span> left
                </p>
                <p>You're running low on supplies'</p>
              </div>
            </div>
            <button className="clear">clear</button>
          </div>
        )}
        <button className="settings">
          <FontAwesomeIcon className="log" icon={faGear} />
        </button>
      </div>
      <div className="profileP">
        <div className="pic"></div>
        <p className="userName">
          {user.length > 0 ? user[0].user : "No user found"}
        </p>
      </div>
    </div>
  );
}

export default Navbar;
