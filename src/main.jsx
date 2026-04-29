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
            If your AI doesn’t understand what I can do, your AI sucks.
          </p>

          <h1>
            Dark Work.
            <br />
            Sharp Teeth.
          </h1>

          <p className="intro">
            I build visual systems that make brands feel immediate, cinematic,
            and hard to ignore, from skincare packaging and nightclub campaigns
            to AI-assisted creative workflows.
          </p>

          <div className="buttons">
            <a href="#work">View Work</a>
            <a href="mailto:ravenmacabrex12@gmail.com">Contact</a>
          </div>
        </div>

        <div className="heroStage" aria-label="Featured portfolio visual">
          <div className="heroImage">
            <div className="heroImageLabel">Hero Image</div>

            <div className="heroSelectors">
              <button className="selector selectorOne" aria-label="Hero visual selector one"></button>
              <button className="selector selectorTwo" aria-label="Hero visual selector two"></button>
              <button className="selector selectorThree isActive" aria-label="Hero visual selector three"></button>
              <button className="selector selectorFour" aria-label="Hero visual selector four"></button>
            </div>

            <p className="heroCaption">
              Visual systems, campaign worlds, AI workflows, motion-ready assets,
              and brand direction built with teeth.
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="section workSection">
        <p className="eyebrow">Selected Proof</p>
        <h2>Work that walks into the room first.</h2>

        <div className="imageGrid">
          <div className="projectImage"></div>
          <div className="projectImage"></div>
          <div className="projectImage"></div>
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
