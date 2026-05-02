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
              <span>A Creative Engine.</span>
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
