import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Cpu, BrainCircuit, GraduationCap, Award, Terminal, Code2, Sun, Moon, ShieldAlert, X } from 'lucide-react';

const Section = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10 ${className || ''}`}>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      {children}
    </motion.div>
  </section>
);

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } }
};

const textFadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const skillsData = [
  { name: "Machine Learning", value: 95, icon: <BrainCircuit className="w-5 h-5" /> },
  { name: "Robotics", value: 87, icon: <Cpu className="w-5 h-5" /> },
  { name: "Data Analysis", value: 73, icon: <Terminal className="w-5 h-5" /> },
  { name: "Deep Learning", value: 90, icon: <BrainCircuit className="w-5 h-5" /> },
  { name: "Neural Networks", value: 88, icon: <BrainCircuit className="w-5 h-5" /> },
  { name: "NLP", value: 92, icon: <Code2 className="w-5 h-5" /> },
  { name: "Computer Vision", value: 85, icon: <Code2 className="w-5 h-5" /> },
  { name: "Python", value: 95, icon: <Terminal className="w-5 h-5" /> },
  { name: "C++", value: 85, icon: <Terminal className="w-5 h-5" /> },
  { name: "SQL", value: 80, icon: <Terminal className="w-5 h-5" /> },
  { name: "Keras", value: 88, icon: <Code2 className="w-5 h-5" /> },
  { name: "PyTorch", value: 90, icon: <Code2 className="w-5 h-5" /> }
];

const trainings = [
  { title: "Machine Learning", issuer: "National Telecommunication Institute (NTI) & ITIDA", image: "/NTI.jpeg" },
  { title: "Artificial Intelligence (AI) Track", issuer: "NTI / Huawei Egyptian Talent Academy", image: "/NTI%202.jpeg" },
  { title: "Digital Egypt Pioneer (DEPI) - AI & ML", issuer: "Egyptian Ministry of Communications", image: "https://images.unsplash.com/photo-1620712948343-008423671ea2?q=80&w=800&auto=format&fit=crop" },
  { title: "Getting Started with Deep Learning", issuer: "NVIDIA", image: "/nvidia%20.jpeg" },
  { title: "Sprints x Microsoft Summer Camp - AI & ML", issuer: "Sprints | Microsoft", image: "/microsoft.jpeg" },
  { title: "Building LLM Applications With Prompt Engineering", issuer: "NVIDIA", image: "/nvidiaLLM.jpeg" },
  { title: "Transact SQL queries using SQL server", issuer: "Mahara-Tech / ITI Platform", image: "/WhatsApp%20Image%202026-03-05%20at%2017.35.46.jpeg" }
];

const projects = [
  {
    title: "e3raab.com",
    description: "A smart, automated grammatical analyzer designed specifically for the Arabic language. The project leverages artificial intelligence to perform I'rab, allowing users to input Arabic text and receive an immediate structural analysis of the sentences.",
    tags: ["AI", "NLP", "Arabic", "Machine Learning"]
  },
  {
    title: "Cheating Detector for Online Exams",
    description: "A machine learning and deep learning-based solution designed to detect cheating during online exams. Analyzes behavioral patterns, keystroke dynamics, and facial recognition.",
    tags: ["Machine Learning", "Deep Learning", "Computer Vision"]
  },
  {
    title: "Smart Water Filter",
    description: "Developed a smart filtration system that detects water quality in real-time and redirects unsafe water for irrigation.",
    tags: ["IoT", "Sensors", "Automation"]
  },
  {
    title: "Diabetes Prediction",
    description: "Developed a system that predicts the risk of diabetes based on medical data, helping in early diagnosis and prevention.",
    tags: ["Machine Learning", "Data Analysis"]
  },
  {
    title: "Electric Vacuum Cleaner with AI",
    description: "Integrated AI and machine learning into a vacuum cleaner, enabling it to autonomously navigate spaces and optimize cleaning efficiency.",
    tags: ["AI", "Robotics", "Automation"]
  },
  {
    title: "HelpBot",
    description: "A fully AI-powered robot designed to sense dangerous gases or flames. Automatically extinguishes flames and calls emergency services using a built-in SIM card.",
    tags: ["AI", "Robotics", "Hardware"]
  },
  {
    title: "Auto Irrigation System",
    description: "Created an automated irrigation system that uses sensors to monitor moisture levels and optimize water usage for plants.",
    tags: ["Automation", "Sensors"]
  },
  {
    title: "Piezoelectric Electric Generator",
    description: "Designed a generator that harnesses piezoelectric materials to generate electricity from pressure when a car drives over it.",
    tags: ["Hardware", "Energy"]
  },
  {
    title: "EV3 Robot",
    description: "Developed an EV3 robot that secured 1st place in Egypt’s FIRST LEGO League, showcasing my skills in programming and robotics.",
    tags: ["Robotics", "Programming", "Award Winner"]
  }
];

const SkillCard = ({ skill }: { skill: typeof skillsData[0] }) => {
  return (
    <motion.div 
      variants={itemVariant}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative border rounded-2xl p-5 transition-all duration-300 backdrop-blur-md overflow-hidden bg-white/40 dark:bg-white/5 border-zinc-200 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 shadow-lg group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-3 z-10">
        <div className="p-2 rounded-lg transition-colors bg-zinc-200 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {skill.icon}
        </div>
        <span className="font-semibold transition-colors text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
};

// Tech-Noir Particle Mesh Background
const DynamicBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
    {/* Grid Mesh */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />
    
    {/* Floating Orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
        x: [0, 80, 0],
        y: [0, 60, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen"
    />
    <motion.div
      animate={{
        scale: [1, 1.4, 1],
        opacity: [0.1, 0.2, 0.1],
        x: [0, -100, 0],
        y: [0, 80, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[150px] mix-blend-screen"
    />

    {/* Vignette Overlay */}
    <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-transparent to-zinc-50/80 dark:to-[#030303]/90" />
  </div>
);

export default function App() {
  const [isDark, setIsDark] = useState(true); // Default strictly to dark/tech-noir vibe
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen text-zinc-600 dark:text-zinc-400 font-sans selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-300">
      
      <DynamicBackground />

      <div className="relative z-10 font-sans">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/60 dark:bg-[#030303]/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-white/10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <span className="text-zinc-900 dark:text-zinc-100 font-bold tracking-[0.2em] uppercase text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              Amr.ai
            </span>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
              <a href="#about" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">/About</a>
              <a href="#skills" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">/Skills</a>
              <a href="#education" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">/Education</a>
              <a href="#projects" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">/Projects</a>
              <a href="#contact" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">/Contact</a>
              
              <div className="w-[1px] h-4 bg-zinc-300 dark:bg-white/20" />
              
              <button 
                onClick={() => setIsDark(!isDark)} 
                className="p-2 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/50 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-4 h-4 text-zinc-400 hover:text-zinc-100" /> : <Moon className="w-4 h-4 text-zinc-600 hover:text-zinc-900" />}
              </button>
            </div>
            
            {/* Mobile theme toggle */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsDark(!isDark)} 
                className="p-2 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/50 transition-all"
              >
                {isDark ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="flex flex-col gap-6 order-2 lg:order-1"
            >
              <motion.div variants={textFadeUpVariant} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-lg backdrop-blur-md w-fit">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-[0.15em]">Available for work</span>
              </motion.div>
              
              <motion.h1 variants={textFadeUpVariant} className="text-5xl md:text-7xl lg:text-8xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter leading-[1.05]">
                Amr Mohamed <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  Taher
                </span>
              </motion.h1>
              
              <motion.div variants={textFadeUpVariant} className="h-px w-24 bg-gradient-to-r from-emerald-500 to-transparent" />
              
              <motion.p variants={textFadeUpVariant} className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-light max-w-lg leading-relaxed">
                Artificial Intelligence Engineer <span className="text-emerald-500 opacity-50">&</span> Robotics Expert
              </motion.p>
              
              <motion.div variants={textFadeUpVariant} className="flex flex-wrap gap-5 mt-6">
                <a href="#contact" className="relative inline-flex h-14 items-center justify-center rounded-lg bg-emerald-500 px-8 py-3 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 focus:outline-none hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                  <span className="relative z-10 flex items-center gap-2 tracking-wide uppercase text-sm">Hire Me</span>
                </a>
                <a href="#projects" className="inline-flex h-14 items-center justify-center rounded-lg bg-white/40 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-8 py-3 text-sm font-semibold tracking-wide uppercase transition-all hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-500 backdrop-blur-md shadow-lg">
                  View work
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative mx-auto lg:ml-auto order-1 lg:order-2 mb-10 lg:mb-0"
            >
              {/* Continuous floating animation wrapper */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border border-zinc-200 dark:border-white/10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] ring-4 ring-emerald-500/20 p-2 backdrop-blur-3xl bg-white/10 dark:bg-black/20">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img 
                      src="/profile.jpg" 
                      alt="Amr Mohamed Taher" 
                      className="w-full h-full object-cover filter transition-all duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative elements static behind float */}
              <div className="absolute inset-0 z-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-[80px] animate-pulse" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
          </motion.div>
        </section>

        {/* Global Divider Pattern */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

        {/* About */}
        <Section id="about" className="relative">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4">
              <motion.div variants={textFadeUpVariant}>
                <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase mb-2 block">/* 01 */</span>
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">About<br/>Me.</h2>
              </motion.div>
            </div>
            <div className="md:col-span-8 space-y-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 font-light">
              <motion.p variants={itemVariant} className="pl-6 border-l-2 border-emerald-500/50 text-xl md:text-2xl text-zinc-900 dark:text-zinc-100 font-medium">
                I’m Amr Mohamed, an AI Engineer and Robotics Expert with a strong passion for artificial intelligence, data analysis, robotics, and cutting-edge technology.
              </motion.p>
              <motion.p variants={itemVariant}>
                With experience in multiple programming languages, including C++, Python, and AI frameworks, I specialize in building intelligent, efficient, and scalable systems.
              </motion.p>
              <motion.p variants={itemVariant}>
                My work spans AI-driven solutions, robotics applications, and automation, allowing me to tackle diverse challenges and deliver impactful innovations that push the boundaries of technology.
              </motion.p>
            </div>
          </div>
        </Section>

        {/* Global Divider Pattern */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

        {/* Skills */}
        <Section id="skills">
          <motion.div variants={textFadeUpVariant} className="mb-16">
            <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase mb-2 block">/* 02 */</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Technical Arsenal</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </Section>

        {/* Global Divider Pattern */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

        {/* Education */}
        <Section id="education">
          <motion.div variants={textFadeUpVariant} className="mb-16">
            <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase mb-2 block">/* 03 */</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Education</h2>
          </motion.div>

          <motion.div 
            variants={itemVariant}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-8 md:p-12 bg-white/40 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-[2rem] relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 backdrop-blur-xl"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-80" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors duration-700 pointer-events-none" />
            
            <GraduationCap className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">New Mansoura University (NMU)</h3>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 font-light">College of Computer Science and Engineering</p>
            
            <div className="mt-8 flex items-center gap-3 py-3 px-5 rounded-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/5 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <p className="text-zinc-700 dark:text-zinc-400 font-medium text-sm tracking-wide">
                Department of Artificial Intelligence Engineering
              </p>
            </div>
          </motion.div>
        </Section>

        {/* Global Divider Pattern */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

        {/* Training & Certifications */}
        <Section id="training">
          <motion.div variants={textFadeUpVariant} className="mb-16">
            <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase mb-2 block">/* 04 */</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Certifications & Training</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((training, i) => (
              <motion.div 
                key={i} 
                variants={itemVariant} 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedCert(training.image)}
                className="cursor-pointer p-3 bg-white/40 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-3xl flex flex-col hover:border-emerald-500/50 hover:bg-white/60 dark:hover:bg-white/[0.05] shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 group"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-zinc-200 dark:bg-[#030303] border border-zinc-200 dark:border-white/5">
                  {/* Note: Save your real certificates in the public folder (e.g., /certs/nti.jpg) and update the image path above! */}
                  <img src={training.image} alt={training.title} className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="px-3 pb-3 flex flex-col flex-grow">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{training.title}</h4>
                  <p className="text-xs font-mono tracking-wide text-zinc-500 dark:text-zinc-400 uppercase mt-auto opacity-70 group-hover:opacity-100 transition-opacity">{training.issuer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Global Divider Pattern */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

        {/* Projects */}
        <Section id="projects">
          <motion.div variants={textFadeUpVariant} className="mb-16">
            <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase mb-2 block">/* 05 */</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Professional Projects</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                variants={itemVariant}
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative p-8 bg-white/40 dark:bg-[#050505]/80 rounded-[2rem] border border-zinc-200 dark:border-white/5 hover:border-emerald-500/50 backdrop-blur-xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute -inset-px rounded-[2rem] border border-emerald-500/0 group-hover:border-emerald-500/30 transition-colors duration-500 pointer-events-none z-20" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-1 bg-emerald-500 rounded-full mb-6 group-hover:w-16 transition-all duration-500 shadow-[0_0_10px_#10b981]" />
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-10 flex-grow leading-relaxed font-light">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono tracking-wide px-3 py-1.5 bg-zinc-100 dark:bg-white/5 rounded-lg text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 group-hover:border-emerald-500/30 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Global Divider Pattern */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

        {/* Contact (Freelance Compliant) */}
        <Section id="contact" className="min-h-[60vh] flex flex-col justify-center">
          <motion.div variants={textFadeUpVariant} className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-emerald-500 font-mono text-sm tracking-wider uppercase mb-2 block">/* 06 */</span>
            <h2 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-12">Let's Work Together</h2>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative group p-1 bg-gradient-to-b from-emerald-500/30 to-transparent rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/80 backdrop-blur-3xl" />
              <div className="relative p-10 md:p-16 border border-zinc-200 dark:border-white/10 rounded-[2rem] bg-zinc-50/50 dark:bg-[#030303]/90 flex flex-col items-center">
                
                <div className="p-4 rounded-full bg-emerald-500/10 mb-8 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <ShieldAlert className="w-10 h-10 text-emerald-500" />
                </div>
                
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">Platform Booking</h3>
                
                <p className="text-zinc-600 dark:text-zinc-400 mb-12 text-lg leading-relaxed max-w-xl font-light">
                  Due to platform policies, please contact me directly through the messaging system of the freelance platform where you found my profile.
                </p>
                
                <button className="relative inline-flex h-16 w-full sm:w-auto active:scale-95 items-center justify-center rounded-xl bg-emerald-500 px-10 py-3 font-bold text-zinc-950 transition-all hover:bg-emerald-400 focus:outline-none shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] overflow-hidden group/btn">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-xl opacity-30 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
                  <span className="relative uppercase tracking-widest text-sm flex items-center gap-3">
                    [ Message Me on Platform ]
                  </span>
                </button>
              </div>
            </motion.div>

          </motion.div>
        </Section>

        {/* Footer */}
        <footer className="py-12 text-center text-sm font-mono tracking-wider text-zinc-500 border-t border-zinc-200 dark:border-white/5 transition-colors duration-300 relative z-10 backdrop-blur-md bg-white/20 dark:bg-black/20">
          <p>SYSTEM.EXIT(0); /* © {new Date().getFullYear()} Amr Mohamed Taher. All rights reserved. */</p>
        </footer>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-gradient-to-br from-zinc-900 to-black p-1 border border-emerald-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-emerald-500/80 text-white rounded-full backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-full h-full bg-[#030303] rounded-xl flex items-center justify-center p-2 overflow-hidden max-h-[calc(90vh-8px)]">
                <img 
                  src={selectedCert} 
                  alt="Certificate Full View" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
