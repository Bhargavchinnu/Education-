import React, { useState } from "react";
import "./App.css";
import ChatAgent from "./components/Shared/ChatAgent";
import { useAccessibility } from "./contexts/AccessibilityContext";
import FontAdjuster from "./components/Accessibility/FontAdjuster";

function App() {
  const { 
    fontSize, 
    contrast, 
    textToSpeech, 
    darkMode,
    setContrast,
    setDarkMode,
    setTextToSpeech
  } = useAccessibility();
  const [currentPage, setCurrentPage] = useState("home");
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [keyboardLesson, setKeyboardLesson] = useState(null);
  const [buttonClicked, setButtonClicked] = useState("");

  const handleSpeak = (text) => {
    if (textToSpeech) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const pythonVisuals = {
    title: "Python Basics",
    content: `
      <div class="visual-content">
        <h3>Python Data Types</h3>
        <div class="diagram">
          <div class="box">Strings: "hello"</div>
          <div class="box">Numbers: 42, 3.14</div>
          <div class="box">Lists: [1, 2, 3]</div>
          <div class="box">Dictionaries: {"key": "value"}</div>
          <div class="box">Tuples: (1, 2, 3)</div>
          <div class="box">Sets: {1, 2, 3}</div>
        </div>
        <h3>Control Flow</h3>
        <div class="diagram">
          <div class="box">if/elif/else statements</div>
          <div class="box">for loops</div>
          <div class="box">while loops</div>
          <div class="box">try/except blocks</div>
        </div>
        <h3>Functions</h3>
        <div class="diagram">
          <div class="box">def function_name(parameters):</div>
          <div class="box">return statements</div>
          <div class="box">*args and **kwargs</div>
        </div>
      </div>
    `
  };

  const webDesignVisuals = {
    title: "Web Design Fundamentals",
    content: `
      <div class="visual-content">
        <h3>Color Theory</h3>
        <div class="diagram">
          <div class="box">Primary Colors</div>
          <div class="box">Secondary Colors</div>
          <div class="box">Color Harmony</div>
        </div>
        <h3>Layout Principles</h3>
        <div class="diagram">
          <div class="box">Grid Systems</div>
          <div class="box">Visual Hierarchy</div>
          <div class="box">White Space</div>
        </div>
        <h3>Typography</h3>
        <div class="diagram">
          <div class="box">Font Families</div>
          <div class="box">Font Pairing</div>
          <div class="box">Text Hierarchy</div>
        </div>
      </div>
    `
  };

  const dataStructuresVisuals = {
    title: "Data Structures",
    content: `
      <div class="visual-content">
        <h3>Arrays and Lists</h3>
        <div class="diagram">
          <div class="box">Static Arrays</div>
          <div class="box">Dynamic Arrays</div>
          <div class="box">Linked Lists</div>
        </div>
        <h3>Trees</h3>
        <div class="diagram">
          <div class="box">Binary Trees</div>
          <div class="box">BST</div>
          <div class="box">AVL Trees</div>
        </div>
        <h3>Graphs</h3>
        <div class="diagram">
          <div class="box">Directed Graphs</div>
          <div class="box">Undirected Graphs</div>
          <div class="box">Weighted Graphs</div>
        </div>
      </div>
    `
  };

  const audioContent = {
    english: { 
      title: "English Speaking", 
      text: "Welcome to English course. Let's practice some common phrases: 'Hello, how are you?', 'Nice to meet you', 'Could you please repeat that?', 'Thank you very much'."
    },
    business: { 
      title: "Business Communication", 
      text: "In business communication, clarity and professionalism are key. Here are some useful phrases: 'I appreciate your prompt response', 'I would like to follow up on', 'Thank you for your consideration'."
    },
    history: { 
      title: "History Podcast", 
      text: "The Renaissance was a period of cultural, artistic, and economic revival following the Middle Ages. Beginning in Italy in the 14th century, it spread throughout Europe."
    },
    programming: {
      title: "Programming Concepts",
      text: "Let's learn about programming concepts. Variables store data, functions perform specific tasks, and loops repeat actions. These are the building blocks of programming."
    },
    mindfulness: {
      title: "Mindfulness Meditation",
      text: "Welcome to mindfulness meditation. Take a deep breath in... and out. Focus on your breathing. Notice the present moment without judgment."
    },
    science: {
      title: "Science Concepts",
      text: "Today we'll explore basic scientific concepts. The scientific method involves observation, hypothesis formation, experimentation, and drawing conclusions."
    }
  };

  const playAudio = (audioKey) => {
    setPlayingAudio(audioKey);
    const audio = audioContent[audioKey];
    const utterance = new SpeechSynthesisUtterance(audio.text);
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  // mark playing audio by setting playingAudio
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
  setPlayingAudio(null);
  };

  const handleButtonClick = (buttonName) => {
    setButtonClicked(buttonName);
    handleSpeak("You clicked " + buttonName);
    setTimeout(() => setButtonClicked(""), 1000);
  };

  return (
    <div className={`App ${contrast} ${darkMode ? "dark-mode" : ""}`}>
      <div className="accessibility-toolbar">
        <h3>Accessibility Options</h3>
        <FontAdjuster />
        <div className="toolbar-group">
          <label>Contrast:</label>
          <select value={contrast} onChange={(e) => setContrast(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="inverted">Inverted</option>
          </select>
        </div>
        <div className="toolbar-group">
          <label>
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            Dark Mode
          </label>
        </div>
        <div className="toolbar-group">
          <label>
            <input type="checkbox" checked={textToSpeech} onChange={(e) => setTextToSpeech(e.target.checked)} />
            Text-to-Speech
          </label>
        </div>
      </div>

      <div className={`content ${fontSize}`}>
        {enrolledCourse ? (
          <div className="enrolled-view">
            <button className="back-btn" onClick={() => setEnrolledCourse(null)}>← Back</button>
            <h2>{enrolledCourse.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: enrolledCourse.content }}></div>
          </div>
        ) : playingAudio ? (
          <div className="audio-view">
            <button className="back-btn" onClick={() => stopAudio()}>← Back</button>
            <h2>{audioContent[playingAudio].title}</h2>
            <div className="audio-player">
              <div className="player-controls">
                <button className="control-btn play-main" onClick={() => playAudio(playingAudio)}>▶️ PLAY</button>
                <button className="control-btn stop-btn" onClick={() => stopAudio()}>⏹️ STOP</button>
              </div>
              <div className="audio-text">
                <p>{audioContent[playingAudio].text}</p>
              </div>
            </div>
          </div>
        ) : keyboardLesson ? (
          <div className="keyboard-lesson-view">
            <button className="back-btn" onClick={() => setKeyboardLesson(null)}>← Back</button>
            <h2>{keyboardLesson.title}</h2>
            <p className="lesson-desc">{keyboardLesson.description}</p>

            {keyboardLesson.id === "tab" && (
              <div className="lesson-content">
                <h3>How to Use Tab:</h3>
                <p><strong>Try it! Tab through these buttons:</strong></p>
                <div className="practice-buttons">
                  <button className="practice-btn" onClick={() => handleButtonClick("Button 1")}>Button 1</button>
                  <button className="practice-btn" onClick={() => handleButtonClick("Button 2")}>Button 2</button>
                  <button className="practice-btn" onClick={() => handleButtonClick("Button 3")}>Button 3</button>
                </div>
                {buttonClicked && <p className="feedback">✓ {buttonClicked} was activated!</p>}
              </div>
            )}

            {keyboardLesson.id === "enter" && (
              <div className="lesson-content">
                <h3>Enter Key Usage:</h3>
                <p><strong>Practice pressing Enter on focused buttons:</strong></p>
                <div className="practice-buttons">
                  <button className="practice-btn" onClick={() => handleButtonClick("Try Me 1")}>Try Me 1</button>
                  <button className="practice-btn" onClick={() => handleButtonClick("Try Me 2")}>Try Me 2</button>
                  <button className="practice-btn" onClick={() => handleButtonClick("Try Me 3")}>Try Me 3</button>
                </div>
                {buttonClicked && <p className="feedback">✓ {buttonClicked} was activated!</p>}
              </div>
            )}

            {keyboardLesson.id === "arrow" && (
              <div className="lesson-content">
                <h3>Arrow Keys:</h3>
                <p><strong>Try selecting from this dropdown:</strong></p>
                <select className="practice-select" onChange={(e) => handleSpeak("You selected " + e.target.value)}>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            )}

            {keyboardLesson.id === "space" && (
              <div className="lesson-content">
                <h3>Space Bar Usage:</h3>
                <p><strong>Try checking these boxes with Space:</strong></p>
                <div className="practice-checkboxes">
                  <label><input type="checkbox" onChange={() => handleSpeak("Checkbox 1")} /> Checkbox 1</label>
                  <label><input type="checkbox" onChange={() => handleSpeak("Checkbox 2")} /> Checkbox 2</label>
                  <label><input type="checkbox" onChange={() => handleSpeak("Checkbox 3")} /> Checkbox 3</label>
                </div>
              </div>
            )}
          </div>
        ) : currentPage === "home" ? (
          <>
            <h1>Educational Recommender</h1>
            <p className="subtitle">Personalized Learning for Everyone</p>
            <button className="cta-button" onClick={() => setCurrentPage("dashboard")}>Get Started</button>
          </>
        ) : currentPage === "dashboard" ? (
          <div className="dashboard-view">
            <button className="back-btn" onClick={() => setCurrentPage("home")}>← Home</button>
            <h2>Welcome to Learning Dashboard</h2>
            <p className="dashboard-subtitle">Choose your learning method:</p>
            
            <div className="dashboard-buttons">
              {/* VISUAL LEARNING */}
              <button className="dashboard-btn visual-btn" onClick={() => setCurrentPage("visual")}>
                <div className="btn-icon">👁️</div>
                <h3>Visual Learning</h3>
                <p>Learn through videos & diagrams</p>
              </button>

              {/* AUDIO SUPPORT */}
              <button className="dashboard-btn audio-btn" onClick={() => setCurrentPage("audio")}>
                <div className="btn-icon">🎤</div>
                <h3>Audio Support</h3>
                <p>Learn through audio lessons</p>
              </button>

              {/* KEYBOARD NAVIGATION */}
              <button className="dashboard-btn keyboard-btn" onClick={() => setCurrentPage("keyboard")}>
                <div className="btn-icon">⌨️</div>
                <h3>Keyboard Navigation</h3>
                <p>Navigate without mouse</p>
              </button>

              {/* HIGH CONTRAST */}
              <button className="dashboard-btn contrast-btn" onClick={() => setCurrentPage("contrast")}>
                <div className="btn-icon">🎨</div>
                <h3>High Contrast</h3>
                <p>Better visibility modes</p>
              </button>
            </div>
          </div>
        ) : currentPage === "visual" ? (
          <div className="page-view">
            <button className="back-btn" onClick={() => setCurrentPage("dashboard")}>← Back</button>
            <h2>👁️ Visual Learning</h2>
            <div className="mini-courses">
              <div className="mini-course">
                <h4>🐍 Python Basics</h4>
                <p>Learn Python with visual diagrams</p>
                <button className="mini-btn" onClick={() => setEnrolledCourse(pythonVisuals)}>Start Course</button>
              </div>
              <div className="mini-course">
                <h4>🎨 Web Design</h4>
                <p>Colors & design principles</p>
                <button className="mini-btn" onClick={() => setEnrolledCourse(webDesignVisuals)}>Start Course</button>
              </div>
              <div className="mini-course">
                <h4>📊 Data Structures</h4>
                <p>Learn fundamental data structures</p>
                <button className="mini-btn" onClick={() => setEnrolledCourse(dataStructuresVisuals)}>Start Course</button>
              </div>
            </div>
          </div>
        ) : currentPage === "audio" ? (
          <div className="page-view">
            <button className="back-btn" onClick={() => setCurrentPage("dashboard")}>← Back</button>
            <h2>🎤 Audio Support</h2>
            <div className="mini-courses">
              <div className="mini-course">
                <h4>🗣️ English Speaking</h4>
                <p>Learn English greetings</p>
                <button className="mini-btn" onClick={() => playAudio("english")}>Play Lesson</button>
              </div>
              <div className="mini-course">
                <h4>💼 Business Communication</h4>
                <p>Professional communication</p>
                <button className="mini-btn" onClick={() => playAudio("business")}>Play Lesson</button>
              </div>
              <div className="mini-course">
                <h4>💻 Programming Concepts</h4>
                <p>Learn programming basics</p>
                <button className="mini-btn" onClick={() => playAudio("programming")}>Play Lesson</button>
              </div>
              <div className="mini-course">
                <h4>🧘 Mindfulness Meditation</h4>
                <p>Guided meditation</p>
                <button className="mini-btn" onClick={() => playAudio("mindfulness")}>Play Lesson</button>
              </div>
              <div className="mini-course">
                <h4>🔬 Science Concepts</h4>
                <p>Basic scientific principles</p>
                <button className="mini-btn" onClick={() => playAudio("science")}>Play Lesson</button>
              </div>
            </div>
          </div>
        ) : currentPage === "keyboard" ? (
          <div className="page-view">
            <button className="back-btn" onClick={() => setCurrentPage("dashboard")}>← Back</button>
            <h2>⌨️ Keyboard Navigation</h2>
            <div className="mini-courses">
              <div className="mini-course">
                <h4>Tab Key</h4>
                <p>Navigate through elements</p>
                <button className="mini-btn" onClick={() => setKeyboardLesson({id: "tab", title: "Tab Key Navigation", description: "Use Tab to move through elements"})}>Learn</button>
              </div>
              <div className="mini-course">
                <h4>Enter Key</h4>
                <p>Activate buttons & select</p>
                <button className="mini-btn" onClick={() => setKeyboardLesson({id: "enter", title: "Enter Key", description: "Press Enter to activate"})}>Learn</button>
              </div>
            </div>
          </div>
        ) : currentPage === "contrast" ? (
          <div className="page-view">
            <button className="back-btn" onClick={() => setCurrentPage("dashboard")}>← Back</button>
            <h2>🎨 High Contrast & Visibility</h2>
            <div className="mini-courses">
              <div className="mini-course">
                <h4>High Contrast Mode</h4>
                <p>Enable high contrast colors</p>
                <button className="mini-btn" onClick={() => { setContrast("high"); handleSpeak("High contrast enabled"); }}>Enable</button>
              </div>
              <div className="mini-course">
                <h4>Dark Mode</h4>
                <p>Reduce eye strain</p>
                <button className="mini-btn" onClick={() => { setDarkMode(!darkMode); handleSpeak("Dark mode toggled"); }}>Toggle</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <ChatAgent />
    </div>
  );
}

export default App;
