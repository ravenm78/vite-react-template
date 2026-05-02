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
    imageLabel: "Case Studies",
    eyebrow: "Work / Brand Systems / Campaign Worlds",
    title: "Work That Builds Worlds",
    copy:
      "Identity, campaign direction, production design, and complete visual systems built to survive real-world deadlines, revisions, and weird human weather.",
  },
  {
    href: "/about",
    image: "/Scruz_Work_02.png",
    imageLabel: "The Engine",
    eyebrow: "About / Creative Direction / Systems Thinking",
    title: "The Mind Behind the Machine",
    copy:
      "Creative lead, designer, artist, editor, photographer, and systems builder with enough range to shape the idea and build the pipeline behind it.",
  },
  {
    href: "/skills",
    image: "/Scruz_Work_03.png",
    imageLabel: "Capabilities",
    eyebrow: "Skills / Tools / Technical Range",
    title: "Taste With a Tool Belt",
    copy:
      "A practical range of design, photo, video, motion, web, AI workflow, brand, and production skills. Pretty pixels, plus the plumbing.",
  },
];

const aboutStats = [
  {
    value: "20+",
    image: "/Scruz_About_20Years.png",
    label:
      "Years across web, branding, campaign creative, production, video, motion, print, and the noble art of getting impossible-looking things out the door.",
  },
  {
    value: "AI",
    image: "/Scruz_About_AI.png",
    label:
      "Practical AI integration for concepting, organizing, prompt systems, production acceleration, and workflow support without letting the machine flatten the taste.",
  },
  {
    value: "Xen",
    image: "/Scruz_About_Xen.png",
    label:
      "A custom local creative-operations system built to route requests, shape concepts, organize production, and turn chaos into something less feral.",
  },
];

const aboutPrinciples = [
  {
    eyebrow: "01 / Direction",
    title: "Turn the fog into a plan.",
    image: "/Scruz_About_Direction.png",
    copy:
      "A loose ask, a messy brief, a folder full of half-clues: that is where I like to work. I find the message, build the hierarchy, and give the creative a spine.",
  },
  {
    eyebrow: "02 / Creation",
    title: "Make the work feel finished.",
    image: "/Scruz_About_Creation.png",
    copy:
      "I can move from concept to execution across layout, identity, photo direction, retouching, motion, web assets, print, presentations, and campaign design.",
  },
  {
    eyebrow: "03 / Systems",
    title: "Make the next round easier.",
    image: "/Scruz_About_Systems.png",
    copy:
      "Good creative should not collapse the second someone asks for version two. I build reusable patterns, cleaner handoffs, smarter processes, and AI-assisted workflows.",
  },
];

const workHighlights = [
  {
    eyebrow: "01 / Brand Positioning",
    title: "Skincare for real skin.",
    image: "/Scruz_Work_Naked_Product_Identity.png",
    copy:
      "Naked moved away from generic wellness language and toward people who treat their skin as part of identity: tattooed, pierced, healing, sensitive, decorated, worked on, lived in, and cared for.",
    variant: "identity",
  },
  {
    eyebrow: "02 / Product Architecture",
    title: "A product line with rhythm.",
    image: "/Scruz_Work_Naked_Campaign_Voice.png",
    copy:
      "Each product needed its own job while still feeling part of one system: daily care, cleansing, soothing, aftercare, recovery, and routine, all organized without turning clinical.",
    variant: "voice",
  },
  {
    eyebrow: "03 / Voice + Audience",
    title: "A cleaner voice with sharper teeth.",
    image: "/Scruz_Work_Naked_Audience.png",
    copy:
      "The voice had to be useful, direct, and funny without becoming a gimmick. Naked needed to talk about ingredients and concerns like actual humans were behind it.",
    variant: "audience",
  },
];

const sisterBrands = [
  {
    name: "Naked All Natural",
    image: "/Scruz_Work_Naked_Brand.png",
    copy:
      "The centerpiece: natural alternative skincare around clean ingredients, real bodies, body-art culture, daily use, and aftercare trust.",
    variant: "naked",
    url: "https://nakedallnatural.com/",
  },
  {
    name: "Industrial Strength Needles",
    image: "/Scruz_Work_Industrial_Strength.png",
    copy:
      "Professional piercing context gives the system a credible bridge into studios, artists, piercers, and aftercare conversations.",
    variant: "needles",
    url: "https://industrialstrengthneedles.com/",
  },
  {
    name: "HON / House of Nipple",
    image: "/Scruz_Work_HON.png",
    copy:
      "A purpose-driven layer focused on breast cancer survivors, areola tattooing, healing, body confidence, and care.",
    variant: "hon",
    url: "https://houseofnipple.org/",
  },
];

