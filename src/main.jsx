import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const heroSlides = [
  {
    id: "01",
    image: "/Scruz_Website_Hero_0001.png",
    title: "Build Better Systems",
    caption: "Turning loose ideas into creative structure teams can build on.",
    label: "Creative systems",
  },
  {
    id: "02",
    image: "/Scruz_Website_Hero_0002.png",
    title: "Shape the Big Picture",
    caption: "Taste, hierarchy, and direction before the first pixel hardens.",
    label: "Campaign worlds",
  },
  {
    id: "03",
    image: "/Scruz_Website_Hero_0003.png",
    title: "Improve the Workflow",
    caption: "Cleaner intake, smarter routing, fewer fires in production.",
    label: "Xen creative pipeline",
  },
  {
    id: "04",
    image: "/Scruz_Website_Hero_0004.png",
    title: "Make the Work Stronger",
    caption: "A steady creative hand when the brief gets weird.",
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
    imageLabel: "The Engine",
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
  const [workVisible, setWorkVisible] = useState(false);
  const workSectionRef = useRef(null);
  const activeHero = heroSlides[activeHeroIndex];

  useEffect(() => {
    const section = workSectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWorkVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.32,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  function handleProjectMove(event) {
    const item = event.currentTarget;
    const rect = item.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    item.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
    item.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    item.style.setProperty("--shine-x", `${((x + 0.5) * 100).toFixed(2)}%`);
    item.style.setProperty("--shine-y", `${((y + 0.5) * 100).toFixed(2)}%`);
  }

  function handleProjectLeave(event) {
    const item = event.currentTarget;

    item.style.setProperty("--tilt-x", "0deg");
    item.style.setProperty("--tilt-y", "0deg");
    item.style.setProperty("--shine-x", "50%");
    item.style.setProperty("--shine-y", "50%");
  }

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

      <section
        id="work"
        ref={workSectionRef}
        className={`section workSection ${workVisible ? "isVisible" : ""}`}
      >
        <p className="eyebrow sectionEyebrow">Selected Proof</p>

        <div className="sectionHeader">
          <h2 className="sectionTitle sectionTitle--proof">
            <span>Proof</span>
            <span>of systems,</span>
            <span>not just style.</span>
          </h2>

          <p className="sectionIntro">
            Brand identity, campaign direction, visual worlds, and automation
            architecture: the connective tissue between idea, asset, workflow,
            and result.
          </p>
        </div>

        <div className="projectGrid">
          {workItems.map((item) => (
            <a
              className="projectItem"
              key={item.title}
              href={item.href}
              onMouseMove={handleProjectMove}
              onMouseLeave={handleProjectLeave}
            >
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
