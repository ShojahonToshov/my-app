import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";


export default function useLanding() {
  const [activeSection, setActiveSection] = useState("");
  const { user: currentUser } = useUser();
  const [openFaq, setOpenFaq] = useState(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }

      const sections = ["features", "comparison", "how-it-works", "reviews", "faq"];
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      if (window.scrollY < 100) current = "";
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, sectionId: string) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return {
    activeSection,
    currentUser,
    openFaq, setOpenFaq,
    showStickyCta,
    scrollToSection
  };
}
