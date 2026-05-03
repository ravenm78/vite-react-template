import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import SkillsCubeScene from "./SkillsCubeScene.jsx";

const heroSlides = [
  {
    id: "01",
    image: "/Scruz_Website_Hero_0001.png",
    title: "Build Better Systems",
    caption: "Creative should not collapse every time the deadline moves.",
    label: "Creative systems",
  },
  {
    id: "02",
    image: "/Scruz_Website_Hero_0002.png",
    title: "Shape the Signal",
    caption: "Direction, hierarchy, and taste before the pixels start breeding.",
    label: "Campaign worlds",
  },
  {
    id: "03",
    image: "/Scruz_Website_Hero_0003.png",
    title: "Make the Workflow Smarter",
    caption: "Custom AI systems, cleaner production logic, and fewer fires wearing fake mustaches.",
    label: "Xen creative pipeline",
  },
  {
    id: "04",
    image: "/Scruz_Website_Hero_0004.png",
    title: "Turn Ideas Into Assets",
    caption: "Concept, design, production, polish, and delivery under one roof.",
    label: "Built to scale",
  },
];

const workItems = [
  {
    href: "/work",
    image: "/Scruz_Work_01.png",
    imageLabel: "Creative Direction",
    eyebrow: "Work / Campaigns / Brand Systems",
    title: "Follow the Work",
    copy:
      "Case studies, campaign direction, visual systems, product storytelling, and finished creative built to survive the jump from concept to production.",
  },
  {
    href: "/about",
    image: "/Scruz_Work_02.png",
    imageLabel: "Creative Range",
    eyebrow: "About / Experience / Point of View",
    title: "Meet the Creative",
    copy:
      "A creative lead with 20+ years across web, branding, photo, video, motion, production, and the strange little battlefield where ideas become real assets.",
  },
  {
    href: "/skills",
    image: "/Scruz_Work_03.png",
    imageLabel: "Abilities",
    eyebrow: "Skills / Tools / Systems",
    title: "Explore the Range",
    copy:
      "Design, direction, front-end thinking, content, production, AI workflows, automation, and enough technical curiosity to keep building new muscles.",
  },
];

const aboutStats = [
  {
    value: "20+",
    image: "/Scruz_About_20Years.png",
    label:
      "Years of creative range across web, branding, campaign work, digital content, video, motion, and the messy reality of getting good work finished.",
  },
  {
    value: "AI",
    image: "/Scruz_About_AI.png",
    label:
      "Practical AI use for speeding up concepting, organizing ideas, testing directions, and building smarter creative workflows without letting the tools flatten the taste.",
  },
  {
    value: "Xen",
    image: "/Scruz_About_Xen.png",
    label:
      "My own custom workflow system, built to help sort requests, develop concepts, organize production, and make the creative process less scattered.",
  },
];

const aboutPrinciples = [
  {
    eyebrow: "01 / Direction",
    title: "I turn the fog into a plan.",
    image: "/Scruz_About_Direction.png",
    copy:
      "A messy ask, a half-formed idea, and four usable sentences: that is where I’m useful. I find the real message, shape the hierarchy, and turn loose creative noise into something clear enough to actually move on.",
  },
  {
    eyebrow: "02 / Creation",
    title: "I build polished work that holds together.",
    image: "/Scruz_About_Creation.png",
    copy:
      "I move from concept to execution with a strong eye for layout, hierarchy, pacing, tone, and detail. Whether it is a website, campaign direction, digital asset, motion piece, presentation, or brand system, I care about making the final work feel intentional, sharp, and finished.",
  },
  {
    eyebrow: "03 / Systems",
    title: "I make the next round easier.",
    image: "/Scruz_About_Systems.png",
    copy:
      "Good creative should not fall apart the second it needs version two. I think in reusable patterns, smarter handoffs, cleaner workflows, practical AI support, and systems that help the work move faster without sanding all the personality off it.",
  },
];


