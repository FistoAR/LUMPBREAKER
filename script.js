// console.clear();

// model viewer - normal and function view code
const mP = {model: r_("modelViewer"), normal: r_("normalButton"), function: r_("functionButton")};

function r_(text) {
  return document.getElementById(text);
}

mP.function.addEventListener("click", ()=> {
  setAnimationPlayState(true);
});

mP.normal.addEventListener("click", ()=>{
  setAnimationPlayState(false);
});

function setAnimationPlayState(shouldPlay) {
  if (!mP.model) return;

  mP.model.currentTime = 0; // start from beginning
  if (shouldPlay) {
    mP.model.play();
  } else {
    mP.model.pause();
  }
}

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, ScrollToPlugin);
ScrollSmoother.create({
  effects: true,
  smooth: 3,
});

const cont = document.querySelector(".panel-container");
const panel = gsap.utils.toArray(".panel-container .panel");

const horizontalTween = gsap.to(panel, {
  x: () => -1 * (cont.scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".panel-container",
    pin: true,
    start: "top top",
    anticipatePin: 1,
    scrub: 1,
    end: () => "+=" + (cont.scrollWidth - innerWidth),
    invalidateOnRefresh: true,
  },
});

// Set initial state - all polygons invisible
gsap.set(".poly-group-arrows polygon", { opacity: 0 });

// Create timeline for the wave effect
const polyTimeline = gsap.timeline({ repeat: -1 });

// Animate in from left to right
polyTimeline
  .to(".poly-group-arrows polygon", {
    opacity: 1,
    duration: 0.3,
    stagger: 0.1,
    ease: "power2.inOut",
  })
  // Animate out from left to right
  .to(
    ".poly-group-arrows polygon",
    {
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: "power2.inOut",
    },
    "+=0.5"
  ); // Wait 0.5 seconds before fading out

document.fonts.ready.then(() => {
  gsap.set("#quote", { opacity: 1 });

  const split = SplitText.create("#quote", {
    type: "words",
  });

  gsap.from(split.words, {
    scale: "random(0, 0.5)",
    rotation: "random(-60, 60)",
    opacity: 0,
    duration: 1,
    stagger: {
      from: "random",
      amount: 1,
    },
    scrollTrigger: {
      trigger: "#quote",
      start: "top 70%",
      toggleActions: "play none none reverse",
      markers: false,
    },
  });
});

ScrollTrigger.create({
  trigger: "#quote",
  start: "center center",
  end: "500%",
  pin: true,
  markers: false,
});

// wheel code

gsap.registerPlugin(ScrollTrigger);

const images = gsap.utils.toArray("img.wheel-item");
const paneTexts = gsap.utils.toArray(".wheel-content .text-block");
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#wheelSection",
    start: "top top",
    end: "+=200%",
    pin: true,
    scrub: 1,
    // snap: {
    //   snapTo: 1 / images.length,
    //   duration: 0.3,
    //   delay: 0,
    //   ease: "power1.inOut",
    // },
    markers: false,
  }
});

ScrollTrigger.create({
  trigger: "#wheelSection",
  start: "top top",
  end: "+=200%",
  scrub: true,
  onRelease: (self) => {
    if (isProgrammaticScroll) return;

    const step = 1 / images.length;
    const progress = tl.progress();
    const closestIndex = Math.round(progress / step);

    const targetProgress = (closestIndex + 0.5) * step;
    const startPx = tl.scrollTrigger.start || 0;
    const endPx = tl.scrollTrigger.end || startPx;
    const scrollPos = startPx + targetProgress * (endPx - startPx);

    gsap.to(window, {
      scrollTo: scrollPos,
      duration: 0.6,
      ease: "power2.out"
    });
  }
});

let wheelST = tl.scrollTrigger;

images.forEach((img, i) => {
  const text = paneTexts[i];

  tl.set(img, { scale: 1, display: "block", opacity: 1, visibility: "visible" }) // show instantly
    .set(text, { display: "block", opacity: 1, visibility: "visible" }, "<") // show text instantly
    .to({}, { duration: 0.5 }) // pause so it stays visible for scroll
    .set(text, { display: "none", opacity: 0, visibility: "hidden" }) // instantly hide text
    .set(img, { display: "none", opacity: 0, visibility: "hidden" }); // instantly hide image
});

// -------------------------------------------------------------------------------

// gsap.registerPlugin(ScrollTrigger);

// Pin first section
ScrollTrigger.create({
  trigger: ".static-1",
  start: "top top",
  end: "bottom top", // adjust how long it stays pinned
  pin: true,
  pinSpacing: true,
});


ScrollTrigger.create({
  trigger: "#model-section2",
  id: "modelviewTrigger",
  start: "top top",
  end: "+=" + window.innerHeight,  // pin for one full viewport
  pin: true,
  pinSpacing: true,
});

