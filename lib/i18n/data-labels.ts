import type { Locale } from "@/lib/i18n/config"

const EL_LABELS: Record<string, string> = {
  // Congestion locations (live-map + dashboard alerts)
  "Kifissias Ave & Alexandras": "Λεωφ. Κηφισίας & Αλεξάνδρας",
  "Attiki Odos — Katechaki Exit": "Αττική Οδός — Έξοδος Κατεχάκη",
  "Omonia Square": "Πλατεία Ομονοίας",
  "Pireos Street — Kerameikos": "Οδός Πειραιώς — Κεραμεικός",
  "Kifissias Ave — Marousi": "Λεωφ. Κηφισίας — Μαρούσι",

  // Incident locations
  "Amalias Ave — Syntagma": "Λεωφ. Αμαλίας — Σύνταγμα",
  "Iera Odos — Egaleo": "Ιερά Οδός — Αιγάλεω",
  "Piraeus Port — Gate E2": "Λιμάνι Πειραιά — Πύλη Ε2",
  "Patission Ave — Polytechnic": "Λεωφ. Πατησίων — Πολυτεχνείο",
  "Vasilissis Sofias Ave": "Λεωφ. Βασιλίσσης Σοφίας",
  "Panathenaic Stadium area": "Περιοχή Παναθηναϊκού Σταδίου",

  // Incident titles
  "Multi-vehicle collision": "Σύγκρουση πολλαπλών οχημάτων",
  "Overturned truck": "Ανατροπή φορτηγού",
  "Ferry arrivals": "Αφίξεις πλοίων",
  "Road resurfacing": "Ασφαλτόστρωση",
  "Full road closure": "Πλήρης κλείσιμο οδού",
  "Sporting event": "Αθλητική εκδήλωση",

  // Incident & congestion descriptions
  "Major accident on Amalias Ave, 2 lanes blocked. Emergency services on scene.":
    "Σοβαρό ατύχημα στη Λεωφ. Αμαλίας, 2 λωρίδες αποκλεισμένες. Έχουν φτάσει υπηρεσίες έκτακτης ανάγκης.",
  "Overturned truck blocking 2 of 3 lanes. Tow crew dispatched.":
    "Ανατραπέν φορτηγό αποκλείει 2 από 3 λωρίδες. Έχει σταλεί γερανός.",
  "Multiple ferry arrivals causing vehicle surge on Akti Miaouli. Traffic control active.":
    "Πολλαπλές αφίξεις πλοίων προκαλούν αύξηση οχημάτων στην Ακτή Μιαούλη. Ρύθμιση κυκλοφορίας σε ισχύ.",
  "Scheduled resurfacing work on northbound lane. One lane operational until 22:00.":
    "Προγραμματισμένη ασφαλτόστρωση στη βόρεια λωρίδα. Μία λωρίδα σε λειτουργία έως τις 22:00.",
  "Road closed for official motorcade. Detour via Panepistimiou St.":
    "Δρόμος κλειστός για επίσημη συνοδεία. Εκτροπή μέσω Πανεπιστημίου.",
  "Athens marathon finish line area. Expect increased pedestrian and vehicle traffic.":
    "Περιοχή τερματισμού μαραθωνίου Αθήνας. Αναμένεται αυξημένη πεζή και οχηματική κίνηση.",
  "Rush hour gridlock at major intersection. Heavy bus and car congestion.":
    "Πλήρης συμφόρηση ώρας αιχμής σε μεγάλη διασταύρωση. Βαριά συμφόρηση λεωφορείων και αυτοκινήτων.",
  "Moderate traffic buildup at exit ramp, clearing gradually.":
    "Μέτρια συσσώρευση κίνησης στη ράμπα εξόδου, αποκλιμακώνεται σταδιακά.",
  "Peak hour volume exceeding road capacity. Slow crawl on all approaches.":
    "Όγκος ώρας αιχμής υπερβαίνει τη χωρητικότητα. Αργή κίνηση σε όλες τις προσβάσεις.",
  "High traffic density from downtown commuters. Speeds dropping steadily.":
    "Υψηλή πυκνότητα κίνησης από μετακινούμενους από το κέντρο. Ταχύτητες σταθερά μειούμενες.",
  "Mild congestion near shopping district. Expected to clear after peak.":
    "Ήπια συμφόρηση κοντά σε εμπορική περιοχή. Αναμένεται αποσυμφόρηση μετά την αιχμή.",

  // Estimated clearance
  "~45 min": "~45 λεπτά",
  "~30 min": "~30 λεπτά",
  "~20 min": "~20 λεπτά",

  // Transit stop names
  "Syntagma": "Σύνταγμα",
  "Omonia": "Ομόνοια",
  "Attiki": "Αττική",
  "Evangelismos": "Ευαγγελισμός",
  "Victoria": "Βικτώρια",
  "Piraeus": "Πειραιάς",
  "Akropoli": "Ακρόπολη",
  "Patission & Polytechnic": "Πατησίων & Πολυτεχνείο",
  "Vasilissis Sofias & Rigillis": "Βασ. Σοφίας & Ριγίλλης",
  "Kifissias & Marousi": "Κηφισίας & Μαρούσι",
  "Iera Odos & Egaleo": "Ιερά Οδός & Αιγάλεω",
  "Monastiraki Square": "Πλατεία Μοναστηρακίου",
  "Thissio": "Θησείο",
  "Zappeio": "Ζάππειο",
  "Panepistimiou & Korai": "Πανεπιστημίου & Κοραή",
  "Alexandras & Patission": "Αλεξάνδρας & Πατησίων",

  // Traffic routes
  "Kifissias Avenue": "Λεωφόρος Κηφισίας",
  "Alexandras Avenue": "Λεωφόρος Αλεξάνδρας",
  "Iera Odos (Piraeus–Athens)": "Ιερά Οδός (Πειραιάς–Αθήνα)",
  "Attiki Odos (Ring Road)": "Αττική Οδός (Περιφερειακή)",

  // Traffic camera names + directions
  "I/C D. Plakentias": "Α/Κ Δ. Πλακεντίας",
  "I/C Papagou": "Α/Κ Παπάγου",
  "The Mall Athens – Neratziotissa": "The Mall Athens – Νερατζιώτισσα",
  "I/C Metamorfosi": "Α/Κ Μεταμόρφωση",
  "Koropi Toll Station": "Σταθμός Διοδίων Κορωπίου",
  "Roupaki Toll Station": "Σταθμός Διοδίων Ρουπακίου",
  "Athens Airport / Elefsina": "Αερ. Αθηνών / Ελευσίνα",
  "Katechaki / Mesogeia–Vrilissia": "Κατεχάκη / Μεσόγεια–Βριλήσσια",
  "Lamia & Piraeus / Elefsina / Athens Airport":
    "Λαμία & Πειραιάς / Ελευσίνα / Αερ. Αθηνών",
  "Elefsina / Athens Airport": "Ελευσίνα / Αερ. Αθηνών",

  // Route performance — analytics table
  "Highway A1 — Northbound": "Εθνική Οδός 1 — Βόρεια",
  "Highway A1 — Southbound": "Εθνική Οδός 1 — Νότια",
  "Ring Road — East": "Περιφερειακή — Ανατολικά",
  "Ring Road — West": "Περιφερειακή — Δυτικά",
  "Ring Road — Eastbound": "Περιφερειακή — Ανατολικά",
  "Main St Corridor": "Άξονας Κεντρικής Οδού",
  "Central Ave": "Κεντρική Λεωφόρος",
  "Industrial Park Rd": "Οδός Βιομ. Πάρκου",
  "Riverside Dr": "Παραποτάμια Οδός",
  "University Blvd": "Πανεπιστημιακή Λεωφόρος",
  "Airport Expressway": "Αυτοκινητόδρομος Αεροδρομίου",
  "Main St & 5th Ave": "Κεντρική & 5η Λεωφ.",
  "Central Station Area": "Περιοχή Κεντρικού Σταθμού",
  "Old Town Square": "Πλατεία Παλιάς Πόλης",
  "Harbor Bridge": "Γέφυρα Λιμένος",
  "Stadium Approach": "Πρόσβαση Σταδίου",

  // Stations (top stations + ridership)
  "Central Station": "Κεντρικός Σταθμός",
  "Union Square": "Πλατεία Ένωσης",
  "Airport Terminal": "Τερματικός Σταθμός Αεροδρομίου",
  "University Hub": "Κόμβος Πανεπιστημίου",
  "Riverside Plaza": "Πλατεία Όχθης",
  "Stadium District": "Περιοχή Σταδίου",
  "Old Town": "Παλιά Πόλη",
  "Tech Park": "Τεχνολογικό Πάρκο",
  "Harbor Front": "Παραλιακή Λιμένος",
  "North Gateway": "Βόρεια Πύλη",
  "South Plaza": "Νότια Πλατεία",
  "Industrial Loop": "Βιομηχανική Ζώνη",
  "West End": "Δυτικό Άκρο",
  "Cultural Quarter": "Πολιτιστική Συνοικία",
  "Garden District": "Συνοικία Κήπου",

  // Modes (used in ridership "mode" column)
  "Metro": "Μετρό",
  "Bus": "Λεωφορείο",
  "Tram": "Τραμ",
}

const DICTS: Record<Locale, Record<string, string>> = {
  en: {},
  el: EL_LABELS,
}

export function translateLabel(locale: Locale, value: string): string {
  return DICTS[locale]?.[value] ?? value
}