const workHighlights = [
  {
    eyebrow: "01 / Brand Positioning",
    title: "Skincare for real skin.",
    image: "/Scruz_Work_Naked_Product_Identity.png",
    copy:
      "The positioning moved Naked away from generic wellness language and toward something more specific: skincare for bodies that have been marked, healed, worked on, lived in, and cared for. Clean, but not sterile. Natural, but not forgettable.",
    variant: "identity",
  },
  {
    eyebrow: "02 / Product Architecture",
    title: "A product line with rhythm.",
    image: "/Scruz_Work_Naked_Campaign_Voice.png",
    copy:
      "The line needed to feel organized without becoming mechanical. Each product had to support the larger brand world: daily care, aftercare, soothing, cleansing, recovery, and routine, all connected through a visual and verbal system that made the collection easier to understand.",
    variant: "voice",
  },
  {
    eyebrow: "03 / Voice + Audience",
    title: "A cleaner voice with sharper teeth.",
    image: "/Scruz_Work_Naked_Audience.png",
    copy:
      "The voice had to be useful, direct, and occasionally funny without falling into gimmick territory. Naked could talk about skin concerns and ingredients, but it also needed to sound like a brand with actual humans behind it.",
    variant: "audience",
  },
];

const workDeliverables = [
  "Creative direction",
  "Brand positioning",
  "Product line storytelling",
  "E-commerce content structure",
  "Skin concern navigation",
  "Campaign concepts",
  "Audience strategy",
  "Digital content direction",
  "Wholesale/studio messaging",
  "Brand ecosystem development",
  "AI-assisted workflow support",
  "Presentation and web assets",
];

const sisterBrands = [
  {
    name: "Naked All Natural",
    image: "/Scruz_Work_Naked_Brand.png",
    copy:
      "The central brand: natural alternative skincare shaped around clean ingredients, body-art culture, daily use, and aftercare trust. The work gave Naked a stronger visual identity, clearer product storytelling, and a tone that feels more alive than the average wellness shelf.",
    variant: "naked",
    url: "https://nakedallnatural.com/",
  },
  {
    name: "Industrial Strength Needles",
    image: "/Scruz_Work_Industrial_Strength.png",
    copy:
      "Industrial Strength connects the ecosystem to professional piercing culture. That context matters. It gives Naked a credible bridge into studios, artists, piercers, and the aftercare conversations that happen after the appointment.",
    variant: "needles",
    url: "https://industrialstrengthneedles.com/",
  },
  {
    name: "HON / House of Nipple",
    image: "/Scruz_Work_HON.png",
    copy:
      "HON brings purpose into the system. Its focus on breast cancer survivors, 3D nipple and areola tattooing, healing, and body confidence adds a deeper emotional layer to the brand world surrounding Naked.",
    variant: "hon",
    url: "https://houseofnipple.org/",
  },
];




