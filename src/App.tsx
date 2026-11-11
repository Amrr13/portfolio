import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowUp, ArrowUpRight, Award, Binary,
  CircuitBoard, Code2, Cpu, GraduationCap, Menu, Moon, ScanLine, Sun, X,
} from 'lucide-react';
import { age, categories, credentials, github, projects, skills } from './content';
import type { Category, Credential, Project } from './content';

const navigation = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Training', href: '#training' },
];

const projectIcons = { 'AI & ML': Binary, Robotics: Cpu, Hardware: CircuitBoard };
const skillIcons = [ScanLine, Code2, Cpu];

const arabicExample = [
  { word: 'قَرَأَ', role: 'Verb', explanation: 'Past-tense verb meaning “read.”' },
  { word: 'الطَّالِبُ', role: 'Subject', explanation: '“The student” is the subject performing the action.' },
  { word: 'الكِتَابَ', role: 'Direct object', explanation: '“The book” is the object being read.' },
];

type Overlay = { project: Project } | { credential: Credential };

function ArabicExample() {
  const [activeWord, setActiveWord] = useState(0);
  const { role, explanation } = arabicExample[activeWord];

  return (
    <div className="example">
      <h3>Explore a sample sentence</h3>
      <div className="example-words" lang="ar" dir="rtl">
        {arabicExample.map(({ word }, index) => (
          <button key={word} type="button" aria-pressed={activeWord === index} onClick={() => setActiveWord(index)}>
            {word}
          </button>
        ))}
      </div>
      <p aria-live="polite"><strong>{role}</strong> · {explanation}</p>
    </div>
  );
}

