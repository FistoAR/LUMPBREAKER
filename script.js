// console.clear();

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
    scrub: true,
    snap: {
      snapTo: 1 / images.length, // snap to each image step
      duration: 0.3,
      delay: 0,
      ease: "power1.inOut",
    },
    markers: false,
  },
  onComplete: () => {
    // ✅ when 2nd animation finishes, trigger 3rd
    document.getElementById("third-animation").style.display = "block";
    // startThirdAnimation();
  },
});

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
  id: "modelviewTrigger", // 👈 added
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: true,
});

ScrollTrigger.create({
  trigger: "#videoSection",
  id: "videoSectionTrigger",
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: true,
});

ScrollTrigger.create({
  trigger: "#FAQ_section",
  id: "faqTrigger",
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: false,
});


//  gsap.registerPlugin(ScrollTrigger);

//   let panells = gsap.utils.toArray("section");

//   panells.forEach((panell, i) => {
//     gsap.fromTo(panell,
//       { autoAlpha: 0 },
//       {
//         autoAlpha: 1,
//         duration: 0.5,
//         ease: "none",
//         scrollTrigger: {
//           trigger: panell,
//           start: "top center",   // when section reaches middle
//           end: "bottom center",  // fade out as you scroll past
//           toggleActions: "play reverse play reverse", // fade in/out
//         }
//       }
//     );
//   });

//  gsap.registerPlugin(ScrollTrigger);

//   let panells = gsap.utils.toArray(".panell");

//   // hide all except first
//   gsap.set(panells.slice(1), { display: "none" });

//   panells.forEach((panell, i) => {
//     ScrollTrigger.create({
//       trigger: panell,
//       start: "top center",
//       onEnter: () => {
//         gsap.set(panells, { display: "none" });
//         gsap.set(panell, { display: "block" });
//       },
//       onEnterBack: () => {
//         gsap.set(panells, { display: "none" });
//         gsap.set(panell, { display: "block" });
//       }
//     });
//   });

// --- Put this after `tl` is created (so tl.scrollTrigger exists) ---
const wheelST = tl && tl.scrollTrigger ? tl.scrollTrigger : null;
let isProgrammaticScroll = false;
const wheelValues = ["features", "optionalfeatures", "applications"];