// Pin video section
ScrollTrigger.create({
  trigger: "#videoSection",
  id: "videoSectionTrigger",
  start: "top top",
  end: "+=" + window.innerHeight,
  pin: true,
  pinSpacing: true,
});

// Pin FAQ section
ScrollTrigger.create({
  trigger: "#FAQ_section",
  id: "faqTrigger",
  start: "top top",
  end: "+=" + window.innerHeight,
  pin: true,
  pinSpacing: true,
});


// --- Put this after `tl` is created (so tl.scrollTrigger exists) ---
// const wheelST = tl && tl.scrollTrigger ? tl.scrollTrigger : null;
let isProgrammaticScroll = false;
const wheelValues = ["features", "optionalfeatures", "applications"];

// Replace/insert the whole DOMContentLoaded block with this:
document.addEventListener("DOMContentLoaded", () => {
    const pageInput = document.getElementById("pageInput");
  const pageTotal = document.getElementById("pageTotal");
  const dropdown = document.getElementById("dropdown");
  if (!dropdown) return;

    const options = Array.from(dropdown.options);
  pageTotal.textContent = `/ ${options.length}`;

  function syncPageIndicator() {
    pageInput.value = dropdown.selectedIndex + 1;
  }

  dropdown.addEventListener("change", (e) => {
    const value = e.target.value;
    console.log("Log value: ", value);

    // mark we are doing programmatic navigation so scroll triggers don't overwrite state
    isProgrammaticScroll = true;
    playAudioFor(value);

    switch (value) {
      case "home":
        gsap.to(window, {
          scrollTo: 0,
          duration: 1,
          onComplete: () => endProgrammatic(),
        });
        break;
      case "about":
        gsap.to(window, {
          scrollTo: "#model-section",
          duration: 1,
          onComplete: () => endProgrammatic(),
        });
        break;
      case "features":
        goToWheel(0);
        break;
      case "optionalfeatures":
        goToWheel(1);
        break;
      case "applications":
        goToWheel(2);
        break;
      case "modelview":
        const modelTrigger = ScrollTrigger.getById("modelviewTrigger");
        if (modelTrigger) {
          gsap.to(window, {
            scrollTo: modelTrigger.end, // precise start of the pinned section
            duration: 1,
            onComplete: () => endProgrammatic(),
          });
        }
        break;

      case "animation":
        const videoTrigger = ScrollTrigger.getById("videoSectionTrigger");
        if (videoTrigger) {
          gsap.to(window, {
            scrollTo: videoTrigger.end,
            duration: 1,
            onComplete: () => endProgrammatic(),
          });
        } else {
          gsap.to(window, {
            scrollTo: "#videoSection",
            duration: 1,
            onComplete: () => endProgrammatic(),
          });
        }
        break;

      case "faq":
        const faqTrigger = ScrollTrigger.getById("faqTrigger");
        if (faqTrigger) {
          gsap.to(window, {
            scrollTo: faqTrigger.end,
            duration: 1,
            onComplete: () => endProgrammatic(),
          });
        } else {
          gsap.to(window, {
            scrollTo: "#FAQ_section",
            duration: 1,
            onComplete: () => endProgrammatic(),
          });
        }
        break;

      default:
        // restore guard in case of unknown value
        endProgrammatic();
        break;
    }
    syncPageIndicator();

  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      if (dropdown.selectedIndex < options.length - 1) {
        dropdown.selectedIndex++;
        dropdown.dispatchEvent(new Event("change"));
      }
    }
    if (e.key === "ArrowUp") {
      if (dropdown.selectedIndex > 0) {
        dropdown.selectedIndex--;
        dropdown.dispatchEvent(new Event("change"));
      }
    }
  });

    pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const num = parseInt(pageInput.value, 10);
      if (num >= 1 && num <= options.length) {
        dropdown.selectedIndex = num - 1;
        dropdown.dispatchEvent(new Event("change"));
      } else {
        pageInput.value = dropdown.selectedIndex + 1; // reset if invalid
      }
    }
  });

  syncPageIndicator();

function goToWheel(index) {
  if (!tl || !wheelST || !images.length) return;

  const step = 1 / images.length;
  const targetProgress = (index + 0.5) * step;
  const startPx = wheelST.start || 0;
  const endPx = wheelST.end || startPx;
  const scrollPos = startPx + targetProgress * (endPx - startPx);

  // 🔹 Temporarily remove snap
  const originalSnap = wheelST.vars.snap;
  wheelST.vars.snap = false;

  gsap.to(window, {
    scrollTo: scrollPos,
    duration: 1,
    onComplete: () => {
      // lock at the target frame
      tl.progress(targetProgress).pause();

      // 🔹 Restore snapping after a short delay
      setTimeout(() => {
        wheelST.vars.snap = originalSnap;
      }, 300);

      endProgrammatic();
    }
  });
}





  // helper to end a generic programmatic scroll
  function endProgrammatic() {
    // small delay to avoid immediate overwrite by ScrollTriggers
    setTimeout(() => {
      ScrollTrigger.refresh();
      isProgrammaticScroll = false;
    }, 50);
  }

  // ------------ dropdown auto-sync while scrolling ------------
  // map for main sections

