/**
 * Centralized text strings for the LOS! Berlin Transport application
 * This file contains all UI text in multiple languages
 */

const strings = {
  // English
  eng: {
    // App-wide
    app: {
      name: 'LOS!',
      subtitle: 'Berlin Transport',
      accountTitle: 'Account',
      accountComingSoon: 'Account features coming soon...',
    },

    // Header
    header: {
      saved: 'Saved',
      account: 'Account',
    },

    // Search Form
    search: {
      enterStart: 'Enter Start...',
      enterDestination: 'Enter Destination...',
      enterStopover: 'Enter Stopover...',
      enterStartPlaceholder: 'Enter start station...',
      enterDestinationPlaceholder: 'Enter destination station...',
      enterStopoverPlaceholder: 'Enter stopover station...',
      addStopover: 'Add Stopover',
      search: 'Search',
      searching: 'Searching...',
      noStationsFound: 'No stations found',
      stopoverDuration: 'Stay',
      durationMin: (mins) => `${mins} min`,
      durationHour: (hrs) => `${hrs} hr`,
    },

    // Journey Planner
    journey: {
      loading: 'Loading...',
      findingOptions: 'Finding transport options...',
      noConnections: 'No connections found for this route',
      failedToLoad: 'Failed to load transport options',
      retry: 'Retry',
      planAgain: 'Plan Again',
      done: 'Done',
      newSearch: 'New Search',
      startOver: 'Start Over',
    },

    // Journey Progress
    progress: {
      selectedJourney: 'Selected Journey',
      journeyComplete: 'Completed Journey',
      minUnit: 'min',
      leg: 'leg',
      legs: 'legs',
      readyToGo: (from, to) => `Ready to go from ${from} to ${to}`,
    },

    // Transport Options
    transport: {
      more: (count) => `+${count} more`,
      showLess: 'Show less',
      noDirectOptions: 'No direct transport options available',
      minJourney: (mins) => `${mins} min journey`,
    },

    // Saved Journeys & Stops
    saved: {
      mySaved: 'My Saved',
      journeysTab: 'Journeys',
      stopsTab: 'Stops',
      loadingData: 'Loading...',
      noSavedJourneys: 'No saved journeys',
      saveRoutesHint: 'Save your frequent routes for quick access',
      noSavedStops: 'No saved stops',
      saveStopsHint: 'Save your favorite stops for quick access',
      via: 'via',
    },

    // Account
    account: {
      title: 'Account',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      usernamePlaceholder: 'Enter username',
      emailPlaceholder: 'Enter email',
      passwordPlaceholder: 'Enter password',
      confirmPasswordPlaceholder: 'Confirm password',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      welcome: (name) => `Welcome, ${name}!`,
      memberSince: 'Member since',
      dangerZone: 'Danger Zone',
      deleteData: 'Delete All Saved Data',
      deleteDataDesc: 'This will delete all your saved journeys and stops.',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'This will permanently delete your account and all data.',
      confirmDelete: 'Are you sure? This cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      loginError: 'Invalid email or password',
      registerError: 'Registration failed. Email may already be in use.',
      passwordMismatch: 'Passwords do not match',
      fieldRequired: 'All fields are required',
    },

    // Transport product names
    products: {
      suburban: 'S-Bahn',
      subway: 'U-Bahn',
      tram: 'Tram',
      bus: 'Bus',
      ferry: 'Ferry',
      express: 'Express',
      regional: 'Regional',
    },
  },

  // German
  de: {
    // App-wide
    app: {
      name: 'LOS!',
      subtitle: 'Berliner Verkehr',
      accountTitle: 'Konto',
      accountComingSoon: 'Kontofunktionen demnächst verfügbar...',
    },

    // Header
    header: {
      saved: 'Gespeichert',
      account: 'Konto',
    },

    // Search Form
    search: {
      enterStart: 'Start eingeben...',
      enterDestination: 'Ziel eingeben...',
      enterStopover: 'Zwischenhalt eingeben...',
      enterStartPlaceholder: 'Startbahnhof eingeben...',
      enterDestinationPlaceholder: 'Zielbahnhof eingeben...',
      enterStopoverPlaceholder: 'Zwischenhalt eingeben...',
      addStopover: 'Zwischenhalt hinzufügen',
      search: 'Suchen',
      searching: 'Suche läuft...',
      noStationsFound: 'Keine Stationen gefunden',
      stopoverDuration: 'Aufenthalt',
      durationMin: (mins) => `${mins} Min`,
      durationHour: (hrs) => `${hrs} Std`,
    },

    // Journey Planner
    journey: {
      loading: 'Laden...',
      findingOptions: 'Verbindungen werden gesucht...',
      noConnections: 'Keine Verbindungen für diese Strecke gefunden',
      failedToLoad: 'Verbindungen konnten nicht geladen werden',
      retry: 'Erneut versuchen',
      planAgain: 'Neu planen',
      done: 'Fertig',
      newSearch: 'Neue Suche',
      startOver: 'Von vorn',
    },

    // Journey Progress
    progress: {
      selectedJourney: 'Ausgewählte Reise',
      journeyComplete: 'Reise vollständig',
      minUnit: 'Min',
      leg: 'Abschnitt',
      legs: 'Abschnitte',
      readyToGo: (from, to) => `Bereit für die Fahrt von ${from} nach ${to}`,
    },

    // Transport Options
    transport: {
      more: (count) => `+${count} weitere`,
      showLess: 'Weniger anzeigen',
      noDirectOptions: 'Keine direkten Verbindungen verfügbar',
      minJourney: (mins) => `${mins} Min Fahrt`,
    },

    // Saved Journeys & Stops
    saved: {
      mySaved: 'Gespeichert',
      journeysTab: 'Reisen',
      stopsTab: 'Haltestellen',
      loadingData: 'Laden...',
      noSavedJourneys: 'Keine gespeicherten Reisen',
      saveRoutesHint: 'Speichere häufige Strecken für schnellen Zugriff',
      noSavedStops: 'Keine gespeicherten Haltestellen',
      saveStopsHint: 'Speichere deine Lieblingshaltestellen für schnellen Zugriff',
      via: 'über',
    },

    // Account
    account: {
      title: 'Konto',
      login: 'Anmelden',
      register: 'Registrieren',
      logout: 'Abmelden',
      username: 'Benutzername',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      usernamePlaceholder: 'Benutzername eingeben',
      emailPlaceholder: 'E-Mail eingeben',
      passwordPlaceholder: 'Passwort eingeben',
      confirmPasswordPlaceholder: 'Passwort bestätigen',
      noAccount: 'Noch kein Konto?',
      hasAccount: 'Bereits ein Konto?',
      welcome: (name) => `Willkommen, ${name}!`,
      memberSince: 'Mitglied seit',
      dangerZone: 'Gefahrenbereich',
      deleteData: 'Alle gespeicherten Daten löschen',
      deleteDataDesc: 'Dies löscht alle gespeicherten Reisen und Haltestellen.',
      deleteAccount: 'Konto löschen',
      deleteAccountDesc: 'Dies löscht dein Konto und alle Daten unwiderruflich.',
      confirmDelete: 'Bist du sicher? Dies kann nicht rückgängig gemacht werden.',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      loginError: 'Ungültige E-Mail oder Passwort',
      registerError: 'Registrierung fehlgeschlagen. E-Mail wird möglicherweise bereits verwendet.',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      fieldRequired: 'Alle Felder sind erforderlich',
    },

    // Transport product names
    products: {
      suburban: 'S-Bahn',
      subway: 'U-Bahn',
      tram: 'Straßenbahn',
      bus: 'Bus',
      ferry: 'Fähre',
      express: 'Express',
      regional: 'Regionalbahn',
    },
  },

  // Shared (language-independent) - icons and emojis
  shared: {
    // Transport product icons (for badges)
    productIcons: {
      suburban: 'S',
      subway: 'U',
      tram: 'M',
      bus: 'BUS',
      ferry: '⛴',
      express: 'RE',
      regional: 'RB',
    },

    // Transport product emojis
    productEmojis: {
      suburban: '🚈',
      subway: '🚇',
      tram: '🚊',
      bus: '🚌',
      ferry: '⛴️',
      express: '🚄',
      regional: '🚆',
      default: '🚉',
    },
  },
};

export default strings;
