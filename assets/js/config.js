/**
 * ====================================================================
 * KNI UPP - GŁÓWNA KONFIGURACJA DANYCH KOŁA (CONFIG.JS)
 * ====================================================================
 * Zmieniaj dane w tym jednym pliku, a zaktualizują się one automatycznie
 * na wszystkich stronach portalu (Główna, O nas, Kontakt, TTS, Blog itp.)!
 */

const KNI_CONFIG = {
  // --- ZARZĄD KOŁA NAUKOWEGO ---
  zarzad: {
    prezes: "Kinga Ręba",
    wiceprezes: "Tomasz Jarko",
    sekretarz: "Jan Dachtera",
    kadencja: "2026/2027"
  },

  // --- DANE KONTAKTOWE & SOCIAL MEDIA ---
  kontakt: {
    email: "kniupp@proton.me",
    facebookUrl: "https://www.facebook.com/KNIUPP",
    facebookDisplay: "facebook.com/KNIUPP",
    quizUrl: "https://kniupp.pl/phishing_quiz/",
    katedra: "Katedra Inżynierii Biosystemów, Uniwersytet Przyrodniczy w Poznaniu",
    adres: "ul. Wojska Polskiego 50, Poznań"
  },

  // --- NAJBLIŻSZE SPOTKANIE OTWARTE / REKRUTACJA ---
  spotkanie: {
    tytul: "Spotkanie Otwarte KNI UPP",
    data: "20 października (poniedziałek)",
    godzina: "18:30 CEST",
    sala: "sala B4",
    miejscePelne: "Katedra Inżynierii Biosystemów, ul. Wojska Polskiego 50, sala B4",
    statusBadge: "REKRUTACJA OTWARTA",
    opisKrotki: "Zapraszamy wszystkich studentów oraz pasjonatów informatyki na spotkanie organizacyjne! Poznaj nasz zespół, bieżące projekty i grupy robocze."
  },

  // --- INFORMACJE OGÓLNE O KOLE ---
  ogolne: {
    nazwaPelna: "Koło Naukowe Informatyków UPP",
    skrot: "KNI UPP",
    rok: 2026,
    sezon: "SEZON AKADEMICKI 2025/2026",
    lokalizacjaSektor: "NODE: UPP_POZNAN_SECTOR_B4"
  }
};

// Automatyczne wstrzykiwanie danych do elementów z atrybutem data-kni="..."
document.addEventListener("DOMContentLoaded", () => {
  // Aktualizacja tekstów
  document.querySelectorAll("[data-kni]").forEach((el) => {
    const keyPath = el.getAttribute("data-kni");
    const val = keyPath.split(".").reduce((acc, part) => acc && acc[part], KNI_CONFIG);
    if (val !== undefined && val !== null) {
      el.textContent = val;
    }
  });

  // Aktualizacja linków (href)
  document.querySelectorAll("[data-kni-href]").forEach((el) => {
    const keyPath = el.getAttribute("data-kni-href");
    const val = keyPath.split(".").reduce((acc, part) => acc && acc[part], KNI_CONFIG);
    if (val) {
      if (keyPath === "kontakt.email") {
        el.setAttribute("href", "mailto:" + val);
      } else {
        el.setAttribute("href", val);
      }
    }
  });
});
