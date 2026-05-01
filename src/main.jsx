import React, { useEffect, useState } from "react";
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
    title: "Turn Ideas Into Assets",
    caption: "A steady creative hand when the brief gets weird.",
    label: "Built to scale",
  },
];

const workItems = [
  {
    href: "/work",
    image: "/Scruz_Work_01.png",
    imageLabel: "Creative Direction",
    eyebrow: "Work / Campaigns / Visual Systems",
    title: "See the Work",
    copy:
      "A focused look at campaign direction, brand systems, visual worlds, production design, and finished creative built to move from idea to execution.",
  },
  {
    href: "/about",
    image: "/Scruz_Work_02.png",
    imageLabel: "The Engine",
    eyebrow: "About / Process / Creative Range",
    title: "Meet the Mind Behind It",
    copy:
      "The person behind the polish: creative lead, designer, artist, systems builder, and hands-on problem solver who can shape the concept and build the machine around it.",
  },
  {
    href: "/skills",
    image: "/Scruz_Work_03.png",
    imageLabel: "Abilities",
    eyebrow: "Skills / Tools / Technical Range",
    title: "See the Abilities",
    copy:
      "A practical breakdown of the creative, technical, production, automation, design, photo, video, and systems skills that let the work go deeper than surface-level design.",
  },
];

const aboutStats = [
  {
    value: "20+",
    label:
      "Years of real creative production across web, branding, campaigns, photography, motion, print, and the thousand odd formats modern teams somehow need by Friday.",
  },
  {
    value: "AI",
    label:
      "I do not treat AI like a novelty button. I use it as an extension of how I think: faster concepting, sharper options, cleaner workflows, and more room for human taste.",
  },
  {
    value: "Xen",
    label:
      "I built my own creative automation assistant because when the workflow gets messy, I would rather build a better machine than complain about the old one.",
  },
];

const aboutPrinciples = [
  {
    eyebrow: "01 / Direction",
    title: "I find the signal.",
    copy:
      "Before anything gets polished, the point has to get clear. I look for the message, the audience, the visual pressure, and the thing that makes someone stop scrolling long enough to care.",
  },
  {
    eyebrow: "02 / Making",
    title: "I can build what I direct.",
    copy:
      "I am not allergic to the actual work. I can shape the concept, design the asset, edit the footage, retouch the image, build the page, prep the print file, and still talk strategy without floating away into scarf weather.",
  },
  {
    eyebrow: "03 / Systems",
    title: "I make the next round easier.",
    copy:
      "Good creative should not fall apart every time the deadline moves or the request mutates. I like building cleaner workflows, smarter repeatable systems, and production habits that help teams move faster without making everything feel machine-made.",
  },
];

