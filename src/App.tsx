import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import {
  ArrowDownRight, ArrowUp, ArrowUpRight, Award, Binary,
  Code2, Cpu, FileText, Github, GraduationCap, Menu, Moon, ScanLine,
  Sparkles, Sun, X,
} from 'lucide-react';
import { age, categories, credentials, github, projects, skills } from './content';
import type { Category, Credential, Project } from './content';
import ProjectVisual from './ProjectVisual';

const navigation = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Credentials', href: '#training' },
];

const skillIcons = [ScanLine, Code2, Cpu];

const arabicExamples = [
  {
    label: 'Read a book',
    words: [
      { text: 'قَرَأَ', role: 'Verb', explanation: 'A past-tense verb meaning “read.”' },
      { text: 'الطَّالِبُ', role: 'Subject', explanation: 'The student performs the action.' },
      { text: 'الكِتَابَ', role: 'Direct object', explanation: 'The book is what the student read.' },
    ],
  },
  {
    label: 'A clear sky',
    words: [
      { text: 'السَّمَاءُ', role: 'Subject', explanation: 'The sky is the topic of this nominal sentence.' },
      { text: 'صَافِيَةٌ', role: 'Predicate', explanation: 'The word “clear” tells us what the sky is like.' },
    ],
  },
  {
    label: 'Wrote a letter',
    words: [
      { text: 'كَتَبَتْ', role: 'Verb', explanation: 'A past-tense verb meaning “she wrote.”' },
      { text: 'مَرْيَمُ', role: 'Subject', explanation: 'Maryam is the person who wrote.' },
      { text: 'رِسَالَةً', role: 'Direct object', explanation: 'The letter is what Maryam wrote.' },
    ],
  },
];

type Overlay = { project: Project } | { credential: Credential };

function ArabicExample() {
  const [activeExample, setActiveExample] = useState(0);
  const [activeWord, setActiveWord] = useState(0);
  const { words } = arabicExamples[activeExample];
  const { role, explanation } = words[activeWord];

  return (
    <div className="example">
      <div className="example-head">
        <Sparkles size={18} aria-hidden="true" />
        <h3>Try a sample sentence</h3>
      </div>
      <div className="example-options" role="group" aria-label="Choose a sample sentence">
        {arabicExamples.map(({ label }, index) => (
          <button key={label} type="button" aria-pressed={activeExample === index} onClick={() => {
            setActiveExample(index);
            setActiveWord(0);
          }}>
            {label}
          </button>
        ))}
      </div>
      <p className="example-hint">Select a word to see its grammatical role.</p>
      <div className="example-words" lang="ar" dir="rtl">
        {words.map(({ text }, index) => (
          <button key={text} type="button" aria-pressed={activeWord === index} onClick={() => setActiveWord(index)}>
            {text}
          </button>
        ))}
      </div>
      <div className="example-result" aria-live="polite">
        <div key={`${activeExample}-${activeWord}`}><strong>{role}</strong><p>{explanation}</p></div>
      </div>
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
        {credential?.period && <p className="detail-period">{credential.period}</p>}
        {project && (
          <>
            <p className="detail-description">{project.detail}</p>
            <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            {project.id === 'e3raab' && <ArabicExample />}
            {project.website && <a className="button primary detail-website" href={project.website}>Open live project <ArrowUpRight size={18} /></a>}
          </>
        )}
        {credential?.pdf && (
          <a className="button primary detail-website" href={credential.pdf} target="_blank" rel="noopener noreferrer">
            <FileText size={17} /> Open certificate PDF <ArrowUpRight size={17} />
          </a>
        )}
        {credential?.image && (
          imageUnavailable
            ? <p className="detail-description" role="status">This certificate image could not be loaded.</p>
            : <img className="certificate-image" src={credential.image} alt={`Certificate for ${credential.title}`} onError={() => setImageUnavailable(true)} />
        )}
      </div>
    </dialog>
  );
}

function ProjectCard({ project, open }: { project: Project; open: () => void }) {
  const isFeatured = project.id === 'e3raab';

  return (
    <article className={isFeatured ? 'project-card featured' : 'project-card'}>
      <ProjectVisual project={project} />
      <div className="project-content">
        <p className="eyebrow project-category">{project.category}</p>
        <h3><button type="button" onClick={open} className="project-link">{project.title}</button></h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-bottom">
          <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <span className="project-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </div>
      </div>
    </article>
  );
}