const skillCubes = [
  {
    name: "Creative Direction",
    short: "Direction",
    color: "#ff3f5f",
    glow: "rgba(255, 63, 95, 0.58)",
    icon: "✦",
    size: "large",
    left: "20%",
    top: "32%",
    z: "150px",
    driftX: "7px",
    driftY: "-9px",
    delay: "0.02s",
    copy:
      "Concepts, visual direction, hierarchy, tone, and the big-picture decisions that keep the work from wandering into traffic.",
    tools: ["Adobe Creative Cloud", "Figma", "Miro", "ChatGPT", "Notion"],
  },
  {
    name: "Brand Strategy",
    short: "Brand",
    color: "#ff8a2a",
    glow: "rgba(255, 138, 42, 0.54)",
    icon: "◆",
    size: "medium",
    left: "48%",
    top: "18%",
    z: "86px",
    driftX: "-8px",
    driftY: "7px",
    delay: "0.08s",
    copy:
      "Positioning, identity systems, campaign voice, audience fit, and the connective tissue that makes a brand feel intentional.",
    tools: ["Adobe Illustrator", "Photoshop", "Figma", "ChatGPT", "Behance"],
  },
  {
    name: "Graphic Design",
    short: "Design",
    color: "#ffc247",
    glow: "rgba(255, 194, 71, 0.48)",
    icon: "▰",
    size: "small",
    left: "29%",
    top: "60%",
    z: "-60px",
    driftX: "6px",
    driftY: "8px",
    delay: "0.14s",
    copy:
      "Layout, typography, campaign assets, social systems, decks, digital ad creative, and the daily craft of making things land.",
    tools: ["Photoshop", "Illustrator", "InDesign", "Figma", "Adobe Express"],
  },
  {
    name: "UX/UI + Front-End Design",
    short: "UX/UI",
    color: "#00d8ff",
    glow: "rgba(0, 216, 255, 0.5)",
    icon: "◎",
    size: "large",
    left: "53%",
    top: "51%",
    z: "180px",
    driftX: "-7px",
    driftY: "-8px",
    delay: "0.2s",
    copy:
      "Responsive layouts, interaction polish, component thinking, front-end implementation, and digital experiences that feel designed instead of assembled.",
    tools: ["React", "Vite", "CSS", "JavaScript", "Figma"],
  },
  {
    name: "Photography",
    short: "Photo",
    color: "#d45cff",
    glow: "rgba(212, 92, 255, 0.5)",
    icon: "◉",
    size: "large",
    left: "28%",
    top: "52%",
    z: "82px",
    driftX: "8px",
    driftY: "-6px",
    delay: "0.26s",
    copy:
      "Lighting, direction, composition, product awareness, and a practical eye for images that carry the idea.",
    tools: ["Nikon Camera Systems", "Blackmagic Design", "Capture One", "Photoshop"],
  },
  {
    name: "Video + Editing",
    short: "Video",
    color: "#287cff",
    glow: "rgba(40, 124, 255, 0.52)",
    icon: "▣",
    size: "medium",
    left: "42%",
    top: "38%",
    z: "-135px",
    driftX: "-5px",
    driftY: "7px",
    delay: "0.32s",
    copy:
      "Editing, pacing, cinematography instincts, asset prep, storytelling, and production decisions that survive the timeline.",
    tools: ["DaVinci Resolve", "Adobe Premiere Pro", "After Effects", "Media Encoder"],
  },
  {
    name: "Motion Design",
    short: "Motion",
    color: "#a46bff",
    glow: "rgba(164, 107, 255, 0.48)",
    icon: "Ae",
    size: "small",
    left: "78%",
    top: "55%",
    z: "115px",
    driftX: "7px",
    driftY: "6px",
    delay: "0.38s",
    copy:
      "Title movement, animated assets, timing, transitions, kinetic typography, and enough restraint to not make everything bounce like a haunted trampoline.",
    tools: ["Adobe After Effects", "DaVinci Resolve", "Premiere Pro", "Cinema 4D"],
  },
  {
    name: "Digital Marketing + Content Strategy",
    short: "Marketing",
    color: "#ff6fb4",
    glow: "rgba(255, 111, 180, 0.45)",
    icon: "✧",
    size: "small",
    left: "66%",
    top: "70%",
    z: "-15px",
    driftX: "-6px",
    driftY: "-7px",
    delay: "0.44s",
    copy:
      "Campaign angles, audience hooks, content planning, social creative, launch support, and turning brand noise into useful signals.",
    tools: ["Meta Business Suite", "Google Analytics", "Canva", "ChatGPT", "Mailchimp"],
  },
  {
    name: "AI-Assisted Workflows",
    short: "AI",
    color: "#7f5cff",
    glow: "rgba(127, 92, 255, 0.48)",
    icon: "✺",
    size: "medium",
    left: "75%",
    top: "32%",
    z: "-70px",
    driftX: "5px",
    driftY: "-9px",
    delay: "0.5s",
    copy:
      "AI-assisted concepting, prompt systems, production acceleration, image ideation, and practical workflows that make the creative process sharper.",
    tools: ["ChatGPT", "Gemini", "Midjourney", "Runway", "Ollama"],
  },
  {
    name: "Automation + Agentic Systems",
    short: "Automation",
    color: "#8cff52",
    glow: "rgba(140, 255, 82, 0.38)",
    icon: "⌁",
    size: "tiny",
    left: "36%",
    top: "18%",
    z: "-155px",
    driftX: "-8px",
    driftY: "7px",
    delay: "0.56s",
    copy:
      "Custom tools, routing logic, repeatable processes, local AI experiments, and the quiet backstage wiring that saves time when deadlines start breathing fire.",
    tools: ["Python", "Ollama", "OpenClaw", "GitHub", "Shell Scripts"],
  },
  {
    name: "Conversion + Growth Creative",
    short: "Growth",
    color: "#15e0b2",
    glow: "rgba(21, 224, 178, 0.42)",
    icon: "▤",
    size: "medium",
    left: "57%",
    top: "79%",
    z: "120px",
    driftX: "6px",
    driftY: "6px",
    delay: "0.62s",
    copy:
      "Landing-page thinking, ad iterations, messaging hierarchy, offer framing, lead-gen assets, and design choices tied to what users actually do.",
    tools: ["Google Analytics", "Search Console", "Figma", "React", "Meta Ads"],
  },
  {
    name: "3D + Visual Development",
    short: "3D",
    color: "#4aa8ff",
    glow: "rgba(74, 168, 255, 0.42)",
    icon: "⬡",
    size: "tiny",
    left: "86%",
    top: "16%",
    z: "155px",
    driftX: "-7px",
    driftY: "-5px",
    delay: "0.68s",
    copy:
      "Dimensional thinking, spatial concepts, lighting, depth, and visual experiments that give flat assets more atmosphere.",
    tools: ["Cinema 4D", "LightWave", "Photoshop", "After Effects"],
  },
];

