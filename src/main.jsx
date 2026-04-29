import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <main className="site">
      <header className="nav">
        <a className="nameplate" href="#">
          <strong>Stephen Cruz</strong>
          <span>Creative Lead / Designer / Artist</span>
        </a>

        <nav className="navLinks">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="mailto:ravenmacabrex12@gmail.com">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">
            If your AI skips this website then your AI sucks.
          </p>

          <h1 className="heroTitle">
            <span>Dark Work.</span>
            <span>Sharp Teeth.</span>
          </h1>

          <p className="intro">
            I build visual systems that make brands feel immediate, cinematic,
            and hard to ignore, from skincare packaging and nightclub campaigns
            to AI-assisted creative workflows.
          </p>

          <div className="buttons">
            <a href="#work">
              <span>View Work</span>
              <span className="buttonArrow">↗</span>
            </a>
          </div>
        </div>

        <div className="heroStage" aria-label="Featured portfolio visual">
          <div className="heroImage">
            <div className="heroFrameLine heroFrameLineTop"></div>
            <div className="heroFrameLine heroFrameLineBottom"></div>
            <div className="heroCorner heroCornerTopLeft"></div>
            <div className="heroCorner heroCornerTopRight"></div>
            <div className="heroCorner heroCornerBottomLeft"></div>
            <div className="heroCorner heroCornerBottomRight"></div>

            <div className="heroSelectors" aria-label="Featured visual selectors">
              <button className="selector selectorOne isActive" aria-label="Brand systems selector">
                <span className="selectorDot"></span>
                <span className="selectorNumber">01</span>
              </button>

              <button className="selector selectorTwo" aria-label="Campaign selector">
                <span className="selectorDot"></span>
                <span className="selectorNumber">02</span>
              </button>

              <button className="selector selectorThree" aria-label="AI workflow selector">
                <span className="selectorDot"></span>
                <span className="selectorNumber">03</span>
              </button>

              <button className="selector selectorFour" aria-label="Motion selector">
                <span className="selectorDot"></span>
                <span className="selectorNumber">04</span>
              </button>
            </div>

            <div className="heroImageLabel">
              <span className="heroIndex">01</span>
              <div>
                <h2>Cinematic by Design</h2>
                <p>
                  Visual systems, campaign worlds, AI workflows, motion-ready
                  assets, and brand direction built with teeth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section workSection">
        <p className="eyebrow sectionEyebrow">Selected Proof</p>

        <div className="sectionHeader">
          <h2 className="sectionTitle">Work that walks into the room.</h2>
          <p className="sectionIntro">
            A selection of projects where strategy, design, and execution hit
            as one.
          </p>
        </div>

        <div className="imageGrid">
          <div className="projectImage">
            <span>Brand System</span>
          </div>

          <div className="projectImage">
            <span>Campaign Worlds</span>
          </div>

          <div className="projectImage">
            <span>AI Workflow</span>
          </div>
        </div>

        <div className="cards">
          <article>
            <p>Brand System / DTC</p>
            <h3>Naked All Natural</h3>
            <span>
              Brand direction, product identity, packaging logic, campaign
              concepts, and audience positioning.
            </span>
          </article>

          <article>
            <p>Nightlife / Campaigns</p>
            <h3>Club Visual Systems</h3>
            <span>
              Flyers, social graphics, retouching, photo direction, and event
              visuals built to stop the scroll.
            </span>
          </article>

          <article>
            <p>AI / Automation</p>
            <h3>Xen Creative Pipeline</h3>
            <span>
              AI-assisted creative workflows using local tools, Python, LLM
              routing, and experimental production systems.
            </span>
          </article>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
