"use client";

import { useEffect, useRef, useState } from "react";

const dishuisms = [
  "how can youu?",
  "BAYBEEEE",
  "HEYYY?",
  "Bevvy gyal",
  "Chippy gyal",
  "hungee gyal",
  "I’M JUST A EEPY GYALL",
  "I’M JUST A STIMMY GYALL",
];

const photos = [
  { src: "./media/p01.webp", alt: "A heart made over a late-night video call", className: "wide" },
  { src: "./media/p02.webp", alt: "Dishu making a funny face at lunch", className: "tall" },
  { src: "./media/p03.webp", alt: "Dishu among flowers and old architecture", className: "wide" },
  { src: "./media/p04.webp", alt: "Dishu curled up at the airport", className: "tall" },
  { src: "./media/p05.webp", alt: "Dishu asleep beside Ronald McDonald", className: "tall" },
  { src: "./media/p06.webp", alt: "Dishu hanging out with three dogs", className: "wide" },
  { src: "./media/p07.webp", alt: "A quiet kiss at home", className: "wide" },
  { src: "./media/p08.webp", alt: "A candid moment in the car", className: "tall" },
  { src: "./media/p09.webp", alt: "A strip of photo-booth memories", className: "tall" },
  { src: "./media/p10.webp", alt: "A playful selfie together", className: "tall" },
  { src: "./media/p11.webp", alt: "Dishu wearing a tiny plush octopus", className: "tall" },
  { src: "./media/p12.webp", alt: "Dishu behind the wheel under colourful lights", className: "tall" },
  { src: "./media/p13.webp", alt: "Getting ready together in the mirror", className: "tall" },
  { src: "./media/p14.webp", alt: "Dishu asking a giant dog for a kiss", className: "tall" },
  { src: "./media/p15.webp", alt: "Dishu leaning against the M2", className: "tall" },
  { src: "./media/p16.webp", alt: "Dishu and her giant black dog", className: "tall" },
  { src: "./media/p17.webp", alt: "A shopping selfie after training", className: "tall" },
  { src: "./media/p18.webp", alt: "A golden mirror photo together", className: "wide" },
  { src: "./media/p19.webp", alt: "Dishu posing with her sleepy blue plush", className: "tall" },
  { src: "./media/p20.webp", alt: "A night out together", className: "tall" },
  { src: "./media/p21.webp", alt: "A matching floral photo together", className: "tall" },
  { src: "./media/p22.webp", alt: "A mirror selfie together", className: "tall" },
  { src: "./media/p23.webp", alt: "A sunny drive together", className: "wide" },
];