function DetailDialog({ overlay, onClose }: { overlay: Overlay; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  const project = 'project' in overlay ? overlay.project : null;
  const credential = 'credential' in overlay ? overlay.credential : null;

  function closeDialog() {
    dialog.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      className={credential ? 'detail-dialog certificate-dialog' : 'detail-dialog'}
      aria-labelledby="detail-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <div className="detail-inner">
        <button type="button" className="icon-button close-dialog" autoFocus aria-label="Close details" onClick={closeDialog}>
          <X size={20} />
        </button>
        <p className="eyebrow">{project?.category ?? credential?.issuer}</p>
        <h2 id="detail-title">{project?.title ?? credential?.title}</h2>
        {project && (
          <>
            <p className="detail-description">{project.detail}</p>
            <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            {project.id === 'e3raab' && <ArabicExample />}
            {project.website && <a className="button primary detail-website" href={project.website}>Open e3raab.com <ArrowUpRight size={18} /></a>}
          </>
        )}
        {credential?.image && (
          imageUnavailable
            ? <p role="status">This certificate image could not be loaded.</p>
            : <img className="certificate-image" src={credential.image} alt={`Certificate for ${credential.title}`} onError={() => setImageUnavailable(true)} />
        )}
      </div>
    </dialog>
  );
}

function ProjectCard({ project, open }: { project: Project; open: () => void }) {
  const isFeatured = project.id === 'e3raab';
  const Icon = projectIcons[project.category];

  return (
    <article className={isFeatured ? 'project-card featured' : 'project-card'}>
      {isFeatured && (
        <div className="project-art" aria-hidden="true">
          <span className="art-label">Arabic language processing</span>
          <span className="art-word" lang="ar" dir="rtl">إِعْرَاب</span>
          <div className="art-syntax" lang="ar" dir="rtl"><span>فِعْلٌ</span><span>فَاعِلٌ</span><span>مَفْعُولٌ بِهِ</span></div>
        </div>
      )}
      <div className="project-content">
        <div className="project-meta">
          <span className="project-icon"><Icon size={20} aria-hidden="true" /></span>
          <span className="eyebrow">{project.category}</span>
        </div>
        <h3><button type="button" onClick={open} className="project-link">{project.title}</button></h3>
        <p>{project.summary}</p>
        <div className="project-bottom">
          <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <span className="project-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<Category>('All projects');
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstNavLink = useRef<HTMLAnchorElement>(null);
  const filtered = category === 'All projects' ? projects : projects.filter((project) => project.category === category);

  useEffect(() => {
    if (menuOpen) firstNavLink.current?.focus();
  }, [menuOpen]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch {
      // The current page can still change theme when storage is unavailable.
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="shell header-inner" onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }}>
          <a className="wordmark" href="#top" aria-label="Amr Mohamed Taher, home">
            <span className="monogram" aria-hidden="true">AM</span>
            <span>Amr Mohamed<span className="wordmark-dot">.</span></span>
          </a>
          <nav id="main-navigation" className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
            {navigation.map(({ href, label }, index) => (
              <a href={href} key={href} ref={index === 0 ? firstNavLink : undefined} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <a className="mobile-contact" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-button theme-button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a className="header-contact" href="#contact">Get in touch <ArrowUpRight size={16} /></a>
            <button type="button" className="icon-button menu-button" ref={menuButton} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="shell hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-role"><span></span> AI engineering & robotics</p>
            <h1 id="hero-title">Amr Mohamed<br /><span>Taher<span className="hero-period">.</span></span></h1>
            <p className="hero-intro">I build machine learning tools for Arabic and experiment with robots that can sense and navigate their surroundings.</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">Explore my work <ArrowDownRight size={19} /></a>
              <a className="button secondary" href={github}>GitHub <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <figure className="hero-portrait">
            <div className="portrait-frame">
              <div className="portrait-corner top-left"></div>
              <div className="portrait-corner bottom-right"></div>
              <img src="/profile.jpg" alt="Amr Mohamed Taher" width="864" height="1184" fetchPriority="high" />
            </div>
            <figcaption><span>Egypt · Age {age}</span><span>Available for work <i></i></span></figcaption>
          </figure>
        </section>

        <section className="shell section work" id="projects" aria-labelledby="work-title">
          <div className="section-top">
            <h2 id="work-title">Selected work<span>.</span></h2>
            <div className="filters" role="group" aria-label="Filter projects">
              {categories.map((filter) => (
                <button type="button" key={filter} aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}</button>
              ))}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">{filtered.length} projects shown</p>
          <div className="project-grid">
            {filtered.map((project) => <ProjectCard key={project.id} project={project} open={() => setOverlay({ project })} />)}
          </div>
        </section>

        <section className="shell section about" id="about" aria-labelledby="about-title">
          <div className="section-top"><h2 id="about-title">About me<span>.</span></h2></div>
          <div className="about-grid">
            <div className="about-story">
              <p>I’m Amr, a {age}-year-old AI engineering student in Egypt.</p>
              <p>My projects range from parsing Arabic sentences to building sensor-based systems for water filtration and irrigation. I work with Python and C++ across software and hardware projects.</p>
            </div>
            <div className="education" id="education">
              <GraduationCap size={26} aria-hidden="true" />
              <p className="eyebrow">Education</p>
              <h3>New Mansoura University</h3>
              <p>Department of Artificial Intelligence Engineering</p>
              <p>College of Computer Science and Engineering</p>
            </div>
          </div>
          <div id="skills" className="skills">
            {skills.map(({ title, items }, index) => {
              const Icon = skillIcons[index];
              return (
                <div className="skill" key={title}>
                  <Icon size={23} aria-hidden="true" />
                  <h3>{title}</h3>
                  <div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="shell section training" id="training" aria-labelledby="training-title">
          <div className="section-top"><h2 id="training-title">Training & credentials<span>.</span></h2></div>
          <ul className="credential-list">
            {credentials.map((credential) => (
              <li key={credential.title} className="credential">
                <span className="credential-icon"><Award size={22} aria-hidden="true" /></span>
                <div><h3>{credential.title}</h3><p>{credential.issuer}</p></div>
                {credential.image && (
                  <button type="button" className="credential-action" aria-label={`View certificate for ${credential.title}`} onClick={() => setOverlay({ credential })}>
                    <span>View certificate</span><ArrowUpRight size={18} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="shell section contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-panel">
            <div>
              <h2 id="contact-title">Let’s work together.</h2>
              <p>For freelance inquiries, send me a message through the platform where you found my profile.</p>
            </div>
            <a className="button contact-button" href={github}>Find me on GitHub <ArrowUpRight size={19} /></a>
          </div>
        </section>
      </main>

      <footer className="shell site-footer">
        <span>© {new Date().getFullYear()} Amr Mohamed Taher</span>
        <a href="#top">Back to top <ArrowUp size={17} /></a>
      </footer>
      {overlay && <DetailDialog overlay={overlay} onClose={() => setOverlay(null)} />}
    </>
  );
}
