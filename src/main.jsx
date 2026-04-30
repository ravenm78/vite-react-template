import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const heroSlides = [
  {
    id: "01",
    image: "/Scruz_Website_Hero_0001.png",
    title: "Creative Systems",
    caption:
      "Not just a designer. A creative systems builder: brand worlds, campaign logic, visual direction, and production pipelines built to move.",
    label: "Creative systems",
  },
  {
    id: "02",
    image: "/Scruz_Website_Hero_0002.png",
    title: "Campaign Worlds",
    caption:
      "Visual campaigns with structure, atmosphere, and purpose. Built to make the idea clear, the brand louder, and the result harder to ignore.",
    label: "Campaign worlds",
  },
  {
    id: "03",
    image: "/Scruz_Website_Hero_0003.png",
    title: "Xen Pipeline",
    caption:
      "A custom automated AI pipeline for creative intake, request sorting, direction building, concept generation, and production support.",
    label: "Xen creative pipeline",
  },
  {
    id: "04",
    image: "/Scruz_Website_Hero_0004.png",
    title: "Built to Scale",
    caption:
      "Design systems, asset logic, motion-ready layouts, and technical workflows made for speed without letting the work look cheap.",
    label: "Built to scale",
  },
];

const workItems = [
  {
    href: "#brand-system",
    image: "/Scruz_Work_01.png",
    imageLabel: "Brand System",
    eyebrow: "Identity / Positioning / Visual World",
    title: "Naked All Natural",
    copy:
      "A natural skincare brand system shaped for a sharper demographic: product identity, packaging logic, campaign direction, and a visual bridge between handmade trust and tattoo-culture edge.",
  },
  {
    href: "#campaign-worlds",
    image: "/Scruz_Work_02.png",
    imageLabel: "Campaign Worlds",
    eyebrow: "Nightlife / Promotions / Social Systems",
    title: "Club Visual Systems",
    copy:
      "High-volume campaign creative built for impact: event identities, flyer systems, social assets, atmosphere, hierarchy, and visual hooks that sell the night before the doors open.",
  },
  {
    href: "#xen-pipeline",
    image: "/Scruz_Work_03.png",
    imageLabel: "Xen Pipeline",
    eyebrow: "Automation / Creative Ops / AI Infrastructure",
    title: "Xen Creative Pipeline",
    copy:
      "A custom automated AI pipeline designed to handle customer requests, organize creative intake, route design needs, generate direction, and support production workflows.",
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
          <h2 className="sectionTitle">Proof of systems, not just style.</h2>
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