function Sparkles({ burst = false }: { burst?: boolean }) {
  const count = burst ? 34 : 18;
  return (
    <div className={`sparkles ${burst ? "sparkles--burst" : ""}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return (
          <i key={index} style={{
            "--i": index,
            "--x": `${Math.cos(angle) * 56}vw`,
            "--y": `${Math.sin(angle) * 56}vh`,
          } as React.CSSProperties} />
        );
      })}
    </div>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(-1);
  const [burst, setBurst] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!opened || lightbox !== null) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [lightbox, opened]);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScroll);
      }
    };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!opened) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((target) => target.classList.add("reveal-ready"));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    const frame = window.requestAnimationFrame(() => targets.forEach((target) => observer.observe(target)));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [opened]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (lightbox === null) return;
      if (event.key === "ArrowRight") setLightbox((lightbox + 1) % photos.length);
      if (event.key === "ArrowLeft") setLightbox((lightbox - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const celebrate = () => {
    setBurst(false);
    window.setTimeout(() => setBurst(true), 10);
    window.setTimeout(() => setBurst(false), 1500);
  };

  const cyclePhrase = () => {
    setPhraseIndex((phraseIndex + 1) % dishuisms.length);
    celebrate();
  };

  const openGift = () => {
    if (opening) return;
    setOpening(true);
    celebrate();
    window.setTimeout(() => setOpened(true), 1950);
    window.setTimeout(() => setOpening(false), 3200);
  };

  const finishSwipe = (endX: number) => {
    if (lightbox === null || touchStartX.current === null) return;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 45) return;
    setLightbox(distance < 0
      ? (lightbox + 1) % photos.length
      : (lightbox - 1 + photos.length) % photos.length);
  };

  return (
    <main>
      <div className={`scroll-progress ${opened ? "scroll-progress--visible" : ""}`} style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />

      <div className={`gift-gate ${opening ? "gift-gate--celebrating" : ""} ${opened ? "gift-gate--open" : ""}`} aria-hidden={opened}>
        <Sparkles />
        <div className="gift-card">
          <span className="mini-label">FOR DISHU · 23 TODAY</span>
          <div className="gift-number">23</div>
          <h1>A tiny birthday gift.</h1>
          <p>Best opened with full volume and absolutely no acting normal.</p>
          <button onClick={openGift} disabled={opening}>
            {opening ? "opening..." : "tap to unwrap"} <span aria-hidden="true">↗</span>
          </button>
        </div>
        {opening && (
          <div className="birthday-pop" role="status" aria-live="polite">
            <span className="birthday-pop__number">23</span>
            <p>THIS IS YOUR OFFICIAL BIRTHDAY NOTICE</p>
            <h2>HAPPY BIRTHDAY,<br /><em>DISHU!</em></h2>
            <span className="birthday-pop__kiss" aria-hidden="true">♡</span>
          </div>
        )}
      </div>

      {burst && <Sparkles burst />}

      <nav className={`top-nav ${scrolled ? "top-nav--scrolled" : ""}`} aria-label="Birthday page navigation">
        <a className="brand" href="#top" aria-label="Dishu 23">
          <span className="brand-letter">D</span><span className="brand-number">23</span>
        </a>
        <div className="nav-links">
          <a href="#film">the film</a>
          <a href="#field-guide">the lore</a>
          <a href="#memories">memories</a>
        </div>
        <span className="nav-pill">22 · 08 · 2026</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy" data-reveal="left">
          <p className="eyebrow"><span /> THE BIRTHDAY EDIT · VOL. 23</p>
          <h2><em>Happy Birthday,</em><br />Dishu Baby.</h2>
          <p className="hero-lede">Happy Birthday, Dishu Baby. I can’t believe you’re 23. My baby gyal is becoming a BIGGGG GYALLLL. No matter how old you get, you’ll always be my baby gyal. I tried my best to make this little thing for you, because a birthday card is like so lame and outdated Oh My Goshhh. I hope you like it :*</p>
          <div className="hero-actions">
            <a className="primary-button" href="#film">watch your birthday film <span>▶</span></a>
            <button className="text-button" onClick={cyclePhrase}>press for a Dishu-ism <span>↻</span></button>
          </div>
          <div className="phrase-display" aria-live="polite">{phraseIndex >= 0 ? `“${dishuisms[phraseIndex]}”` : ""}</div>
        </div>

        <div className="hero-collage" aria-label="A collage of birthday memories" data-reveal="scale">
          <div className="hero-photo hero-photo--one"><img src="./media/p11.webp" alt="Dishu with a plush octopus on her head" /></div>
          <div className="hero-photo hero-photo--two"><img src="./media/p18.webp" alt="Saketh and Dishu in a mirror" /></div>
          <div className="hero-photo hero-photo--three"><img src="./media/p09.webp" alt="Photo-booth pictures together" /></div>
          <span className="sticker sticker--pink">certified<br />cutie</span>
          <span className="sticker sticker--yellow">23!</span>
          <span className="scribble" aria-hidden="true">↝</span>
        </div>
      </section>

      <div className="ticker" aria-label="Dishu quotes">
        <div>
          {Array.from({ length: 2 }).flatMap((_, round) => dishuisms.map((phrase, index) => (
            <span key={`${round}-${index}`}>{phrase} <b>✦</b></span>
          )))}
        </div>
      </div>

      <section className="film-section" id="film">
        <div className="section-heading section-heading--light" data-reveal="up">
          <p>01 / THE MAIN EVENT</p>
          <h2>Twenty-nine seconds of<br /><em>us, basically.</em></h2>
        </div>
        <div className="film-layout" data-reveal="up">
          <div className="phone-frame">
            <div className="phone-speaker" />
            <video controls playsInline preload="auto" poster="./media/birthday-poster-v2.jpg">
              <source src="./media/birthday-montage-v3.mp4" type="video/mp4" />
              Your browser does not support MP4 video.
            </video>
          </div>
          <aside className="film-note">
            <span className="roundel">23</span>
            <p>Starring</p>
            <h3>Dishu as herself</h3>
            <p className="muted">Cutest thing on the planet. Questionable dancing. Very charming.</p>
            <div className="credits"><span>runtime</span><b>00:29</b><span>rating</span><b>∞ / 10</b></div>
          </aside>
        </div>
      </section>

      <section className="field-guide" id="field-guide">
        <div className="section-heading" data-reveal="up">
          <p>02 / ESSENTIAL RESEARCH</p>
          <h2>A very serious field guide<br />to <em>the Dishu multiverse.</em></h2>
        </div>
        <div className="guide-grid">
          <article className="guide-card guide-card--pink" data-reveal="up" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
            <div className="guide-image"><img src="./media/p04.webp" alt="Dishu curled up at an airport" /></div>
            <span className="guide-number">01</span>
            <h3>I’M JUST A<br />EEPY GYALL</h3>
            <p>Can nap absolutely anywhere. Airport furniture included.</p>
          </article>
          <article className="guide-card guide-card--cream" data-reveal="up" style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <div className="guide-image"><img src="./media/p17.webp" alt="Dishu in a training outfit" /></div>
            <span className="guide-number">02</span>
            <h3>I’M JUST A<br />STIMMY GYALL</h3>
            <p>Gets over-stimulated by the most random things.</p>
          </article>
          <article className="guide-card guide-card--yellow" data-reveal="up" style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
            <div className="guide-image"><img src="./media/p02.webp" alt="Dishu making a funny face" /></div>
            <span className="guide-number">03</span>
            <h3>how can<br />youu?</h3>
            <p>The official response to literally everything.</p>
          </article>
          <article className="guide-card guide-card--purple" data-reveal="up" style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>
            <div className="guide-image"><img src="./media/p07.webp" alt="A candid quiet moment together" /></div>
            <span className="guide-number">04</span>
            <h3>BAYBEEEE</h3>
            <p>For when one syllable simply will not do.</p>
          </article>
        </div>
        <div className="starter-pack" data-reveal="scale">
          <div className="starter-pack-copy">
            <span>THE ESSENTIALS</span>
            <h3>Dishu’s<br /><em>starter pack.</em></h3>
            <p>Two tiny Shih Tzus, one German Shepherd, the cars, football, ramen, coffee and just enough gym to get stimmy.</p>
          </div>
          <img src="./media/dishu-stickers-v2.png" alt="Cute stickers of two Shih Tzus, a German Shepherd, BMW and Mercedes cars, football, ramen, coffee and a dumbbell" />
        </div>
      </section>

      <section className="mini-films">
        <div className="mini-copy" data-reveal="up">
          <p>ALSO CAUGHT ON CAMERA</p>
          <h2>Just Dishu<br /><em>being Dishu.</em></h2>
          <p className="muted-dark">Five more pieces of evidence from the archives.</p>
        </div>
        <div className="mini-video-grid">
          <div className="mini-video-card" data-reveal="up" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
            <video controls playsInline preload="metadata" poster="./media/bowling-poster.jpg">
              <source src="./media/bowling-v2.mp4" type="video/mp4" />
              Your browser does not support MP4 video.
            </video>
            <div><span>Exhibit A</span><b>The bowling prodigy</b></div>
          </div>
          <div className="mini-video-card mini-video-card--landscape" data-reveal="up" style={{ "--reveal-delay": "70ms" } as React.CSSProperties}>
            <video controls playsInline preload="metadata" poster="./media/cab-poster.jpg">
              <source src="./media/cab-v2.mp4" type="video/mp4" />
              Your browser does not support MP4 video.
            </video>
            <div><span>Exhibit B</span><b>Cab confessions</b></div>
          </div>
          <div className="mini-video-card" data-reveal="up" style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>
            <video controls playsInline preload="metadata" poster="./media/off-road-poster.jpg">
              <source src="./media/off-road-era-v2.mp4" type="video/mp4" />
              Your browser does not support MP4 video.
            </video>
            <div><span>Exhibit C</span><b>Off-road era</b></div>
          </div>
          <div className="mini-video-card" data-reveal="up" style={{ "--reveal-delay": "210ms" } as React.CSSProperties}>
            <video controls playsInline preload="metadata" poster="./media/forest-poster.jpg">
              <source src="./media/forest-dispatch-v2.mp4" type="video/mp4" />
              Your browser does not support MP4 video.
            </video>
            <div><span>Exhibit D</span><b>Forest dispatch</b></div>
          </div>
          <div className="mini-video-card" data-reveal="up" style={{ "--reveal-delay": "280ms" } as React.CSSProperties}>
            <video controls playsInline preload="metadata" poster="./media/passenger-poster.jpg">
              <source src="./media/passenger-princess-v2.mp4" type="video/mp4" />
              Your browser does not support MP4 video.
            </video>
            <div><span>Exhibit E</span><b>Passenger princess duties</b></div>
          </div>
        </div>
      </section>

      <section className="memories" id="memories">
        <div className="section-heading memories-heading" data-reveal="up">
          <div>
            <p>03 / THE CAMERA ROLL</p>
            <h2>A few of<br /><em>my favourites.</em></h2>
          </div>
          <p className="gallery-intro">A lovingly curated archive of our relationship in a nutshell.</p>
        </div>
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <button className={`memory ${photo.className}`} key={photo.src} onClick={() => setLightbox(index)} aria-label={`Open photo ${index + 1}: ${photo.alt}`} data-reveal="up" style={{ "--reveal-delay": `${(index % 4) * 55}ms` } as React.CSSProperties}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="final-note">
        <div className="note-card" data-reveal="left">
          <p className="eyebrow"><span /> ONE LAST THING</p>
          <h2>For my favourite<br /><em>eepy baby gyal.</em></h2>
          <p>Happy 23rd Birthday, Dishu Baby. You are genuinely the best thing that has ever happened to me. No one brings as much happiness, chaos and unnecessary entertainment into my life as you do.</p>
          <p>Thank you for loving me through all my bullshit, caring for me unconditionally and putting so much time, effort and heart into us. You really are the sweetest gyal ever. I promise to do everything I can to make you the happiest gyal ever, no matter what.</p>
          <p>I can’t wait for more drives, bad photos, dogs, random side quests and all the completely ordinary moments that somehow become our favourites. I love you sm, baby gyal. ❤️</p>
          <p className="sign-off">Love you, Dishu Baby. <span>Saketh</span></p>
          <button className="celebrate-button" onClick={celebrate}>LOVE YOUUU! <span>♡</span></button>
        </div>
        <div className="final-photo" data-reveal="scale"><img src="./media/p18.webp" alt="Saketh and Dishu together" /><span>US, ALWAYS</span></div>
      </section>

      <footer><span>HAPPY 23RD, DISHU BABY</span><span>2026</span></footer>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightbox(null)} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo viewer">×</button>
          <button className="lightbox-arrow lightbox-arrow--left" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }} aria-label="Previous photo">←</button>
          <img src={photos[lightbox].src} alt={photos[lightbox].alt} onClick={(event) => event.stopPropagation()} />
          <button className="lightbox-arrow lightbox-arrow--right" onClick={(event) => { event.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }} aria-label="Next photo">→</button>
          <span className="lightbox-count">{lightbox + 1} / {photos.length}</span>
        </div>
      )}
    </main>
  );
}
