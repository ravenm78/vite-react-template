import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const heroSlides = [
  {
    id: "01",
    image: "/Scruz_Website_Hero_0001.png",
    title: "Cinematic by Design",
    caption:
      "Visual systems, campaign worlds, AI workflows, motion-ready assets, and brand direction built with teeth.",
    label: "Cinematic by design",
  },
  {
    id: "02",
    image: "/Scruz_Website_Hero_0002.png",
    title: "Campaign Worlds",
    caption:
      "High-impact visual direction for nightlife, product stories, launch moments, and scroll-stopping brand energy.",
    label: "Campaign worlds",
  },
  {
    id: "03",
    image: "/Scruz_Website_Hero_0003.png",
    title: "AI-Assisted Workflow",
    caption:
      "Creative systems using local tools, automation, rapid concepting, image direction, and experimental production pipelines.",
    label: "AI-assisted workflow",
  },
  {
    id: "04",
    image: "/Scruz_Website_Hero_0004.png",
    title: "Motion-Ready Assets",
    caption:
      "Design built with depth, atmosphere, edit rhythm, and animation potential from the first frame.",
    label: "Motion-ready assets",
  },
];

const workItems = [
  {
    eyebrow: "Brand System / DTC",
    imageLabel: "Brand System",
    title: "Naked All Natural",
    copy:
      "Brand direction, product identity, packaging logic, campaign concepts, and audience positioning.",
  },
  {
    eyebrow: "Nightlife / Campaigns",
    imageLabel: "Campaign Worlds",
    title: "Club Visual Systems",
    copy:
      "Flyers, social graphics, retouching, photo direction, and event visuals built to stop the scroll.",
  },
  {
    eyebrow: "AI / Automation",
    imageLabel: "AI Workflow",
    title: "Xen Creative Pipeline",
    copy:
      "AI-assisted creative workflows using local tools, Python, LLM routing, and experimental production systems.",
  },
];

function App() {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHero = heroSlides[activeHeroIndex];

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
            <span>Look Sharp.</span>
            <span className="heroTitleSmaller">Deliver Results.</span>
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
          <div
            className="heroImage"
            style={{
              "--hero-image": `url("${activeHero.image}")`,
            }}
          >
            <div className="heroFrameLine heroFrameLineTop"></div>
            <div className="heroFrameLine heroFrameLineBottom"></div>
            <div className="heroCorner heroCornerTopLeft"></div>
            <div className="heroCorner heroCornerTopRight"></div>
            <div className="heroCorner heroCornerBottomLeft"></div>
            <div className="heroCorner heroCornerBottomRight"></div>

            <div className="heroSelectors" aria-label="Featured visual selectors">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={`selector selector${slide.id} ${
                    activeHeroIndex === index ? "isActive" : ""
                  }`}
                  type="button"
                  aria-label={`${slide.label} selector`}
                  aria-pressed={activeHeroIndex === index}
                  onClick={() => setActiveHeroIndex(index)}
                  style={{
                    "--selector-image": `url("${slide.image}")`,
                  }}
                >
                  <span className="selectorDot"></span>
                  <span className="selectorNumber">{slide.id}</span>
                </button>
              ))}
            </div>

            <div className="heroImageLabel">
              <span className="heroIndex">{activeHero.id}</span>
              <div>
                <h2>{activeHero.title}</h2>
                <p>{activeHero.caption}</p>
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

        <div className="projectGrid">
          {workItems.map((item) => (
            <article className="projectItem" key={item.title}>
              <div className="projectImage">
                <span>{item.imageLabel}</span>
              </div>

              <div className="projectCard">
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
