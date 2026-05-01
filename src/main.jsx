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
    eyebrow: "01 / Product Identity",
    title: "Packaging, positioning, and a sharper product story.",
    copy:
      "The goal was not to make the brand look generically natural. It was to make it memorable, useful, and visually distinct, with enough structure to carry across products, campaigns, and future content.",
    variant: "identity",
  },
  {
    eyebrow: "02 / Campaign Voice",
    title: "Natural skincare with more personality and bite.",
    copy:
      "I pushed the brand toward a clearer voice and a more contemporary tone: still trustworthy, still ingredient-aware, but more playful, more human, and better suited for modern digital attention.",
    variant: "voice",
  },
  {
    eyebrow: "03 / Audience Expansion",
    title: "Built to connect with body-art culture and younger buyers.",
    copy:
      "The creative direction opened the brand toward tattooed and pierced audiences without losing broader appeal, giving Naked All Natural a more ownable position in a crowded category.",
    variant: "audience",
  },
];

const workDeliverables = [
  "Creative direction",
  "Brand positioning",
  "Product identity",
  "Campaign concepts",
  "Digital content direction",
  "Audience strategy",
  "Visual systems",
  "AI-assisted workflow support",
  "Web and presentation assets",
  "Brand ecosystem development",
];

const sisterBrands = [
  {
    name: "Naked All Natural",
    copy:
      "The main brand: natural skincare with a clearer point of view, stronger visual identity, and room to grow into a wider content and campaign system.",
    variant: "naked",
  },
  {
    name: "Industrial Strength Needles",
    copy:
      "A sister-brand connection grounded in tattoo culture and body-art aesthetics, expanding the world around Naked All Natural with a sharper edge and deeper subcultural alignment.",
    variant: "needles",
  },
  {
    name: "HON / House of Nipple",
    copy:
      "A charity-focused extension tied to breast cancer awareness and body confidence, designed to carry more emotional weight while still feeling connected to the wider brand universe.",
    variant: "hon",
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
      <section id="workTop" className="section workPageHeroSection">
        <div className="workPageHeroGrid">
          <div className="workPageHeroCopy">
            <p className="eyebrow">Work / Featured Case Study</p>

            <h1 className="workPageTitle revealTitle">
              <span>Work That</span>
              <span>Builds Worlds.</span>
            </h1>

            <p className="workPageLead">
              Creative direction, campaign systems, brand development, visual
              identity, AI-assisted workflow, and high-volume content built for
              brands that need more than one pretty asset.
            </p>

            <p className="workPageBody">
              My work sits between visual direction and practical execution:
              brand systems, campaign language, digital content, web visuals,
              motion-ready assets, presentation pieces, and workflow structure.
              I’m interested in the whole machine: the idea, the look, the
              audience, the production path, and the way a brand shows up
              repeatedly without turning into wallpaper.
            </p>

            <div className="buttons workPageButtons">
              <a href="#nakedCaseStudy">
                <span>View Case Study</span>
                <span className="buttonArrow">↗</span>
              </a>
              <a href="/about">
                <span>About the Engine</span>
                <span className="buttonArrow">↗</span>
              </a>
            </div>
          </div>

          <div className="workHeroVisual revealCard" aria-label="Featured work placeholder">
            <div className="workHeroVisualBadge">Featured Project</div>
            <div className="workHeroVisualTitle">Naked All Natural</div>
            <div className="workHeroVisualMeta">
              Brand identity / campaign direction / product storytelling
            </div>
          </div>
        </div>
      </section>

      <section id="nakedCaseStudy" className="section workCaseStudySection">
        <div className="workSectionHeader">
          <p className="eyebrow sectionEyebrow">Featured / Naked All Natural</p>
          <h2 className="sectionTitle sectionTitle--workpage revealTitle">
            <span>Naked All Natural:</span>
            <span>Building a Skincare Brand With Bite.</span>
          </h2>
        </div>

        <div className="workCaseStudyGrid">
          <div className="workCaseStudyCopy revealCard">
            <p className="workKicker">Case Study Overview</p>
            <h3>Natural skincare did not need to look sleepy. It needed a pulse.</h3>

            <p>
              Naked All Natural is an independent skincare brand built around
              natural ingredients, skin recovery, and a customer base that cares
              about what goes on their body. The challenge was not simply to
              make the products look “clean” or “organic.” The brand needed a
              stronger visual identity, a sharper voice, and a more memorable
              presence in a crowded wellness space where everything can start to
              look like beige lotion in a glass jar.
            </p>

            <p>
              For Naked All Natural, I developed a creative direction that
              balanced natural skincare credibility with a more playful,
              tattoo-friendly edge. The goal was to make the brand feel
              approachable, useful, funny, and visually distinct without losing
              the trust that skincare products need. That meant thinking through
              product identity, campaign concepts, audience tone, visual
              hierarchy, social content, product presentation, and how the brand
              could speak to both longtime customers and a younger
              body-art-conscious audience.
            </p>

            <p>
              This work also expanded into a wider brand ecosystem, including
              sister projects like Industrial Strength Needles and HON / House
              of Nipple, a breast cancer charity concept. Together, these brands
              created an opportunity to build a connected creative universe:
              skincare, tattoo culture, body confidence, humor, charity, and
              identity all orbiting the same visual and strategic world.
            </p>
          </div>

          <div className="workCaseStudyVisual revealCard" aria-label="Naked All Natural hero placeholder">
            <div className="workPlaceholderFrame">
              <span className="workPlaceholderLabel">Primary Campaign Visual Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section workGallerySection">
        <div className="workGalleryBanner revealCard" aria-label="Feature banner placeholder">
          <div className="workPlaceholderFrame workPlaceholderFrame--banner">
            <span className="workPlaceholderLabel">Feature Banner / Product Lineup Placeholder</span>
          </div>
          <div className="workGalleryBannerCaption">
            Brand identity and campaign direction for an independent natural skincare line.
          </div>
        </div>

        <div className="workHighlightGrid">
          {workHighlights.map((item, index) => (
            <article
              className={`workHighlightCard workHighlightCard--${item.variant} revealCard`}
              key={item.title}
              style={{ "--reveal-delay": `${index * 0.08}s` }}
            >
              <div className="workHighlightImage">
                <span className="workPlaceholderLabel">
                  {item.eyebrow}
                </span>
              </div>
              <div className="workHighlightContent">
                <p>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section workDeliverablesSection">
        <div className="workDeliverablesGrid">
          <div className="workDeliverablesCopy revealCard">
            <p className="eyebrow sectionEyebrow">What I Built</p>
            <h2 className="sectionTitle sectionTitle--workpage sectionTitle--compact revealTitle">
              <span>Direction.</span>
              <span>Assets.</span>
              <span>Systems.</span>
            </h2>
            <p className="sectionIntro">
              The value was not just making the brand look better. It was
              giving it a stronger point of view, a clearer audience, a more
              flexible creative system, and a voice that could move across
              products, campaigns, social content, and future brand extensions.
            </p>
          </div>

          <div className="workDeliverablesList revealCard">
            {workDeliverables.map((item) => (
              <span className="workDeliverablePill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section workBrandsSection">
        <div className="workSectionHeader">
          <p className="eyebrow sectionEyebrow">Brand Ecosystem</p>
          <h2 className="sectionTitle sectionTitle--workpage revealTitle">
            <span>One Main Brand.</span>
            <span>A Wider Creative Universe.</span>
          </h2>
        </div>

        <div className="workBrandGrid">
          {sisterBrands.map((brand, index) => (
            <article
              className={`workBrandCard workBrandCard--${brand.variant} revealCard`}
              key={brand.name}
              style={{ "--reveal-delay": `${index * 0.08}s` }}
            >
              <div className="workBrandImage">
                <span className="workPlaceholderLabel">{brand.name} Placeholder</span>
              </div>
              <div className="workBrandContent">
                <h3>{brand.name}</h3>
                <span>{brand.copy}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section workQuoteSection">
        <div className="workQuoteCard revealCard">
          <p className="workQuoteEyebrow">Why It Matters</p>
          <h2>Good branding is not a single image. It is a system people can recognize, trust, and remember.</h2>
          <p>
            Naked All Natural became a strong anchor project because it brought
            together brand identity, campaign direction, audience strategy,
            product storytelling, and a larger ecosystem of connected creative thinking.
          </p>

          <div className="buttons workPageButtons workPageButtons--center">
            <a href="/skills">
              <span>View Skills</span>
              <span className="buttonArrow">↗</span>
            </a>
            <a href="#workTop">
              <span>Back to Top</span>
              <span className="buttonArrow">↑</span>
            </a>
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
