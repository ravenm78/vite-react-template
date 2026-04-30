import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const heroSlides = [
  {
    id: "01",
    image: "/Scruz_Website_Hero_0001.png",
    title: "Build Better Systems",
    caption:
      "I help turn loose creative needs into clear direction, usable frameworks, and finished work that teams can actually build on.",
    label: "Creative systems",
  },
  {
    id: "02",
    image: "/Scruz_Website_Hero_0002.png",
    title: "Shape the Big Picture",
    caption:
      "Strong creative needs more than a good-looking asset. I bring mood, hierarchy, timing, voice, and visual judgment together so the work feels intentional from the first look.",
    label: "Campaign worlds",
  },
  {
    id: "03",
    image: "/Scruz_Website_Hero_0003.png",
    title: "Improve the Workflow",
    caption:
      "I look for the friction hiding inside the process: intake, concepting, routing, revisions, production, and handoff. Then I help make the machine faster, clearer, and easier for the team to use.",
    label: "Xen creative pipeline",
  },
  {
    id: "04",
    image: "/Scruz_Website_Hero_0004.png",
    title: "Make the Work Stronger",
    caption:
      "Rough brief, tight timeline, scattered feedback, high expectations: I help bring structure, taste, execution, and momentum to the table.",
    label: "Built to scale",
  },
];

const workItems = [
  {
    href: "#work",
    image: "/Scruz_Work_01.png",
    imageLabel: "Creative Direction",
    eyebrow: "Identity / Positioning / Development",
    title: "Built From Concept to System",
    copy:
      "Creative direction for brands, campaigns, and visual ecosystems that need more than decoration. I build the positioning, art direction, design language, asset logic, and production structure that turn scattered ideas into sharp, scalable creative.",
  },
  {
    href: "#about",
    image: "/Scruz_Work_02.png",
    imageLabel: "Creative Engine",
    eyebrow: "Process / Range / Creative Intelligence",
    title: "The Mind Behind the Machine",
    copy:
      "There’s a person behind the polish. I’ve spent years turning rough ideas, weird requests, tight deadlines, and half-formed sparks into finished work that feels intentional.",
  },
  {
    href: "#xen-pipeline",
    image: "/Scruz_Work_03.png",
    imageLabel: "Xen Pipeline",
    eyebrow: "Automation / Creative Ops / AI Infrastructure",
    title: "Custom Creative Operations Pipeline",
    copy:
      "Xen is a custom automated AI creative pipeline built for intake, request sorting, task routing, concept development, creative direction, and production support. It connects design thinking with operational intelligence so creative work moves faster without getting dumber.",
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
          <span>Creative Lead / Systems Builder / Artist</span>
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
            Not just a designer. A creative systems builder.
          </p>

          <h1 className="heroTitle">
            <span>Look Sharp.</span>
            <span className="heroTitleSmaller">Deliver Results.</span>
          </h1>

          <p className="intro">
            I turn scattered creative requests into brand systems, campaign
            worlds, and automated production pipelines. Big-picture vision,
            hands-on execution, and enough technical range to build the machine
            instead of waiting for one.
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
          <h2 className="sectionTitle sectionTitle--proof">
            Proof of systems, not just style.
          </h2>

          <p className="sectionIntro">
            Brand identity, campaign direction, visual worlds, and automation
            architecture: the connective tissue between idea, asset, workflow,
            and result.
          </p>
        </div>

        <div className="projectGrid">
          {workItems.map((item) => (
            <a className="projectItem" key={item.title} href={item.href}>
              <div
                className="projectImage"
                style={{
                  "--project-image": `url("${item.image}")`,
                }}
              >
                <div className="projectImageOverlay"></div>
                <span className="projectImageLabel">{item.imageLabel}</span>
              </div>

              <div className="projectCard">
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
