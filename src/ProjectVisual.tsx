import {
  Activity, Bot, CircuitBoard, Droplet, Flame, Route, ScanLine, Sprout, Zap,
} from 'lucide-react';
import type { Project } from './content';
import './project-visual.css';

const icons = {
  'exam-detector': ScanLine,
  ev3: Bot,
  'water-filter': Droplet,
  diabetes: Activity,
  vacuum: Route,
  helpbot: Flame,
  irrigation: Sprout,
  piezo: Zap,
};

const variants = {
  'AI & ML': 'analysis',
  Robotics: 'robotics',
  Hardware: 'hardware',
};

export default function ProjectVisual({ project }: { project: Project }) {
  if (project.id === 'e3raab') {
    return (
      <div className="project-visual project-visual--language" aria-hidden="true">
        <div className="project-visual__language-glow" />
        <div className="project-visual__language-grid" />
        <div className="project-visual__language-orbit" />
        <div className="project-visual__language-word" lang="ar" dir="rtl">إِعْرَاب</div>
        <div className="project-visual__language-roles" lang="ar" dir="rtl">
          <span>فِعْلٌ</span>
          <span>فَاعِلٌ</span>
          <span>مَفْعُولٌ بِهِ</span>
        </div>
      </div>
    );
  }

  const variant = variants[project.category];
  const Icon = icons[project.id as keyof typeof icons] ?? CircuitBoard;

  return (
    <div className={`project-visual project-visual--${variant}`} aria-hidden="true">
      <div className="project-visual__scene">
        <div className="project-visual__pattern">
          <span /><span /><span /><span /><span />
        </div>
        <div className="project-visual__icon">
          <Icon strokeWidth={1.55} />
        </div>
      </div>
    </div>
  );
}