function useRevealTitles() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".revealTitle"));

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("isVisible", entry.isIntersecting);
        });
      },
      { threshold: 0.34, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

function SiteHeader() {
  return (
    <header className="nav">
      <a className="nameplate" href="/">
        <strong>Stephen Cruz</strong>
        <span>Creative Lead / Systems Builder / Artist</span>
      </a>

      <nav className="navLinks">
        <a href="/work">Work</a>
        <a href="/about">About</a>
        <a href="/skills">Skills</a>
        <a href="mailto:ravenmacabrex12@gmail.com">Contact</a>
      </nav>
    </header>
  );
}

function HomePage() {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHero = heroSlides[activeHeroIndex];

  return (
    <>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">
            Not just a designer. A creative systems builder.
          </p>

          <h1 className="heroTitle heroTitle--reveal revealTitle">
            <span>Look Sharp</span>
            <span className="heroTitleSmaller">Deliver Results</span>
          </h1>

          <p className="intro">
            I turn scattered creative requests into brand systems, campaign
            worlds, and automated production pipelines. Big-picture vision,
            hands-on execution, and enough technical range to build the machine
            instead of waiting for one.
          </p>

          <div className="buttons">
            <a href="#work">
              <span>View Proof</span>
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
        <p className="eyebrow sectionEyebrow">Choose Your Entry Point</p>

        <div className="sectionHeader">
          <h2 className="sectionTitle sectionTitle--proof revealTitle">
            <span>Proof of</span>
            <span>life, not</span>
            <span>just style.</span>
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

      <section id="xen" className="section xenSection">
        <div className="xenHeader">
          <p className="eyebrow xenEyebrow">Custom Creative Ops System</p>

          <h2 className="xenTitle xenTitle--reveal revealTitle">
            <span>Xen</span>
            <strong>Agentic AI for Workflow Automation</strong>
          </h2>

          <p className="xenIntro">
            Xen is a custom AI-assisted creative operations system built to help
            sort requests, shape concepts, route tasks, organize production, and
            turn scattered creative chaos into a cleaner working pipeline.
          </p>
        </div>

        <div className="xenVisual" aria-label="Xen workflow automation visual">
          <img
            src="/Scruz_Xen_Section.png"
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>

        <p className="xenOutro">
          Part creative assistant, part production brain, part workflow skeleton.
          Xen connects ideas, assets, notes, systems, and automation into one
          evolving creative engine.
        </p>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="section aboutHeroSection">
        <div className="aboutHeroGrid">
          <div className="aboutHeroCopy">
            <p className="eyebrow">About / The Engine</p>

            <h1 className="aboutTitle revealTitle">
              <span>Not a Designer.</span>
              <span>A Creative Engine.</span>
            </h1>

            <p className="aboutLead">
              I’m Stephen Cruz. I build sharp visual work, smarter creative
              systems, and the kind of production momentum that keeps good ideas
              from dying in a folder named final_final_v7.
            </p>

            <p className="aboutBody">
              I’m a creative lead, designer, artist, photographer, editor, and
              systems builder with 20+ years of experience across web, branding,
              campaign creative, production, photo, video, motion, print, and
              AI-assisted workflow. I started in the early web, moved through
              agencies, freelance, Davis Advertising, and nearly six years as
              Creative Lead at Xtreme Marketing. My value is range: I can shape
              the idea, make the asset, polish the final, and build smarter
              systems so the next round moves faster.
            </p>

            <div className="buttons aboutButtons">
              <a href="/work">
                <span>See the Work</span>
                <span className="buttonArrow">↗</span>
              </a>
              <a href="/skills">
                <span>View Skills</span>
                <span className="buttonArrow">↗</span>
              </a>
            </div>
          </div>

          <div className="aboutPortraitCard" aria-label="Portrait of Stephen Cruz">
            <div className="aboutPortraitImage"></div>
            <div className="aboutPortraitPanel">
              <h2>More than a designer with a good eye.</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section aboutStatsSection" aria-label="About highlights">
        <div className="aboutStatsGrid">
          {aboutStats.map((stat) => (
            <div className="aboutStat" key={stat.value}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section aboutPrinciplesSection">
        <div className="aboutSectionHeader">
          <p className="eyebrow sectionEyebrow">How I Work</p>
          <h2 className="sectionTitle sectionTitle--about revealTitle">
            <span>Art brain.</span>
            <span>Systems spine.</span>
          </h2>
        </div>

        <div className="aboutPrinciplesGrid">
          {aboutPrinciples.map((item) => (
            <article className="aboutPrinciple" key={item.title}>
              <p>{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <span>{item.copy}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PlaceholderPage({ title, copy }) {
  return (
    <section className="section placeholderPage">
      <p className="eyebrow">Coming Next</p>
      <h1 className="aboutTitle revealTitle">
        <span>{title}</span>
      </h1>
      <p className="aboutLead">{copy}</p>
      <div className="buttons aboutButtons">
        <a href="/">
          <span>Back Home</span>
          <span className="buttonArrow">↗</span>
        </a>
      </div>
    </section>
  );
}

function App() {
  useRevealTitles();

  const path = window.location.pathname;

  let page = <HomePage />;

  if (path === "/about") {
    page = <AboutPage />;
  } else if (path === "/work") {
    page = (
      <PlaceholderPage
        title="Work"
        copy="The dedicated work page is next. For now, the homepage proof cards still show the core entry points."
      />
    );
  } else if (path === "/skills") {
    page = (
      <PlaceholderPage
        title="Skills"
        copy="The dedicated skills page is next. This will become the practical breakdown of tools, production range, and technical systems."
      />
    );
  }

  return (
    <>
      <div className="site-bg" aria-hidden="true" />

      <main className="site">
        <SiteHeader />
        {page}
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
