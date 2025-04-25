import { useLanguage } from "../translator/Languagecontext";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Autocomplete = ({ suggestions, selectAutocomplete }) => {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showBox, setShowBox] = useState(false);
  const boxRef = useRef(null);
  const { t } = useLanguage();

  const onChange = (e) => {
    const input = e.currentTarget.value;
    let filtered = suggestions;

    if (suggestions) {
      filtered = suggestions.filter((suggestion) =>
          suggestion.attributes.username
              .toLowerCase()
              .includes(input.toLowerCase())
      );
    }

    setActiveSuggestion(0);
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    setUserInput(input);
  };

  const onClick = (e) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);
    setShowBox(false);
    selectAutocomplete(e.currentTarget.id);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion]?.attributes.username || "");
    } else if (e.key === "ArrowUp") {
      if (activeSuggestion === 0) return;
      setActiveSuggestion(activeSuggestion - 1);
    } else if (e.key === "ArrowDown") {
      if (activeSuggestion >= filteredSuggestions.length - 1) return;
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
        document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <div className="suggestions-list">
        <label style={{color:"rgb(70, 70, 70)", display:"none"}}htmlFor="autocompleteInput" className="custom-autocomplete-label">
          {t("autocomplete_enter_user")}
        </label>
        <input
            id="autocompleteInput"
            type="text"
            className="autocomplete-input"
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={() => setShowBox(true)}
            value={userInput}
            placeholder={t("autocomplete_enter_user")}
        />
        {showBox && (
            <div className="autocomplete" ref={boxRef}>
              {filteredSuggestions.length > 0 ? (
                  <ul className="suggestions">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id}
                            id={suggestion.id}
                            className={index === activeSuggestion ? "suggestion-active" : ""}
                            onClick={onClick}
                        >
                          {suggestion.attributes.username}
                        </li>
                    ))}
                  </ul>
              ) : (
                  <em>{t("autocomplete_no_suggestions")}</em>
              )}
            </div>
        )}
      </div>
  );
};

Autocomplete.propTypes = {
  suggestions: PropTypes.instanceOf(Array),
};

Autocomplete.defaultProps = {
  suggestions: [],
};

export default Autocomplete;