const workHeroRailItems = [
  { title: "Packaging system", image: "/Scruz_Work_Rail_01.png", fallback: "linear-gradient(135deg, #8f9154, #5d5f35)" },
  { title: "Campaign world", image: "/Scruz_Work_Rail_02.png", fallback: "linear-gradient(135deg, #e05238, #8e281f)" },
  { title: "Product storytelling", image: "/Scruz_Work_Rail_03.png", fallback: "linear-gradient(135deg, #236f86, #113f52)" },
  { title: "Brand voice", image: "/Scruz_Work_Rail_04.png", fallback: "linear-gradient(135deg, #9a1268, #4f0838)" },
];

const skillsGroups = [
  {
    eyebrow: "01 / Creative Direction",
    title: "Concept, taste, and visual authority.",
    image: "/Scruz_Work_01.png",
    items: ["Brand direction", "Campaign concepts", "Art direction", "Visual systems", "Audience strategy"],
  },
  {
    eyebrow: "02 / Production Design",
    title: "The hands-on part where ideas become assets.",
    image: "/Scruz_Work_02.png",
    items: ["Adobe Creative Suite", "Retouching", "Print + digital", "Decks", "Social assets"],
  },
  {
    eyebrow: "03 / Motion + Media",
    title: "Photo, video, motion, and cinematic polish.",
    image: "/Scruz_Website_Hero_0002.png",
    items: ["Photography", "Video editing", "After Effects", "Cinematography", "Sound design"],
  },
  {
    eyebrow: "04 / Web + Systems",
    title: "Useful technical range, not buzzword confetti.",
    image: "/Scruz_Website_Hero_0003.png",
    items: ["React", "CSS", "Python", "AI workflows", "Local automation"],
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
    <header className="nav" id="top">
      <a className="nameplate" href="/">
        <strong>Stephen Cruz</strong>
        <span>Brand Systems / Creative Direction</span>
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

function Button({ href, children, variant = "ghost", arrow = "↗" }) {
  return (
    <a className={`siteButton siteButton--${variant}`} href={href}>
      <span>{children}</span>
      <span className="buttonArrow">{arrow}</span>
    </a>
  );
}

function HomePage() {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHero = heroSlides[activeHeroIndex];

  return (
    <>
      <section className="hero siteShell">
        <div className="heroCopy">
          <p className="eyebrow">Creative systems with teeth</p>

          <h1 className="heroTitle heroTitle--reveal revealTitle">
            <span>Look Sharp.</span>
            <span>Deliver Results.</span>
          </h1>

          <p className="intro">
            I build brand systems, campaign worlds, production assets, and AI-assisted workflows for teams that need more than a pretty layout. The work has to look expensive, move fast, and survive contact with real deadlines.
          </p>

          <div className="buttons">
            <Button href="#work">View Proof</Button>
            <Button href="/work" variant="red">See Case Study</Button>
          </div>
        </div>

        <div className="heroStage" aria-label="Featured portfolio visual">
          <div className="heroImage" style={{ "--hero-image": `url("${activeHero.image}")` }}>
            <div className="heroFrameLine heroFrameLineTop" />
            <div className="heroFrameLine heroFrameLineBottom" />
            <div className="heroCorner heroCornerTopLeft" />
            <div className="heroCorner heroCornerTopRight" />
            <div className="heroCorner heroCornerBottomLeft" />
            <div className="heroCorner heroCornerBottomRight" />

            <div className="heroSelectors" aria-label="Featured visual selectors">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={`selector ${activeHeroIndex === index ? "isActive" : ""}`}
                  type="button"
                  aria-label={`${slide.label} selector`}
                  aria-pressed={activeHeroIndex === index}
                  onClick={() => setActiveHeroIndex(index)}
                  style={{ "--selector-image": `url("${slide.image}")` }}
                >
                  <span className="selectorDot" />
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
        <p className="eyebrow sectionEyebrow">Choose your entry point</p>
        <div className="sectionHeader splitHeader">
          <h2 className="sectionTitle sectionTitle--proof revealTitle">
            <span>Proof of systems,</span>
            <span>not just style.</span>
          </h2>
          <p className="sectionIntro">
            Brand identity, campaign direction, visual worlds, and automation architecture: the connective tissue between idea, asset, workflow, and result.
          </p>
        </div>

        <div className="projectGrid">
          {workItems.map((item, index) => (
            <a className="projectItem revealCard" key={item.title} href={item.href} style={{ "--reveal-delay": `${index * 0.08}s` }}>
              <div className="projectImage" style={{ "--project-image": `url("${item.image}")` }}>
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
          <p className="eyebrow xenEyebrow">Custom creative ops system</p>
          <h2 className="xenTitle xenTitle--reveal revealTitle">
            <span>Xen</span>
            <strong>Agentic AI for Workflow Automation</strong>
          </h2>
          <p className="xenIntro">
            Xen is a custom AI-assisted creative operations system running through my own local workflow. It helps sort requests, shape concepts, organize production, and speed up the process companies keep saying they desperately need, plus it lets me say, with a straight face, that I’m more than a graphic designer. I’m the value-add goblin in the wiring.
          </p>
        </div>
        <div className="xenVisual revealCard" aria-label="Xen workflow automation visual">
          <img src="/Scruz_Xen_Section.png" alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        </div>
      </section>
    </>
  );
}

function WorkPage() {
  return (
    <>
      <section id="workTop" className="section workPageTopBannerSection">
        <div className="workHeroBanner revealCard" aria-label="Naked All Natural product lineup banner">
          <div className="workHeroBannerImage" style={{ "--work-banner-image": `url("/Scruz_Work_Naked_Product_Lineup.png")` }} />
        </div>
      </section>

      <section className="section workPageHeroSection">
        <div className="workPageHeroGrid workPageHeroGrid--caseIntro">
          <div className="workPageHeroCopy workPageHeroCopy--full">
            <p className="eyebrow workPageEyebrow">Featured case study</p>
            <h1 className="workPageTitle revealTitle">
              <span>Work That</span>
              <span>Builds Worlds.</span>
            </h1>
            <p className="workPageLead workPageLead--tight">
              A brand system for natural skincare with roots in tattoo culture, piercing studios, body confidence, and everyday care.
            </p>
            <p className="workPageBody workPageBody--intro">
              Naked All Natural needed more than a clean label and a nice product lineup. It needed a point of view: polished enough for e-commerce, warm enough for daily ritual, and sharp enough to stand apart from the beige chorus of wellness brands all whispering the same beige lullaby.
            </p>
            <div className="buttons workPageButtons"><Button href="#nakedCaseStudy">View Full Project</Button></div>
          </div>

          <aside className="workPageHeroAside revealCard" aria-label="Case study quick links and preview tiles">
            <Button href="#nakedCaseStudy">View Case Study</Button>
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
        <div className="workSectionHeader workSectionHeader--tight workSectionHeader--center">
          <p className="workKicker">Case Study</p>
          <h2 className="sectionTitle sectionTitle--workpage sectionTitle--nakedCase revealTitle">
            <span>Naked: Soft Skin, Sharp Identity.</span>
          </h2>
        </div>

        <div className="workCaseStudyGrid workCaseStudyGrid--single">
          <div className="workCaseStudyCopy revealCard">
            <div>
              <p className="workKicker">Overview</p>
              <h3>Natural Skincare, Reimagined.</h3>
            </div>
            <p>
              Naked All Natural sits in a rare space: clean skincare with a real connection to body-art culture. The brand speaks to people who treat their skin as part of their identity, whether tattooed, pierced, healing, sensitive, decorated, or simply tired of weak formulas and overhyped claims.
            </p>
            <p>
              The creative direction was built around contrast. Natural ingredients without turning precious. Aftercare credibility without turning clinical. Humor without making the product feel cheap. The goal was to create a system that felt clear, tactile, and memorable.
            </p>
            <p>
              The larger ecosystem gave the work more depth. Industrial Strength Needles brings professional piercing credibility, while HON / House of Nipple adds a human layer of recovery, confidence, and care. Together, they give the work a world to belong to.
            </p>
          </div>
        </div>
      </section>

      <section className="section workGallerySection">
        <div className="workHighlightGrid">
          {workHighlights.map((item, index) => (
            <article className={`workHighlightCard workHighlightCard--${item.variant} revealCard`} key={item.title} style={{ "--reveal-delay": `${index * 0.08}s` }}>
              <div className="workHighlightImage" style={{ "--work-card-image": `url("${item.image}")` }}>
                <div className="workHighlightText">
                  <p>{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <span>{item.copy}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section workBrandsSection">
        <div className="workSectionHeader workSectionHeader--center">
          <p className="workKicker">The Brand Ecosystem</p>
          <h2 className="sectionTitle sectionTitle--workpage sectionTitle--brandEcosystem revealTitle">
            <span>One World. Three Brands.</span>
          </h2>
        </div>

        <div className="workBrandGrid">
          {sisterBrands.map((brand, index) => (
            <a className={`workBrandCard workBrandCard--${brand.variant} revealCard`} key={brand.name} href={brand.url} target="_blank" rel="noreferrer" style={{ "--reveal-delay": `${index * 0.08}s` }}>
              <div className="workBrandImage" style={{ "--work-brand-image": `url("${brand.image}")` }}>
                <div className="workBrandContent">
                  <h3>{brand.name}</h3>
                  <span>{brand.copy}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section workQuoteSection">
        <div className="workQuoteCard revealCard">
          <p className="workQuoteEyebrow">Why It Matters</p>
          <h2>A good brand system does more than make things look related. It gives the work somewhere to live.</h2>
          <p>
            Naked All Natural became more than a product. It became a platform for care, clarity, and culture. The work had to support products, campaigns, studio credibility, e-commerce, and a wider body-art ecosystem without flattening the personality that made the brand interesting in the first place.
          </p>
          <div className="quoteButtons">
            <Button href="mailto:ravenmacabrex12@gmail.com" variant="red">Let’s Build Your World</Button>
            <Button href="#workTop" arrow="↑">Back to Top</Button>
          </div>
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
              I’m Stephen Cruz, a creative lead, designer, artist, photographer, editor, and systems builder with 20+ years of experience across web, branding, campaign creative, production, photo, video, motion, print, and AI-assisted workflow.
            </p>
            <p className="aboutBody">
              I started in the early web during the dot-com era, working with web shops, agencies, brands, and production teams before moving through agency life, freelance work, Davis Advertising, and nearly six years as Creative Lead at Xtreme Marketing.
            </p>
            <p className="aboutBody">
              My work lives at the intersection of visual taste, cultural awareness, technical curiosity, and production discipline. I can concept the idea, design the asset, shape the campaign, polish the final, and improve the process behind it.
            </p>
            <p className="aboutBody">
              Basically, I’m the person you call when the brief needs an art director, a designer, a production brain, a technical translator, and one mildly haunted problem-solver in the same chair.
            </p>
            <div className="buttons aboutButtons">
              <Button href="/work">See the Work</Button>
              <Button href="/skills">View Skills</Button>
            </div>
          </div>
          <div className="aboutPortraitCard revealCard" aria-label="Portrait of Stephen Cruz">
            <div className="aboutPortraitImage" />
          </div>
        </div>
      </section>

      <section className="section aboutStatsSection" aria-label="About highlights">
        <div className="aboutStatsGrid">
          {aboutStats.map((stat, index) => (
            <div className="aboutStat revealCard" key={stat.value} style={{ "--stat-image": `url("${stat.image}")`, "--reveal-delay": `${index * 0.08}s` }}>
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
            <article className="aboutPrinciple revealCard" key={item.title} style={{ "--principle-image": `url("${item.image}")`, "--reveal-delay": `${index * 0.08}s` }}>
              <p>{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <span>{item.copy}</span>
            </article>
          ))}
        </div>
        <div className="aboutBackTop"><Button href="#aboutTop" arrow="↑">Back to Top</Button></div>
      </section>
    </>
  );
}

function SkillsPage() {
  return (
    <section id="skillsTop" className="section skillsPage">
      <p className="eyebrow">Skills / Tools / Range</p>
      <h1 className="aboutTitle revealTitle"><span>Taste With</span><span>a Tool Belt.</span></h1>
      <p className="aboutLead skillsLead">
        A practical creative stack for concepting, designing, building, shooting, editing, automating, and shipping. Not a buzzword museum, more like a garage full of dangerous-looking instruments that actually work.
      </p>
      <div className="skillsGrid">
        {skillsGroups.map((group, index) => (
          <article className="skillCard revealCard" key={group.title} style={{ "--skill-image": `url("${group.image}")`, "--reveal-delay": `${index * 0.08}s` }}>
            <p>{group.eyebrow}</p>
            <h2>{group.title}</h2>
            <div className="skillPills">
              {group.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>
        ))}
      </div>
      <div className="aboutBackTop"><Button href="#skillsTop" arrow="↑">Back to Top</Button></div>
    </section>
  );
}

function App() {
  useRevealTitles();
  useRevealCards();

  const path = window.location.pathname;
  let page = <HomePage />;

  if (path === "/about") page = <AboutPage />;
  else if (path === "/work") page = <WorkPage />;
  else if (path === "/skills") page = <SkillsPage />;

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