const audioMap = {
  home: new Audio("./audios/home.mp3"),
  about: new Audio("./audios/about.mp3"),
  features: new Audio("./audios/features.mp3"),
  optionalfeatures: new Audio("./audios/optional_features.mp3"),
  applications: new Audio("./audios/applications.mp3"),
  modelview: new Audio("./audios/modelview.mp3"),
  animation: new Audio("./audios/animation.mp3"),
  faq: new Audio("./audios/faq.mp3"),
};

let currentAudio = null;
let audioValue = null;

function playAudioFor(value) {
  // Stop currently playing audio
  if (audioValue == value) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = audioMap[value];
  if (audio) {
    currentAudio = audio;
    audioValue = value;
    audio.play().catch((err) => {
      console.warn("Audio play blocked by browser:", err);
    });
  }
}


  const sectionMap = [
    { id: "home", selector: ".static-1" },
    { id: "about", selector: "#model-section" },
    { id: "modelview", selector: "#model-section2" },
    { id: "animation", selector: "#videoSection" },
    { id: "faq", selector: "#FAQ_section" },
  ];

  sectionMap.forEach((s) => {
    if (!document.querySelector(s.selector)) return;
    ScrollTrigger.create({
      trigger: s.selector,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (!isProgrammaticScroll){
            dropdown.value = s.id;
            syncPageIndicator();       // ✅ update page number
            playAudioFor(s.id);  
          }
      },
      onEnterBack: () => {
        if (!isProgrammaticScroll){
           dropdown.value = s.id;
           syncPageIndicator();       // ✅ update page number
           playAudioFor(s.id);  
          }
      },
    });
  });

  // wheel-specific mapping (images -> dropdown values)
  // images.forEach((img, i) => {
  //   ScrollTrigger.create({
  //     trigger: img,
  //     start: "top center",
  //     end: "bottom center",
  //     onEnter: () => {
  //       if (!isProgrammaticScroll){

  //         // dropdown.value = wheelValues[i] || "features";
  //          const id = wheelValues[i] || "features";
  //           dropdown.value = id;
  //           syncPageIndicator();       // ✅ update page number
  //           playAudioFor(id);     
  //       }
  //     },
  //     onEnterBack: () => {
  //       if (!isProgrammaticScroll) {
  //         // dropdown.value = wheelValues[i] || "features";
  //           const id = wheelValues[i] || "features";
  //           dropdown.value = id;
  //           syncPageIndicator();       // ✅ update page number
  //           playAudioFor(id);      

  //       }
  //     },
  //   });
  // });

  // // If the wheel section itself is scrolled into view (but not a specific image),
  // // ensure the dropdown shows 'features' as a safe default when not handled by image triggers.
  // if (document.querySelector("#wheelSection")) {
  //   ScrollTrigger.create({
  //     trigger: "#wheelSection",
  //     start: "top center",
  //     end: "bottom center",
  //     onEnter: () => {
  //       if (!isProgrammaticScroll) dropdown.value = "features";
  //     },
  //     onEnterBack: () => {
  //       if (!isProgrammaticScroll) dropdown.value = "features";
  //     },
  //   });
  // }
  // ----------------------------------------------
// Wheel: single progress-based updater (reliable)
// ----------------------------------------------
let lastWheelIndex = -1;

// Only create the tracker if the wheel section and timeline exist
if (document.querySelector("#wheelSection") && typeof tl !== "undefined" && images.length) {
  ScrollTrigger.create({
    trigger: "#wheelSection",
    // match the wheel timeline's scroll range (same as tl.scrollTrigger)
    start: "top top",
    end: "+=200%", // same end as tl's ScrollTrigger
    onUpdate: function(self) {
      // if programmatic navigation is in progress, ignore updates
      if (isProgrammaticScroll) return;

      // use the wheel timeline progress (0..1) — more accurate than many per-element triggers
      const p = tl.progress();

      // map progress -> index (clamp to [0, images.length-1])
      let idx = Math.floor(p * images.length);
      if (idx < 0) idx = 0;
      if (idx > images.length - 1) idx = images.length - 1;

      // only update when index actually changes (prevents repeated audio triggers)
      if (idx === lastWheelIndex) return;
      lastWheelIndex = idx;

      const id = wheelValues[idx] || "features";
      dropdown.value = id;
      syncPageIndicator();
      playAudioFor(id);
    },
  });
}

});