function Portrait() {
  function moveLight(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty('--light-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    target.style.setProperty('--light-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  }

  return (
    <figure className="hero-portrait hero-enter" onPointerMove={moveLight} onPointerLeave={(event) => {
      event.currentTarget.style.removeProperty('--light-x');
      event.currentTarget.style.removeProperty('--light-y');
    }}>
      <div className="portrait-scene">
        <div className="portrait-grid" aria-hidden="true"></div>
        <div className="orbit orbit-one" aria-hidden="true"></div>
        <div className="orbit orbit-two" aria-hidden="true"></div>
        <div className="orbit orbit-three" aria-hidden="true"></div>
        <Sparkles className="portrait-spark" size={38} aria-hidden="true" />
        <div className="portrait-frame">
          <img src="/profile.jpg" alt="Amr Mohamed Taher" width="864" height="1184" fetchPriority="high" />
        </div>
        <span className="scene-mark" aria-hidden="true"><Binary size={21} /></span>
      </div>
      <figcaption>
        <span>Egypt · Age {age}</span>
        <span><i></i> Available for work</span>
      </figcaption>
    </figure>
  );
}

function Credentials({ open }: { open: (credential: Credential) => void }) {
  const featured = credentials.find(({ pdf, image }) => pdf && image);
  const remaining = credentials.filter((credential) => credential !== featured);

  return (
    <>
      {featured && (
        <article className="credential-feature">
          <div className="credential-preview">
            <img src={featured.image} alt="" loading="lazy" />
          </div>
          <div className="credential-copy">
            <p className="eyebrow"><Award size={17} aria-hidden="true" /> Featured certificate</p>
            <h3>{featured.title}</h3>
            <p>{featured.issuer}</p>
            {featured.period && <p className="credential-period">{featured.period}</p>}
            <button className="button primary" type="button" onClick={() => open(featured)}>
              View DEPI certificate <ArrowUpRight size={18} />
            </button>
          </div>
        </article>
      )}
      <ul className="credential-list">
        {remaining.map((credential) => (
          <li key={credential.title} className="credential">
            <span className="credential-icon"><Award size={20} aria-hidden="true" /></span>
            <div><h3>{credential.title}</h3><p>{credential.issuer}</p></div>
            {credential.image && (
              <button type="button" className="credential-action" aria-label={`View certificate for ${credential.title}`} onClick={() => open(credential)}>
                <ArrowUpRight size={19} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
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
  const featuredProject = projects[0];

  useEffect(() => {
    if (menuOpen) firstNavLink.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('has-entered');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -32px', threshold: 0.1 });
    for (const element of document.querySelectorAll('[data-reveal]')) observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
            <span>Amr Taher</span>
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
        <section className="hero-wrap" id="top" aria-labelledby="hero-title">
          <div className="shell hero">
            <div className="hero-copy">
              <p className="eyebrow hero-role hero-enter"><span></span> AI engineering & robotics</p>
              <h1 id="hero-title" className="hero-enter">Amr Mohamed<br /><span>Taher.</span></h1>
              <p className="hero-intro hero-enter">I build machine learning tools for Arabic and robots that can sense and navigate their surroundings.</p>
              <div className="hero-actions hero-enter">
                <a className="button primary" href="#projects">Explore projects <ArrowDownRight size={19} /></a>
                <button className="button secondary" type="button" onClick={() => setOverlay({ project: featuredProject })}>
                  <Sparkles size={18} /> Try the Arabic NLP demo
                </button>
              </div>
            </div>
            <Portrait />
          </div>
        </section>

        <section className="shell section work" id="projects" aria-labelledby="work-title">
          <div className="section-top">
            <h2 id="work-title" data-reveal>Selected projects</h2>
            <div className="filters" role="group" aria-label="Filter projects">
              {categories.map((filter) => (
                <button type="button" key={filter} aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}</button>
              ))}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">{filtered.length} projects shown</p>
          <div className="project-grid" key={category}>
            {filtered.map((project) => <ProjectCard key={project.id} project={project} open={() => setOverlay({ project })} />)}
          </div>
        </section>

        <section className="shell section about" id="about" aria-labelledby="about-title">
          <div className="section-top"><h2 id="about-title" data-reveal>About me</h2></div>
          <div className="about-grid">
            <div className="about-story" data-reveal>
              <p>I’m Amr, a {age}-year-old AI engineering student in Egypt.</p>
              <p>My projects range from parsing Arabic sentences to building sensor-based systems for water filtration and irrigation. I work with Python and C++ across software and hardware projects.</p>
            </div>
            <div className="education" id="education" data-reveal>
              <GraduationCap size={26} aria-hidden="true" />
              <p className="eyebrow">Education</p>
              <h3>New Mansoura University</h3>
              <p>Department of Artificial Intelligence Engineering</p>
              <p>College of Computer Science and Engineering</p>
            </div>
          </div>
          <div id="skills" className="skills" data-reveal>
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
          <div className="section-top"><h2 id="training-title" data-reveal>Training & credentials</h2></div>
          <Credentials open={(credential) => setOverlay({ credential })} />
        </section>

        <section className="shell section contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-panel" data-reveal>
            <div>
              <h2 id="contact-title">Let’s work together.</h2>
              <p>For freelance inquiries, send me a message through the platform where you found my profile.</p>
            </div>
            <a className="button contact-button" href={github}><Github size={19} /> Find me on GitHub <ArrowUpRight size={19} /></a>
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