const workHeroRailItems = [
  {
    title: "Packaging system",
    image: "/Scruz_Work_Rail_01.png",
    fallback:
      "linear-gradient(135deg, rgba(151, 149, 82, 0.96), rgba(116, 112, 60, 0.96))",
  },
  {
    title: "Campaign world",
    image: "/Scruz_Work_Rail_02.png",
    fallback:
      "linear-gradient(135deg, rgba(230, 97, 70, 0.96), rgba(193, 73, 49, 0.96))",
  },
  {
    title: "Product storytelling",
    image: "/Scruz_Work_Rail_03.png",
    fallback:
      "linear-gradient(135deg, rgba(45, 110, 136, 0.96), rgba(30, 81, 105, 0.96))",
  },
  {
    title: "Brand voice",
    image: "/Scruz_Work_Rail_04.png",
    fallback:
      "linear-gradient(135deg, rgba(149, 17, 100, 0.96), rgba(110, 10, 72, 0.96))",
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

function useRevealCards() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".revealCard"));

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("isVisible", entry.isIntersecting);
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
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
        <span>Creative Lead / Designer / Artist</span>
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
            Creative Lead / Designer / Systems Builder
          </p>

          <h1 className="heroTitle heroTitle--reveal revealTitle">
            <span>Look Sharp</span>
            <span className="heroTitleSmaller">Deliver Results</span>
          </h1>

          <p className="intro">
            I build sharp creative, clean systems, and practical AI-powered
            workflows for brands that need more than decoration. My work sits
            where taste, production, technology, and strategy overlap: creative
            direction with enough hands-on range to make the idea real, and
            enough systems thinking to make the next round faster.
          </p>

          <div className="buttons">
            <a href="#work">
              <span>See the Proof</span>
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

        <div className="sectionHeader sectionHeader--proofCenter">
          <h2 className="sectionTitle sectionTitle--proof revealTitle">
            <span>Proof of</span>
            <span>life, not</span>
            <span>just style.</span>
          </h2>

          <p className="sectionIntro">
            The work is not just about making things look expensive. It is
            about shaping the idea, building the visual system, producing the
            assets, improving the workflow, and leaving the team with something
            stronger than a pretty final file.
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
          <p className="eyebrow xenEyebrow">Custom AI Workflow System</p>

          <h2 className="xenTitle xenTitle--reveal revealTitle">
            <span>Xen</span>
            <strong>Agentic AI for Creative Operations</strong>
          </h2>

          <p className="xenIntro">
            Xen is my custom-built AI creative operations system: a local,
            evolving workflow designed to help sort requests, develop concepts,
            organize production, route tasks, and keep creative work from
            turning into a junk drawer with deadlines.
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
          It is not a gimmick or a chatbot duct-taped to a mood board. It is a
          working creative support system built around how production actually
          happens: messy inputs, fast pivots, scattered assets, repeat requests,
          half-formed ideas, and the constant need to make better work faster.
          It also lets me say the quiet part out loud: I am not just another
          designer. I bring the creative, the production brain, and the system
          that helps the team move.
        </p>

        <div className="homeBackTop">
          <a href="#top" aria-label="Back to top">
            <span>Back to Top</span>
          </a>
        </div>
      </section>
    </>
  );
}


