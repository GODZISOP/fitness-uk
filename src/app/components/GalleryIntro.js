export default function GalleryIntro() {
  return (
    <section className="gallery-intro-section">
      <div 
        className="intro-content"
        data-aos="fade-up"
      >
        <span className="intro-label">SCROLL EXPERIENCE</span>
        <h2 className="intro-heading">
          <span className="heading-regular">Sticky</span><br/>
          <span className="heading-italic">Horizontal</span>
        </h2>
        <p className="intro-paragraph">
          A demonstration of robust GSAP ScrollTrigger integration with React. Scroll down to lock the viewport and explore the gallery horizontally.
        </p>
        
        <div className="scroll-icon bounce-anim">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="var(--color-deep-navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 5L12 10L17 5" stroke="var(--color-deep-navy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
