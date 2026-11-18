import {
  Activity,
  Bot,
  Cpu,
  Droplet,
  Flame,
  Sprout,
  UserRound,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "./content";
import "./project-visual.css";

function Circuit({ children }: { children: ReactNode }) {
  return (
    <div className="pv-circuit">
      <span className="pv-wire pv-wire--one" />
      <span className="pv-wire pv-wire--two" />
      <span className="pv-wire pv-wire--three" />
      <div className="pv-chip">{children}</div>
      <i className="pv-sensor pv-sensor--one" />
      <i className="pv-sensor pv-sensor--two" />
      <i className="pv-sensor pv-sensor--three" />
    </div>
  );
}

const scenes: Record<string, ReactNode> = {
  e3raab: (
    <div className="pv-language" lang="ar" dir="rtl">
      <span className="pv-language__mark" />
      <span className="pv-language__word">إِعْرَاب</span>
      <div className="pv-language__sentence">
        <span>قَرَأَ</span>
        <span>الطَّالِبُ</span>
        <span>الكِتَابَ</span>
      </div>
    </div>
  ),
  "exam-detector": (
    <div className="pv-recognition">
      <div className="pv-face">
        <UserRound strokeWidth={1.25} />
      </div>
      <div className="pv-scan-frame">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="pv-scan-line" />
      <span className="pv-recognition__point" />
    </div>
  ),
  ev3: (
    <div className="pv-robot-scene">
      <div className="pv-robot-route" />
      <div className="pv-robot">
        <Bot strokeWidth={1.6} />
      </div>
      <div className="pv-route-end" />
    </div>
  ),
  "water-filter": (
    <Circuit>
      <Droplet strokeWidth={1.7} />
    </Circuit>
  ),
  diabetes: (
    <div className="pv-health">
      <div className="pv-health__disc">
        <Activity strokeWidth={1.6} />
      </div>
      <div className="pv-health__bars">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  ),
  vacuum: (
    <div className="pv-vacuum-scene">
      <div className="pv-vacuum-route" />
      <div className="pv-vacuum">
        <span />
        <i />
      </div>
      <span className="pv-vacuum-obstacle" />
    </div>
  ),
  helpbot: (
    <div className="pv-helpbot">
      <div className="pv-helpbot__robot">
        <Bot strokeWidth={1.6} />
      </div>
      <span className="pv-helpbot__signal" />
      <div className="pv-helpbot__flame">
        <Flame strokeWidth={1.7} />
      </div>
    </div>
  ),
  irrigation: (
    <Circuit>
      <Sprout strokeWidth={1.7} />
    </Circuit>
  ),
  piezo: (
    <div className="pv-energy">
      <span className="pv-energy__plate pv-energy__plate--bottom" />
      <span className="pv-energy__plate pv-energy__plate--middle" />
      <span className="pv-energy__plate pv-energy__plate--top" />
      <Zap className="pv-energy__bolt" strokeWidth={1.6} />
    </div>
  ),
};

export default function ProjectVisual({ project }: { project: Project }) {
  return (
    <div
      className={`project-visual project-visual--${project.id}`}
      aria-hidden="true"
    >
      {scenes[project.id] ?? (
        <Circuit>
          <Cpu strokeWidth={1.7} />
        </Circuit>
      )}
    </div>
  );
}