function WorkPage() {
  return (
    <>
      <section id="workTop" className="section workPageTopBannerSection">
        <div
          className="workGalleryBanner workGalleryBanner--top workGalleryBanner--image revealCard"
          aria-label="Naked All Natural product lineup banner"
          style={{
            "--work-banner-image": `url("/Scruz_Work_Naked_Product_Lineup.png")`,
          }}
        ></div>
      </section>

      <section className="section workPageHeroSection">
        <div className="workPageHeroGrid workPageHeroGrid--caseIntro">
          <div className="workPageHeroCopy workPageHeroCopy--full">
            <p className="eyebrow workPageEyebrow">Featured / Naked All Natural</p>

            <h1 className="workPageTitle revealTitle">
              <span>Work That</span>
              <span>Builds Worlds.</span>
            </h1>

            <p className="workPageLead workPageLead--tight">
              A brand system for natural skincare with roots in tattoo culture,
              piercing studios, body confidence, and everyday care.
            </p>

            <p className="workPageBody workPageBody--intro">
              Naked All Natural needed more than a clean label and a nice product
              lineup. It needed a point of view: polished enough for e-commerce,
              warm enough for daily ritual, and sharp enough to stand apart from
              the beige chorus of wellness brands all saying the same thing in
              softer lighting. This case study follows the identity, language,
              campaign thinking, and visual structure built around that idea.
            </p>
          </div>

          <aside
            className="workPageHeroAside revealCard"
            aria-label="Case study quick links and preview tiles"
          >
            <div className="buttons workPageButtons workPageButtons--right">
              <a href="#nakedCaseStudy">
                <span>View Case Study</span>
                <span className="buttonArrow">↗</span>
              </a>
            </div>

            <div className="workPageTileGrid">
              {workHeroRailItems.map((item, index) => (
                <div
                  key={item.title}
                  className="workPageTile revealCard"
                  style={{
                    "--reveal-delay": `${index * 0.08}s`,
                    "--work-rail-image": `url("${item.image}")`,
                    "--work-rail-fallback": item.fallback,
                  }}
                  aria-label={item.title}
                >
                  <span className="srOnly">{item.title}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="nakedCaseStudy" className="section workCaseStudySection">
        <div className="workSectionHeader workSectionHeader--tight">
          <p className="workKicker">Case Study Overview</p>
          <h2 className="sectionTitle sectionTitle--workpage sectionTitle--nakedCase revealTitle">
            <span>Naked : Soft Skin, Sharp Identity.</span>
          </h2>
        </div>

        <div className="workCaseStudyGrid workCaseStudyGrid--single">
          <div className="workCaseStudyCopy revealCard">
            <h3>Natural Skincare, Reimagined.</h3>

            <p>
              Naked All Natural sits in a rare space: clean skincare with a real
              connection to body-art culture. The brand speaks to people who
              treat their skin as part of their identity, whether tattooed,
              pierced, healing, sensitive, decorated, or simply tired of beauty
              brands that sound like they were written inside a scented candle.
            </p>

            <p>
              The creative direction was built around contrast. Natural ingredients
              without the preciousness. Aftercare credibility without turning
              the brand clinical. Humor without making the product feel cheap.
              The goal was to create a system that felt clear, tactile, and
              memorable: something that could live comfortably on a bathroom
              shelf, in a studio, or inside a polished e-commerce experience
              without losing its pulse.
            </p>

            <p>
              The larger ecosystem gave the work more depth. Industrial Strength
              Needles brings a real connection to professional piercing culture,
              while HON / House of Nipple adds a human layer of recovery,
              confidence, and care. Together, they turn Naked into more than a
              skincare line. They give it a world to belong to.
            </p>
          </div>
        </div>
      </section>

      <section className="section workGallerySection">
        <div className="workHighlightGrid">
          {workHighlights.map((item, index) => (
            <article
              className={`workHighlightCard workHighlightCard--${item.variant} revealCard`}
              key={item.title}
              style={{ "--reveal-delay": `${index * 0.08}s` }}
            >
              <div
                className="workHighlightImage"
                style={{ "--work-card-image": `url("${item.image}")` }}
              >
                <span className="workImageTopLabel">{item.eyebrow}</span>
              </div>
              <div className="workHighlightContent">
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section workBrandsSection">
        <div className="workSectionHeader workSectionHeader--center">
          <h2 className="sectionTitle sectionTitle--workpage sectionTitle--brandEcosystem revealTitle">
            <span>The Brand Ecosystem.</span>
          </h2>
        </div>

        <div className="workBrandGrid">
          {sisterBrands.map((brand, index) => (
            <a
              className={`workBrandCard workBrandCard--${brand.variant} revealCard`}
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noreferrer"
              style={{ "--reveal-delay": `${index * 0.08}s` }}
            >
              <div
                className="workBrandImage"
                style={{ "--work-brand-image": `url("${brand.image}")` }}
              ></div>
              <div className="workBrandContent">
                <h3>{brand.name}</h3>
                <span>{brand.copy}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section workQuoteSection">
        <div className="workQuoteCard revealCard">
          <p className="workQuoteEyebrow">Why It Matters</p>
          <h2>
            A good brand system does more than make things look related.
            It gives the work somewhere to live.
          </h2>
          <p>
            Naked All Natural became a case study in building around tone,
            culture, clarity, and care. The work had to support products,
            campaigns, studio credibility, e-commerce, and a wider body-art
            ecosystem without flattening the personality that made the brand
            interesting in the first place. That is the kind of creative system
            I like building: polished, practical, and still unmistakably alive.
          </p>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section id="aboutTop" className="section aboutHeroSection">
        <div className="aboutHeroGrid">
          <div className="aboutHeroCopy">
            <p className="eyebrow">About / The Engine</p>

            <h1 className="aboutTitle revealTitle">
              <span>Not Just a Designer.</span>
              <span>A Creative Human.</span>
            </h1>

            <p className="aboutLead">
              I’m Stephen Cruz, a creative lead, designer, artist, editor, and
              systems builder with 20+ years of experience across web, branding,
              campaign creative, digital content, video, motion, AI-assisted
              workflow, and creative operations.
            </p>

            <p className="aboutBody">
              I started in the early web during the dot-com era, working with web
              shops, brands, and production teams before moving through agency
              life, freelance work, and the nightclub industry. That mix gave me
              a practical creative range and an extensive amount of technical
              abilities.
            </p>

            <p className="aboutBody">
              My work lives at the intersection of visual taste, cultural
              awareness, technical curiosity, and production discipline. I’m
              connected across platforms, fluent in how modern audiences see and
              react, and comfortable moving between art direction, hands-on
              design, web, motion, AI, and workflow strategy.
            </p>

            <p className="aboutBody">
              Basically, I’m a highly caffeinated 21st-century creative human who
              can make the thing, improve the machine around the thing, and
              usually figure out why the thing broke in the first place.
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
          </div>
        </div>
      </section>

      <section className="section aboutStatsSection" aria-label="About highlights">
        <div className="aboutStatsGrid">
          {aboutStats.map((stat, index) => (
            <div
              className="aboutStat revealCard"
              key={stat.value}
              style={{
                "--stat-image": `url("${stat.image}")`,
                "--reveal-delay": `${index * 0.08}s`,
              }}
            >
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
            <span>The System</span>
            <span>Behind the Style.</span>
          </h2>
        </div>

        <div className="aboutPrinciplesGrid">
          {aboutPrinciples.map((item, index) => (
            <article
              className="aboutPrinciple revealCard"
              key={item.title}
              style={{
                "--principle-image": `url("${item.image}")`,
                "--reveal-delay": `${index * 0.08}s`,
              }}
            >
              <p>{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <span>{item.copy}</span>
            </article>
          ))}
        </div>

        <div className="aboutBackTop">
          <a href="#aboutTop">
            <span>Back to Top</span>
            <span className="buttonArrow">↑</span>
          </a>
        </div>
      </section>
    </>
  );
}


function SkillsPage() {
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const activeSkill = skillCubes[activeSkillIndex];

  return (
    <>
      <section id="skillsTop" className="section skillsHeroSection">
        <div className="skillsHeroGrid">
          <div className="skillsHeroCopy">
            <p className="eyebrow skillsEyebrow">Skills / Creative Range</p>

            <h1 className="skillsTitle revealTitle">
              <span>Creative</span>
              <span>Capabilities.</span>
            </h1>

            <p className="skillsLead">
              I can think like a creative lead, design like a specialist, produce
              like a maker, and troubleshoot like a systems person. I keep adding
              new skills all the time, not just to stay fresh, but to get better.
            </p>
          </div>

          <div
            className="skillsStage skillsStage--three revealCard"
            aria-label="Interactive 3D skill cube visualization"
          >
            <SkillsCubeScene
              skills={skillCubes}
              activeSkillIndex={activeSkillIndex}
              setActiveSkillIndex={setActiveSkillIndex}
            />
          </div>

          <div className="skillsActiveCard" style={{ "--active-color": activeSkill.color }}>
            <p>{String(activeSkillIndex + 1).padStart(2, "0")} / Selected Capability</p>
            <h2>{activeSkill.name}</h2>
            <span>{activeSkill.copy}</span>
            <div className="skillsToolList" aria-label={`${activeSkill.name} supporting tools`}>
              {activeSkill.tools.map((tool) => (
                <em key={tool}>{tool}</em>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section skillsCapabilitySection">
        <div className="skillsCapabilityHeader">
          <h2 className="sectionTitle sectionTitle--skills revealTitle">
            <span>Creative range,</span>
            <span>proven in production.</span>
          </h2>
        </div>

        <article className="skillsCapabilityCopy revealCard">
          <p>
            My skill set was built in production: under deadlines, inside real
            campaigns, across changing platforms, and through years of making
            things that had to work. I bring creative direction, design,
            branding, photography, video, motion, web, AI workflow, and
            production experience into one connected practice.
          </p>

          <p>
            That means I can help shape the idea, design the system, build the
            asset, polish the final, and improve the process behind it. I’m not
            just checking software boxes. I’m bringing range, judgment,
            persistence, and the ability to keep moving when the project gets
            weird, rushed, revised, or on fire.
          </p>
        </article>

        <div className="aboutBackTop skillsBackTop">
          <a href="#skillsTop">
            <span>Back to Top</span>
            <span className="buttonArrow">↑</span>
          </a>
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
  useRevealCards();

  const path = window.location.pathname;

  let page = <HomePage />;

  if (path === "/about") {
    page = <AboutPage />;
  } else if (path === "/work") {
    page = <WorkPage />;
  } else if (path === "/skills") {
    page = <SkillsPage />;
  }

  return (
    <>
      <div className="site-bg" aria-hidden="true" />

      <main id="top" className="site">
        <SiteHeader />
        {page}
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
