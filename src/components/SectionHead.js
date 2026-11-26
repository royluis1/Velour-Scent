import SplitText from './SplitText';

export default function SectionHead({ eyebrow, title }) {
  return (
    <div className="section-head">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2><SplitText text={title} /></h2>
    </div>
  );
}
