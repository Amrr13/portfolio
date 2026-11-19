import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  Code2,
  Cpu,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Phone,
  ScanLine,
  Search,
  Sun,
  X,
} from "lucide-react";
import {
  age,
  categories,
  credentials,
  experience,
  github,
  projects,
  skills,
} from "./content";
import type { Category, Credential, Project } from "./content";
import ArabicAnalyzer from "./ArabicAnalyzer";
import ProjectVisual from "./ProjectVisual";

const navigation = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Credentials", href: "#training" },
];
const linkedIn = "https://www.linkedin.com/in/amr-mohamedd-/";
const email = "1amrmohamedd@gmail.com";
const phone = "+201023462890";
const selectedProjectCount = 4;
const featuredSkills = [
  "Machine learning",
  "Deep learning",
  "Computer vision",
  "NLP (Arabic & English)",
  "Data analysis",
  "Agentic AI",
  "RAG systems",
  "Robotics",
  "IoT",
  "Automation",
];
const skillIcons = [ScanLine, Code2, Cpu];
type Overlay = { project: Project } | { credential: Credential };
type ProjectNavigation = {
  position: number;
  count: number;
  move: (direction: -1 | 1) => void;
};

function DetailDialog({
  overlay,
  onClose,
  projectNavigation,
}: {
  overlay: Overlay;
  onClose: () => void;
  projectNavigation?: ProjectNavigation;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const project = "project" in overlay ? overlay.project : null;
  const credential = "credential" in overlay ? overlay.credential : null;

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  function closeDialog() {
    dialog.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      className={
        credential ? "detail-dialog certificate-dialog" : "detail-dialog"
      }
      aria-labelledby="detail-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="dialog-top">
        <span>{project?.category ?? "Certificate"}</span>
        <button
          type="button"
          className="icon-button close-dialog"
          autoFocus
          aria-label="Close details"
          onClick={closeDialog}
        >
          <X size={21} />
        </button>
      </div>
      <div className="detail-inner">
        {project && projectNavigation && (
          <nav className="detail-navigation" aria-label="Browse project details">
            <button
              className="button secondary"
              type="button"
              aria-label="Previous project"
              onClick={() => projectNavigation.move(-1)}
            >
              <ArrowLeft size={16} aria-hidden="true" /> Previous
            </button>
            <p className="detail-position" aria-live="polite" aria-atomic="true">
              {projectNavigation.position} of {projectNavigation.count}
              <span className="sr-only">, {project.title}</span>
            </p>
            <button
              className="button secondary"
              type="button"
              aria-label="Next project"
              onClick={() => projectNavigation.move(1)}
            >
              Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
        )}
        {project && (
          <div className="project-detail" key={project.id}>
            <h2 id="detail-title">{project.title}</h2>
            <p className="detail-description">{project.detail}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {project.id === "e3raab" ? (
              <ArabicAnalyzer />
            ) : (
              <div className="detail-art">
                <ProjectVisual project={project} />
              </div>
            )}
          </div>
        )}
        {credential && (
          <>
            <h2 id="detail-title">{credential.title}</h2>
            <p className="detail-description">{credential.issuer}</p>
            {credential.period && (
              <p className="detail-period">{credential.period}</p>
            )}
            {credential.pdf && (
              <a
                className="button primary detail-website"
                href={credential.pdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={18} /> Open certificate PDF
              </a>
            )}
            {credential.image &&
              (imageUnavailable ? (
                <p role="status">This certificate image could not be loaded.</p>
              ) : (
                <img
                  className="certificate-image"
                  src={credential.image}
                  alt={`Certificate for ${credential.title}`}
                  onError={() => setImageUnavailable(true)}
                />
              ))}
          </>
        )}
      </div>
    </dialog>
  );
}

function ProjectCard({
  project,
  featured,
  open,
}: {
  project: Project;
  featured: boolean;
  open: () => void;
}) {
  return (
    <article className={featured ? "project-card featured" : "project-card"}>
      <div className="project-image">
        <ProjectVisual project={project} />
      </div>
      <div className="project-content">
        <p className="project-category">{project.category}</p>
        <h3>
          <button type="button" className="project-link" onClick={open}>
            {project.title}
          </button>
        </h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-bottom">
          <div className="tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className="project-open" aria-hidden="true">
            Explore project
            <span>+</span>
          </span>
        </div>
      </div>
    </article>
  );
}

function Credentials({ open }: { open: (credential: Credential) => void }) {
  const featured = credentials.find(({ pdf, image }) => pdf && image);
  return (
    <div className="credentials-layout">
      {featured && (
        <article className="credential-feature">
          <button
            className="credential-preview"
            type="button"
            onClick={() => open(featured)}
            aria-label="View DEPI certificate"
          >
            <img
              src={featured.image}
              alt="DEPI certificate preview"
              loading="lazy"
              width="1600"
              height="1132"
            />
            <span className="preview-caption">
              <FileText size={17} /> Open certificate
            </span>
          </button>
          <div className="credential-copy">
            <p className="section-label">Digital Egypt Pioneers</p>
            <h3>
              Microsoft Machine
              <br />
              Learning Engineer
            </h3>
            <p>{featured.period}</p>
          </div>
        </article>
      )}
      <ul className="credential-list">
        {credentials
          .filter((credential) => credential !== featured)
          .map((credential) => (
            <li key={credential.title}>
              <Award size={23} aria-hidden="true" />
              <div>
                <h3>{credential.title}</h3>
                <p>{credential.issuer}</p>
                {credential.period && (
                  <p className="credential-period">{credential.period}</p>
                )}
              </div>
              {credential.image && (
                <button
                  type="button"
                  className="credential-action"
                  aria-label={`View certificate for ${credential.title}`}
                  onClick={() => open(credential)}
                >
                  <span aria-hidden="true">+</span>
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<Category>("All projects");
  const [projectQuery, setProjectQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstNavLink = useRef<HTMLAnchorElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const main = useRef<HTMLElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const query = projectQuery.trim().toLowerCase();
  const keywords = query ? query.split(/\s+/u) : [];
  const filtered = projects.filter((project) => {
    if (category !== "All projects" && project.category !== category) return false;
    const searchable = [
      project.title,
      project.summary,
      project.detail,
      project.category,
      ...project.tags,
    ]
      .join(" ")
      .toLowerCase();
    return keywords.every((word) => searchable.includes(word));
  });
  const visibleProjects =
    showAll || query ? filtered : filtered.slice(0, selectedProjectCount);
  const activeProject = overlay && "project" in overlay ? overlay.project : null;
  const activeIndex = activeProject ? filtered.indexOf(activeProject) : -1;
  const projectNavigation: ProjectNavigation | undefined =
    activeIndex >= 0 && filtered.length > 1
      ? {
          position: activeIndex + 1,
          count: filtered.length,
          move: (direction) => {
            const index =
              (activeIndex + direction + filtered.length) % filtered.length;
            setOverlay({ project: filtered[index] });
          },
        }
      : undefined;

  useEffect(() => {
    if (menuOpen) firstNavLink.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    let target = window.location.hash.slice(1);
    if (target === "playground") {
      target = "projects";
      window.history.replaceState(window.history.state, "", "#projects");
    }
    if (target) document.getElementById(target)?.scrollIntoView();
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const content = main.current;
    if (
      !content ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    content
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    content.classList.add("motion-ready");

    return () => {
      observer.disconnect();
      content.classList.remove("motion-ready");
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("amr-theme", next);
    } catch {
      /* Theme works without persistent storage. */
    }
  }

  async function copyPortfolio() {
    try {
      await navigator.clipboard.writeText("https://www.amrmohamed.site/");
      setCopyState("copied");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyState("idle"), 2400);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div
          className="shell header-inner"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menuOpen) {
              setMenuOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          <a
            className="wordmark"
            href="#top"
            aria-label="Amr Mohamed Taher, home"
          >
            <span className="brand-symbol" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </span>
            amr taher<span className="brand-dot">.</span>
          </a>
          <nav
            id="main-navigation"
            className={menuOpen ? "nav open" : "nav"}
            aria-label="Main navigation"
          >
            {navigation.map(({ href, label }, index) => (
              <a
                href={href}
                key={href}
                ref={index === 0 ? firstNavLink : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="mobile-contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk
            </a>
          </nav>
          <div className="header-actions">
            <a
              href={linkedIn}
              className="header-linkedin"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <button
              type="button"
              className="icon-button theme-button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <a className="header-contact" href="#contact">
              Let’s talk
            </a>
            <button
              type="button"
              className="icon-button menu-button"
              ref={menuButton}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-controls="main-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" ref={main} tabIndex={-1}>
        <section className="shell hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-introduction">
              <span className="hero-line"></span>Amr Mohamed Taher
            </div>
            <h1 id="hero-title">
              I build
              <br />
              intelligent
              <br />
              systems<span>.</span>
            </h1>
            <div className="hero-description">
              <p>
                AI engineer & robotics builder.
                <br /> Turning language, data, and sensors into things you can
                actually use.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#projects">
                  Explore my work
                </a>
                <a className="button text-button" href="#contact">
                  Get in touch <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="hero-profile">
            <figure className="portrait">
              <div className="portrait-bracket" aria-hidden="true"></div>
              <img
                src="/profile.jpg"
                alt="Amr Mohamed Taher"
                width="864"
                height="1184"
                fetchPriority="high"
              />
              <figcaption>
                <span>Based in Egypt</span>
                <span>Age {age}</span>
              </figcaption>
            </figure>
            <div className="profile-note">
              <span className="availability-dot"></span>Available for projects{" "}
              <a href={github} aria-label="Amr Mohamed Taher on GitHub">
                <Github size={21} />
              </a>
            </div>
          </div>
          <ul className="hero-bottom" aria-label="Top skills" role="list">
            {featuredSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>

        <section
          className="shell section about"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-intro reveal">
            <p className="section-label">The person behind the projects</p>
            <h2 id="about-title">
              Curious by nature.
              <br />
              Engineer by practice.
            </h2>
          </div>
          <div className="about-grid">
            <div className="about-story">
              <p>
                I’m Amr Mohamed Taher, an AI engineer and robotics team
                supervisor based in Egypt.
              </p>
              <p>
                I help product and research teams build prototypes they can
                test, from Arabic language tools to sensor-based automation. I
                like seeing how a prototype behaves with real inputs. I built an
                irrigation system that waters plants based on soil moisture and
                co-developed e3raab, which shows learners how each word
                functions in an Arabic sentence.
              </p>
              <p>
                I started by programming EV3 robots. My team placed first in the
                project category at Egypt’s FIRST LEGO League, and I’ve
                supervised the SCH Club robotics team at New Mansoura University
                since November 2024. I scored 99% in NTI’s machine learning
                training and 98% in the NTI/Huawei AI track.
              </p>
              <p>
                I work with Python, C++, and Git on projects in machine
                learning, deep learning, Arabic NLP, and robotics.{" "}
                <a href="#contact">Get in touch to discuss your project.</a>
              </p>
            </div>
            <aside className="about-aside">
              <div className="achievement">
                <Award size={26} />
                <strong>1st place</strong>
                <span>Project category, Egypt’s FIRST LEGO League</span>
              </div>
              <div className="education" id="education">
                <GraduationCap size={24} />
                <h3>New Mansoura University</h3>
                <p>
                  Artificial Intelligence Engineering
                  <br />
                  Faculty of Computer Science and Engineering
                </p>
              </div>
              <p className="about-languages">
                Arabic, native
                <br />
                English, fluent
              </p>
            </aside>
          </div>
          <div className="skills" id="skills">
            {skills.map(({ title, items }, index) => {
              const Icon = skillIcons[index];
              return (
                <div className="skill" key={title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{title}</h3>
                  <div className="tags">
                    {items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="shell section work"
          id="projects"
          aria-labelledby="work-title"
        >
          <div className="section-heading reveal">
            <div>
              <p className="section-label">Built to solve real problems</p>
              <h2 id="work-title">Ideas, put to work.</h2>
            </div>
            <p className="section-description">
              Explore the software and hardware
              <br />
              behind my experiments.
            </p>
          </div>
          <div className="project-tools">
            <div className="filters" role="group" aria-label="Filter projects">
              {categories.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  aria-pressed={category === filter}
                  onClick={() => {
                    setCategory(filter);
                    setShowAll(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="project-search" role="search" aria-label="Projects">
              <Search size={19} aria-hidden="true" />
              <input
                ref={searchInput}
                type="search"
                value={projectQuery}
                onChange={(event) => setProjectQuery(event.target.value)}
                aria-label="Search projects"
                placeholder="Search by project or skill"
              />
              {projectQuery && (
                <button
                  className="project-search-clear"
                  type="button"
                  aria-label="Clear project search"
                  onClick={() => {
                    setProjectQuery("");
                    searchInput.current?.focus();
                  }}
                >
                  <X size={17} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <p
            className={filtered.length ? "project-count" : "sr-only"}
            aria-live="polite"
            aria-atomic="true"
          >
            {visibleProjects.length < filtered.length
              ? `Showing ${visibleProjects.length} of ${filtered.length} projects`
              : `${filtered.length} ${filtered.length === 1 ? "project" : "projects"}`}
          </p>
          {visibleProjects.length ? (
            <div className="project-grid" key={category}>
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={project.id === "e3raab"}
                  open={() => setOverlay({ project })}
                />
              ))}
            </div>
          ) : (
            <div className="project-empty">
              <h3>No matching projects</h3>
              <p>Try a different skill or category.</p>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setCategory("All projects");
                  setProjectQuery("");
                  setShowAll(false);
                  searchInput.current?.focus();
                }}
              >
                Reset filters
              </button>
            </div>
          )}
          {!query && filtered.length > selectedProjectCount && (
            <div className="more-work">
              <button
                className="button secondary"
                type="button"
                aria-expanded={showAll}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? "Show selected projects"
                  : `Explore all ${filtered.length} projects`}
                <span aria-hidden="true">{showAll ? "−" : "+"}</span>
              </button>
            </div>
          )}
        </section>

        <section
          className="experience-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="shell section">
            <div className="section-heading reveal">
              <h2 id="experience-title">Experience</h2>
            </div>
            <article className="experience-entry">
              <div className="experience-role">
                <span className="experience-icon" aria-hidden="true">
                  <BriefcaseBusiness size={23} />
                </span>
                <div>
                  <h3>{experience.title}</h3>
                  <p>{experience.company}</p>
                </div>
              </div>
              <ul className="experience-dates" aria-label="Training periods" role="list">
                {experience.years.map((year) => (
                  <li key={year}>Summer {year}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section
          className="credentials-section"
          id="training"
          aria-labelledby="training-title"
        >
          <div className="shell section">
            <div className="section-heading reveal">
              <div>
                <p className="section-label">Always learning</p>
                <h2 id="training-title">Practice. Learn. Repeat.</h2>
              </div>
              <p className="section-description">
                Certificates in AI, machine learning, and technical tools.
              </p>
            </div>
            <Credentials open={(credential) => setOverlay({ credential })} />
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="shell contact-inner">
            <div className="reveal">
              <p className="section-label">Have something in mind?</p>
              <h2 id="contact-title">
                Let’s build
                <br />
                something useful.
              </h2>
            </div>
            <div className="contact-copy">
              <p>
                Get in touch about freelance work, collaborations, or a project
                you’d like to build.
              </p>
              <ul className="contact-links" aria-label="Contact details">
                <li>
                  <a href={`mailto:${email}`}>
                    <Mail size={19} aria-hidden="true" />
                    <span>{email}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${phone}`}>
                    <Phone size={19} aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                </li>
              </ul>
              <a className="button contact-button" href={github}>
                <Github size={20} /> Explore my GitHub
              </a>
              <button
                className="copy-link"
                type="button"
                onClick={copyPortfolio}
              >
                {copyState === "copied" ? (
                  <>
                    <Check size={16} /> Portfolio link copied
                  </>
                ) : (
                  "Copy portfolio link"
                )}
              </button>
              <p className="copy-status" role="status">
                {copyState === "error"
                  ? "Copy this address to share the portfolio — www.amrmohamed.site"
                  : copyState === "copied"
                    ? "Portfolio link copied to clipboard."
                    : ""}
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell site-footer">
        <a className="wordmark" href="#top">
          amr taher.
        </a>
        <span>© {new Date().getFullYear()} Amr Mohamed Taher</span>
        <a href="#top">Back to top</a>
      </footer>
      {overlay && (
        <DetailDialog
          overlay={overlay}
          projectNavigation={projectNavigation}
          onClose={() => setOverlay(null)}
        />
      )}
    </>
  );
}