// Replace/insert the whole DOMContentLoaded block with this:
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("dropdown");
  if (!dropdown) return;

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
  });

  // ------------ improved, robust goToWheel ------------
  function goToWheel(index) {
    // safety
    if (!tl || !wheelST || !images || !paneTexts || images.length === 0) {
      // fallback: simple scroll
      gsap.to(window, {
        scrollTo: "#wheelSection",
        duration: 1,
        onComplete: () => endProgrammatic(),
      });
      return;
    }

    // Choose a progress that lands *in the middle* of the slice (avoid edges)
    const step = 1 / images.length;
    const targetProgress = (index + 0.5) * step;

    // 1) prevent ScrollTrigger from updating timeline while we set state
    wheelST.disable();
    tl.pause();

    // 2) Immediately set DOM to exactly the desired state (hide everything except target)
    images.forEach((img, i) => {
      gsap.set(img, {
        display: i === index ? "block" : "none",
        opacity: i === index ? 1 : 0,
        visibility: i === index ? "visible" : "hidden",
      });
    });
    paneTexts.forEach((txt, i) => {
      gsap.set(txt, {
        display: i === index ? "block" : "none",
        opacity: i === index ? 1 : 0,
        visibility: i === index ? "visible" : "hidden",
      });
    });

    // 3) Put the timeline internal progress where we want it (render immediately)
    tl.progress(targetProgress, true);

    // 4) Ensure ScrollTrigger has fresh start/end values so we can compute the exact scroll pos
    ScrollTrigger.refresh();

    // compute the corresponding scroll position for that progress (safe numeric values now)
    const startPx = wheelST.start || 0;
    const endPx = wheelST.end || startPx;
    const scrollPos = startPx + targetProgress * (endPx - startPx);

    // 5) Smooth scroll to the correct spot that corresponds with the chosen progress
    gsap.to(window, {
      scrollTo: scrollPos,
      duration: 1,
      onComplete: () => {
        // refresh smoother/triggers so pinned calculations are accurate
        try {
          const ss = ScrollSmoother.get && ScrollSmoother.get();
          if (ss && typeof ss.refresh === "function") ss.refresh();
        } catch (err) {
          // ignore if no refresher
        }
        ScrollTrigger.refresh();

        // small delay to give the engine a frame to settle, then re-enable wheel trigger
        setTimeout(() => {
          // re-enable the wheel ScrollTrigger — because we've positioned the scroll exactly
          // to match tl.progress(), enabling will not flip the visuals.
          wheelST.enable();

          // keep timeline paused right after enabling to avoid it animating immediately.
          tl.pause();

          // small extra delay then allow scroll triggers to update dropdown again
          setTimeout(() => {
            isProgrammaticScroll = false;
          }, 60);
        }, 30);
      },
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
  home: new Audio("/audios/home.mp3"),
  about: new Audio("/audios/about.mp3"),
  features: new Audio("/audios/features.mp3"),
  optionalfeatures: new Audio("/audios/optional_features.mp3"),
  applications: new Audio("/audios/applications.mp3"),
  modelview: new Audio("/audios/modelview.mp3"),
  animation: new Audio("/audios/animation.mp3"),
  faq: new Audio("/audios/faq.mp3"),
};

let currentAudio = null;

function playAudioFor(value) {
  // Stop currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = audioMap[value];
  if (audio) {
    currentAudio = audio;
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
        if (!isProgrammaticScroll) dropdown.value = s.id;
      },
      onEnterBack: () => {
        if (!isProgrammaticScroll) dropdown.value = s.id;
      },
    });
  });

  // wheel-specific mapping (images -> dropdown values)
  images.forEach((img, i) => {
    ScrollTrigger.create({
      trigger: img,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (!isProgrammaticScroll)
          dropdown.value = wheelValues[i] || "features";
      },
      onEnterBack: () => {
        if (!isProgrammaticScroll)
          dropdown.value = wheelValues[i] || "features";
      },
    });
  });

  // If the wheel section itself is scrolled into view (but not a specific image),
  // ensure the dropdown shows 'features' as a safe default when not handled by image triggers.
  if (document.querySelector("#wheelSection")) {
    ScrollTrigger.create({
      trigger: "#wheelSection",
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (!isProgrammaticScroll) dropdown.value = "features";
      },
      onEnterBack: () => {
        if (!isProgrammaticScroll) dropdown.value = "features";
      },
    });
  }
});

// document.addEventListener("DOMContentLoaded", () => {
//   const dropdown = document.getElementById("dropdown");

//   dropdown.addEventListener("change", (e) => {
//     const value = e.target.value;
//     console.log("Log value: ", value);

//     switch (value) {
//       case "home":
//         gsap.to(window, { scrollTo: 0, duration: 1 });
//         break;
//       case "about":
//         gsap.to(window, { scrollTo: "#model-section", duration: 1 });
//         break;
//       case "features":
//         goToWheel(0);
//         break;
//       case "optionalfeatures":
//         goToWheel(1);
//         break;
//       case "applications":
//         goToWheel(2);
//         break;
//       case "modelview":
//         gsap.to(window, {
//           scrollTo: ScrollTrigger.getById("modelviewTrigger").start, // 👈 precise pin start
//           duration: 1,
//           onComplete: () => ScrollSmoother.get().refresh(),
//         });
//         break;

//       case "animation":
//         gsap.to(window, { scrollTo: "#videoSection", duration: 1 });
//         break;
//       case "faq":
//         gsap.to(window, { scrollTo: "#FAQ_section", duration: 1 });
//         break;
//     }
//   });

//   function goToWheel(index) {
//   gsap.to(window, {
//     scrollTo: "#wheelSection",
//     duration: 1,
//     onComplete: () => {
//       if (typeof tl !== "undefined") {
//         // Pause timeline so scroll doesn't override immediately
//         tl.pause();

//         // Hide all first
//         images.forEach((img, i) => {
//           gsap.set(img, { display: "none", opacity: 0, visibility: "hidden" });
//           gsap.set(paneTexts[i], { display: "none", opacity: 0, visibility: "hidden" });
//         });

//         // Show only the selected
//         gsap.set(images[index], { display: "block", opacity: 1, visibility: "visible" });
//         gsap.set(paneTexts[index], { display: "block", opacity: 1, visibility: "visible" });
//       }
//     }
//   });
// }

// });
