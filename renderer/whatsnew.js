// What's new: each version's notes, shipped with the app (so the card after an update works offline, and on the Thor).
// The shelf shows a version's highlights once, the first time it starts; Settings → System → What's new lists the
// items (a short headline per row; the side card says more). scripts/release-notes.js prints the same notes as Markdown
// for the GitHub release, so the app and the release page always say the same thing.
// { version (Windows / Linux), android (the Android build with the same changes, if any), date, title, highlights[],
//   sections: [{ h, items: [[headline, more]] }] }; newest first.
window.BS_WHATSNEW = [
  {
    version: '2.0.24', date: '2026-11-26', title: 'When the controller still won\'t answer',
    highlights: [
      "Controller icon by the clock: if the controller still doesn't answer a few seconds after the restart, click it again to restart EmuScape",
      "The restart writes what the controller reading sees into the log, to find out why a controller stops after a game"
    ],
    sections: []
  },
  {
    version: '2.0.23', date: '2026-11-26', title: 'Controller restart by the clock',
    highlights: [
      "Click the controller icon by the clock to restart the controller (after a game or emulator that crashed left it not answering)",
      "Grid view: a double click on a game plays it without switching EmuScape out of full screen"
    ],
    sections: []
  },
  {
    version: '2.0.22', date: '2026-11-26', title: 'Fewer pauses while the library loads',
    highlights: [
      "Each console's emulator and its icon are checked in the background: an emulator on a drive slow to answer no longer pauses EmuScape for seconds"
    ],
    sections: []
  },
  {
    version: '2.0.21', date: '2026-11-26', title: 'Grid view: the wheel scrolls, Q / E change console',
    highlights: [
      "Grid view: the mouse wheel scrolls the covers like a page instead of going game by game",
      "Grid view: Q and E (or Tab) change console, since the arrows walk the covers; L2 / R2 on a controller, as before",
      "Console bar: drag it to slide through the consoles, or use the wheel over it; press and hold a console to move it"
    ],
    sections: []
  },
  {
    version: '2.0.20', date: '2026-11-26', title: 'No freeze after opening',
    highlights: [
      "No more freeze of a few seconds after EmuScape opens: the PC stores (Xbox, Epic, GOG, EA, Ubisoft) are read in the background, so a drive slow to answer no longer holds the app up",
      "Add a console of your own opens the window to choose the emulator's .exe straight away, then fills in the console's name and game files by itself",
      "Grid view: no platform name on any cover, PC and Steam included"
    ],
    sections: []
  },
  {
    version: '2.0.18', date: '2026-11-26', title: 'Consoles of your own',
    highlights: [
      "Settings → Library → Add a console of your own: any console or computer EmuScape doesn't list, with the emulator you choose, like Playnite",
      "Grid view: covers no longer carry the console's name on a console's own shelf (Home and PC still show where each game is from)"
    ],
    sections: []
  },
  {
    version: '2.0.17', date: '2026-11-26', title: 'Grid view: the buttons stay free',
    highlights: ["Turning Grid view off and on again no longer puts the game's panel over the search, Settings and view buttons"],
    sections: []
  },
  {
    version: '2.0.16', date: '2026-11-25', title: 'Your console bar, your way',
    highlights: [
      "Settings → Look → Console bar: along the top or down the left side",
      "Console bar shows: names, icons, or icons and names",
      "In Grid view the top-right buttons always stay reachable"
    ],
    sections: []
  },
  {
    version: '2.0.15', date: '2026-11-25', title: 'Grid view: the video in its place',
    highlights: ["In Grid view the game's video plays inside its panel, between the description and Play, instead of over the covers",
      "A Shelf ⇄ Grid switch beside the counter, top right",
      "The game's panel starts below the top-right buttons, whatever the interface size"],
    sections: []
  },
  {
    version: '2.0.14', date: '2026-11-25', title: 'Grid view',
    highlights: [
      "Settings → Look → How games show → Grid: every game's cover in a grid, with its playtime, and the chosen game's facts and Play on the right",
      "Everything works as on the shelf: the consoles at the top, arrows or the controller to move, A / Enter plays, Y opens Details"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Grid view", "Up / down go a row of covers; a click picks a game, a double-click plays it. Shelf (3D cases) brings the shelf back."]
    ] } ]
  },
  {
    version: '2.0.13', date: '2026-11-24', title: 'Program, one press',
    highlights: [
      "Details → … → Program opens the file window straight away, right beside Hide, and the menu stays open",
      "Usual way / Through Steam beside it starts the game its normal way again"
    ],
    sections: []
  },
  {
    version: '2.0.12', date: '2026-11-24', title: 'Pick what each game starts',
    highlights: [
      "Details → Program: any PC game (Steam's, a store's or one you added) can start a program (.exe) you pick",
      "Details → Choose ROM: every console game, with Browse for another file…"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Program", "Its cover, name and playtime stay. Start it the usual way again goes back to Steam or its store."],
      ["Choose ROM", "Pick another copy, or any file on your PC. Use the shelf's file again undoes it."]
    ] } ]
  },
  {
    version: '2.0.11', date: '2026-11-24', title: 'Small updates with no installer',
    highlights: [
      "Updates download only EmuScape's own code (a few MB) and restart: no installer runs, so antivirus programs have nothing to flag",
      "Right-click a console's card for a menu: Set up, Hide shelf / Show shelf"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Updates", "From now on Update now takes the small code update when there is one, and the full installer only when EmuScape's engine changes."],
      ["Console cards", "Right-click a card in Settings → Library: Set up opens its page, Hide shelf hides it (Show shelf brings it back). Del / Y still hides or shows it straight away."]
    ] } ]
  },
  {
    version: '2.0.10', date: '2026-11-24', title: 'Emulator downloads that keep working, and shelves you hide with a right-click',
    highlights: [
      "Download emulators keeps working when GitHub limits its answers: it reads the project's releases page instead (Cemu and the others)",
      "Downloading an emulator no longer turns on every console it plays",
      "Right-click a console's card (or Del / Y) to hide or show its shelf"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Download emulators", "GitHub answers 60 questions an hour without an account; past that, EmuScape now reads the public releases page."],
      ["Consoles", "A download from a console's own page turns that console on; nothing else is switched on. Right-click a card in Settings → Library to hide its shelf."]
    ] } ]
  },
  {
    version: '2.0.9', date: '2026-11-24', title: 'A song for each console',
    highlights: [
      "Settings → Sound → Music per console: each console can loop a song of its own while its shelf shows",
      "Download emulators: Azahar (3DS) and RetroArch download and update again",
      "The mouse wheel goes through the console cards one line at a time"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Music per console", "Add songs… copies your songs into the Music folder; pick one per console with ◀ ▶. Each console's own music Off goes back to the menu music."],
      ["Download emulators", "Azahar picked a RetroArch core zip instead of the emulator; RetroArch's newest version is found even when its download page changes."],
      ["Console cards", "In Settings → Library the wheel moves down a line of cards, like ↓."]
    ] } ]
  },
  {
    version: '2.0.8', date: '2026-11-23', title: 'You can see the update happen',
    highlights: [
      "Update now shows Downloading… with its percentage at the top, then Installing…",
      "The installer shows only its progress window and opens EmuScape again by itself",
      "Scrolling Settings with the mouse wheel no longer jumps back up"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Updates", "A bar at the top shows the download, then the installer's progress window, then the new EmuScape opens."],
      ["Mouse wheel", "A row only takes the focus when the mouse itself moves onto it, not when the list slides under it."]
    ] } ]
  },
  {
    version: '2.0.7', date: '2026-11-23', title: 'A tidier Custom games page',
    highlights: [
      "Custom games: Add games or programs at the top, then Games with a page for each game",
      "Missing covers show up top only when a game has none; each game has its own Cover"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Custom games", "Add games or programs, Covers missing (only when some are), Games (open one to rename it, change its shelf or cover, or remove it), Where your games go, then Playnite and Quiver Launcher at the bottom."]
    ] } ]
  },
  {
    version: '2.0.6', date: '2026-11-23', title: 'Updates in one press',
    highlights: [
      "Check for updates finds the new version, downloads it and installs it by itself, then EmuScape opens again",
      "The folder copy of EmuScape updates itself too (it becomes the installed one)"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Updates", "Update now (on the notice or in Settings → System) downloads and installs straight away. During a game it waits until you're back."]
    ] } ]
  },
  {
    version: '2.0.5', date: '2026-11-23', title: 'Your PC games on the shelf you choose',
    highlights: [
      "Choose where your own PC games go: a shelf of their own with the name you give it, PC, or a console's shelf",
      "Every game you add from then on goes there"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Where your games go", "Settings → Library → Custom games → Where your games go, and Their own shelf's name. One game can still be moved on its own with its Shelf row."]
    ] } ]
  },
  {
    version: '2.0.4', date: '2026-11-23', title: 'Your own PC games, and reminders you can dismiss',
    highlights: [
      "Scan a folder of PC games and tick which programs to add, like Steam's non-Steam games",
      "Hide any reminder with its ✕: RetroAchievements warnings and Needs attention",
      "The mouse only points: lists no longer scroll when it moves over them"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["PC games", "Settings → Library → Custom games → Scan a folder of games: each game folder gets its main program ticked, and Show every program found lists the rest to tick too."],
      ["Reminders", "The ✕ beside a warning (or Del / the Y button) stops it reminding you; ↺ or Show hidden reminders brings it back."],
      ["Mouse", "Moving the mouse lights what it's over but doesn't scroll. The arrows, the mouse wheel and the controller still move up and down."]
    ] } ]
  },
  {
    version: '2.0.3', date: '2026-11-20', title: 'A quicker start',
    highlights: [
      "EmuScape opens faster: a shorter logo and less waiting before your shelf shows",
      "A new version is noticed about 2 seconds after EmuScape starts"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Start-up", "The logo sweep, the pause before it and the wait for covers are all shorter. Settings → Display → Startup animation → Off skips the logo entirely."]
    ] } ]
  },
  {
    version: '2.0.2', date: '2026-11-20', title: 'A clearer update notice',
    highlights: [
      "When a new version is out, a notice shows at the top of the screen a few seconds after EmuScape opens",
      "Updates are just updates now: no more \"beta\" wording"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Update notice", "It shows at the top, in the middle, with Update now. Settings → System → Check for updates looks right away."]
    ] } ]
  },
  {
    version: '2.0.1', date: '2026-11-20', title: 'Updates that close EmuScape for you',
    highlights: [
      "The installer now closes an EmuScape running in the background by itself, so updating never says its files are in use",
      "First update delivered through Update now"
    ],
    sections: [ { h: 'Everywhere', items: [
      ["Installer", "An EmuScape left running with no window (for example, started with Windows) closes itself when you install or update."]
    ] } ]
  },
  {
    // (own build) the first EmuScape release
    version: '2.0.0', date: '2026-11-20', title: 'EmuScape: its own name, its own installer and updates',
    highlights: [
      "EmuScape installs like any program (EmuScape-Setup.exe) and updates itself from its GitHub page",
      "Download emulators right inside EmuScape, no EmuDeck needed",
      "Home menu: Quit to EmuScape, 5 save-state slots, and the controller stays with the menu"
    ],
    sections: [
      { h: 'Everywhere', items: [
        ["Installer and updates", "A normal Windows installer in English or Spanish, with Desktop and Start menu shortcuts. When there's a new version, EmuScape tells you and Update now installs it and opens again."],
        ["Emulators", "Settings → Library → Download emulators gets each console's emulator from its official page, and tells you when one is up to date."],
        ["Setup keeps your picks", "Choosing your emulators and games folders only fills in the consoles you picked."],
        ["Details", "A click on the empty left side closes it; double-click the name to rename the game."]
      ] }
    ]
  },
  {
    // (android: the Thor's APK for this round calls itself 1.82.0-beta.14 too; it gets Everywhere + Android)
    version: '1.82.0-beta.14', android: '1.82.0-beta.14', date: '2026-11-11', title: 'New themes and sounds, a new Details page, and Xbox 360 and PS3 achievements',
    highlights: [
      "Seventeen new themes, all in the quick menu",
      "More sounds, a sound per console, your own",
      "A cleaner Details page with tabs",
      "Xbox 360 and PS3 achievements",
      "Settings in eight tabs, and Kid mode"
    ],
    platforms: [
      "Windows is the main version: everything under Everywhere, Windows and Linux, and Windows.",
      "Linux / Steam Deck: everything under Everywhere and Windows and Linux; it's still an early build.",
      "Android (AYN Thor, phones and tablets): the themes, sounds, quick menu and cases under Everywhere."
    ],
    sections: [
      { h: "Everywhere", items: [
        ["New themes", "Nebula, Abyss, Ember, Dusk, Prism, Hologram, Starfield, Rainy Night, Cherry Blossom, Snowfall, Neon City, Deep Sea, Thunderstorm, Fireflies and Desert Night, plus two showpieces: Event Horizon and Glass Lake. Pocket, Walnut, CRT and VHS are gone."],
        ["Every theme in the quick menu", "Look & sound shows all of them, the same as Settings, and LB / RB change the theme from anywhere in the menu."],
        ["More sounds", "New built-in sounds: Disc-era, Handheld and Living room, all in the quick menu too."],
        ["Keep themes moving", "Settings → Look → Keep themes moving while you scroll: a moving theme keeps going as the shelf slides (on by default on Windows; off on Android and Linux, where you can turn it on). Also in the quick menu."],
        ["Quick menu", "Right only opens a section; rows that leave the menu open with A."],
        ["Cases like the real ones", "Inspect and the museum show each console's real case: full-size booklets, discs and cartridges at their real size, jewel cases, cardboard boxes with their trays."],
        ["Patch notes", "After an update, one small card: Read the patch notes, or close it."],
        ["Fixed", "DS cases are the right shape, so covers are no longer cropped and washed out, and a cartridge's contacts are only on its back. Switch .nca files no longer show as games."]
      ] },
      { h: "Windows and Linux", items: [
        ["Updates keep your setup", "Windows and Linux: when a new version is out, Update now downloads it and EmuScape restarts into it, with your settings, games and data folder as they were. A safety copy of your settings is made first (Settings → System → Undo the update's settings changes puts it back). A new EmuScape folder offers to bring your setup over from the one you used before. Back up settings now covers your picks and sounds too, and your keys if you tick Include keys and passwords."],
        ["Achievements in the Home menu", "While you play, the Home menu has Achievements (Trophies on PS3) when the game has them, laid out like the shelf's achievements screen, big enough to read from the couch."],
        ["More screenshots", "Details' Media tops a game up to ten screenshots from more places (libretro, and ScreenScraper or IGDB if you've connected them), downloaded once and kept."],
        ["Connect IGDB", "Settings › Accounts › IGDB walks you through a free key: more screenshots, missing game info filled in, and official trailers."],
        ["Trailer sound", "A trailer's sound is ready the moment you turn it on."],
        ["Better trailers", "Real gameplay clips from ScreenScraper, official trailers from IGDB, wrong videos skipped, and Change trailer in Details."],
        ["Video previews in Look", "The video preview settings moved to Settings → Look."],
        ["Games come first", "While you play, EmuScape downloads no box art and doesn't rescan or refresh the shelf; a background download carries on once the game has ended."],
        ["Theme grid", "Settings' theme grid opens with A, so up and down go straight past it."],
        ["A sound per console", "Settings → Sound → Sound per console: give any console its own sound; the rest use the main one."],
        ["Your own sounds", "Settings → Sound → Custom sounds: add sound files from a game (a folder, files or a ZIP) and they join the sound list."],
        ["Details, redesigned", "A compact header, and only Play, ♡ and ··· in the buttons. Tabs (LB / RB) for Overview, Achievements, Media and Your copy, and a Status chip: Not started, Playing, Finished or Abandoned."],
        ["Xbox 360 achievements", "Read from Xenia Canary's profile: every achievement, your gamerscore and when you unlocked each one, in EmuScape's achievements screen."],
        ["PS3 trophies", "Read from RPCS3, with their real pictures and grades. A game you haven't played yet shows its whole list, all locked."],
        ["Your emulators and achievements", "Settings → Accounts → RetroAchievements now starts with each emulator you have: whether it's signed in, whether its pop-ups are on, and the steps when it isn't ready. The emulators show their own pop-ups in game."],
        ["Settings in eight tabs", "Library, Look, Sound, Box art & media, Controls, Shelf & museum, Accounts and System, with the set-once options under More options. Needs attention lists anything to fix, and Emulator setup sets up every emulator at once."],
        ["My shelves", "Collections are now My shelves: make one in Settings, search for games to add, rename it or delete it. Automatic shelves fill themselves."],
        ["Kid mode", "Choose the shelves kids can see and lock the rest behind a PIN."],
        ["Set up for me: Picture", "Screen shape, sharp pixels and a retro TV look for the emulators EmuScape sets up."],
        ["Missing BIOS files", "EmuScape tells you before Play when a console needs a BIOS file it can't find, and Needs attention lists them."],
        ["Find a logo", "Every console's Customize tab can search Wikimedia Commons for free logos, or the web: a logo you save to Downloads becomes the shelf's logo."],
        ["Hidden games in Find", "A hidden game still turns up in Find, dimmed. Choose it to unhide it."],
        ["Original Xbox", "A new Xbox shelf, for xemu."],
        ["+ Add to…", "Put any game on any shelf (it stays on its own too), on one of My shelves or in Favourites, from the quick menu or Details. It starts just as it does from its own shelf. A game you added by hand can still move to another shelf in Settings → Custom games."],
        ["Fixed", "Your theme, sound and music stay chosen after a restart. Automatic shelves keep their rule. PCSX2's sign-in is found in a moved or translated Documents folder. A Steam library on a sleeping drive no longer freezes start-up. Video previews wait 5 seconds."]
      ] },
      { h: "Windows", items: [
        ["The taskbar", "Hidden only while a game starts and closes. While you play, a fullscreen game keeps it out of sight, and the Windows key or alt-tab bring it up."],
        ["Full screen or Window", "Switch from the quick menu's Screen row, as well as F11 and Settings."],
        ["DualSense over Bluetooth", "Works on the shelf even when Steam isn't running."],
        ["Home menu over 3DS games", "The Home menu now shows over Azahar's full-screen games (it opened and paused the game, but stayed hidden behind it)."],
        ["No more flicker in Details", "Opening Details no longer makes the case's spine or side flicker (filmed on NVIDIA cards): the case turns a little further and settles to its front or back."],
        ["Details' trailer", "The d-pad reaches the trailer, left / right set its volume, and the volume bar is bigger, with a knob and the level."]
      ] },
      { h: "Linux", items: [
        ["RetroArch AppImage", "Its cores are found in the AppImage's own portable folder too."]
      ] },
      { h: "Android", items: [
        ["Thor: the test meter", "The smoothness meter only opens when you run the smoothness test."]
      ] }
    ]
  },
  {
    // (android: the APK published with beta.12 was built a day later and calls itself 1.82.0-beta.13)
    version: '1.82.0-beta.12', android: '1.82.0-beta.13', date: '2026-11-11', title: 'Find any game, manuals you can read, and a new Thor bottom screen',
    highlights: [
      "Find a game: search every shelf by name, by keyboard, controller or touch",
      "Manuals and guides you can read on any screen: zoom, move around the page, one page at a time",
      "A new Details page built around the case, with the trailer's sound and full-screen screenshots",
      "The shelf always slides with every effect on, and achievements as a wall of badges",
      "Every art source one tap away in the Art Studio; Thor: a new bottom screen with Apps, Consoles and Screen off"
    ],
    platforms: [
      "Windows is the main version: everything under Everywhere and Windows.",
      "Android (AYN Thor, phones and tablets) is still a work in progress: expect rough edges, especially on the Thor's bottom screen.",
      "Linux / Steam Deck is still a work in progress: an early build, not yet tried on many Steam Decks."
    ],
    sections: [
      { h: "Everywhere", items: [
        ["Find a game", "Search every shelf by title: the Search button beside Menu, / or Ctrl+F, hold the left stick's click, or the quick menu's first row. Results show as you type, best match first; pick one and the shelf goes to it, on whichever console it's on."],
        ["Manuals you can read", "Zoom in and move around a page with the controller (L2 / R2, right stick), the keyboard (+ / -, arrows), the mouse (Ctrl + wheel) or your fingers (pinch, double tap, drag). Small screens show one page at a time."],
        ["A new achievements screen", "A game's achievements as a wall of badges, with a card beside the one you're on: its full title and description, points, how many players have it, when you unlocked it (and whether in hardcore), and whether it's Story, Beats the game or Missable. Your unlocks sit on a trophy shelf at the top, newest first; the rest are grouped into Story, Missable and Everything else. Rare badges (violet, under 10% of players) and ultra-rare ones (gold, under 3%) get a rim, and missable ones a dot. Y sorts by order, rarity or points."],
        ["RomM", "Play games from your RomM server."],
        ["Every art source at a tap", "The Art Studio ends each row with a card for each source not set up yet, saying what it brings: LaunchBox art (one download, right there), ScreenScraper (every part), SteamGridDB (fronts in HD) and IGDB. Connect one and its versions fill the row."],
        ["A faster Art Studio", "Versions show at once instead of waiting for the slowest source, and the Spine page is readable."],
        ["ScreenScraper", "Sign in with your own free account under Settings → Accounts; its previews in the Art Studio load fast."],
        ["Smoother moments", "A case set down from Inspect lands smoothly, and the other cases stay 3D while Details is open."],
        ["Settings from the quick menu", "Settings is one press away in the quick menu."],
        ["The right word for every console", "Cartridge, UMD or floppy disk wherever the case holds one, in Details, the museum and the Art Studio."],
        ["Every effect stays on", "The automatic performance level no longer turns the shelf's effects off."],
        ["Mona Sans", "EmuScape's interface has a new, clearer font."],
        ["Fixed", "A cover you chose stays chosen. \"Set up for me\" Undo never wipes settings you saved since. A RetroArch system folder with core subfolders is read."]
      ] },
      { h: "Windows", items: [
        ["Details, redesigned", "Built around the case: Play first, the trailer beside it with its sound and volume, screenshots that open full screen, and LB / RB to jump between sections."],
        ["Seamless play", "Steam and store games are watched while they run, so EmuScape is back the moment you quit; pick the screen mode, or Go to desktop from the Home menu."],
        ["RocketLauncher", "Games can start through RocketLauncher, HyperSpin's launcher, with its fade screens, bezels and pause menu."],
        ["Custom games", "A Settings page for recomps, PC ports and any other program, on their own Custom shelf."],
        ["Steam", "Trailers play with their sound; fixes for controllers and for games that close early. A on Details' trailer pauses and plays it there."],
        ["Attract mode", "It keeps going when EmuScape's window isn't in focus, with more attract settings."],
        ["Animations", "The shelf slides with every effect on whatever Windows' own animation setting says. Reduce motion is now in Settings → Performance (Off by default)."],
        ["Controllers", "Switching a controller on with its Guide button no longer opens the Home menu, and its first presses are never lost. Minus / View opens Details (held: the museum)."],
        ["Fixed", "The quick menu no longer opens or slides away by itself."]
      ] },
      { h: "Android (work in progress)", items: [
        ["A new Thor bottom screen", "Apps first (every app on the device, plus Android home, Settings, Wi-Fi and Bluetooth), then a calmer card for the game you're on, Trophies, Consoles (tap one to jump to its shelf) and Shortcuts (up to twelve, in pages, with Add)."],
        ["Hold an app for its menu", "On the bottom screen's Apps tab (or an app in Shortcuts), hold an app to open it on the top or the bottom screen, add it to Shortcuts or open its App info. An app on the top screen leaves EmuScape's bottom screen up (DS and 3DS emulators get both screens); an app on the bottom screen leaves the shelf live on top, with a button there to bring EmuScape's bottom screen back."],
        ["Typing in Settings by touch", "A finger on a setting you type into (an API key, an account) opens EmuScape's own keyboard, with a Paste key for a key copied in your browser."],
        ["The bottom screen helps with what's on top", "While you read a manual, search or look at Details, it shows big buttons for that. Find a game types on the bottom screen, so the top keeps the results."],
        ["It stays up while you play", "A game that doesn't use the second screen (GameCube, PS2…) leaves EmuScape's bottom screen up. DS and 3DS games still get the bottom screen for themselves."],
        ["Screen off", "A Shortcut that turns the bottom screen dark until you tap it."],
        ["Touch everywhere", "Double-tap a case to pick it up, swipe up for Details and down to close them, tap the manual or the disc in an open case. A one-time tip shows the gestures."],
        ["Manuals sized for the Thor", "A manual opens at the page's width, its print near real size and sharp. Each one starts fitted again, the way you last chose (the whole page or its width)."],
        ["Smoother scrolling", "Racing through a shelf no longer competes with the bottom screen or the moving backdrop. Settings → System → Smoothness test shows its results on screen."],
        ["Box art made clear", "The Thor's Art Studio has a card for each art source: LaunchBox art downloads right there with its progress; ScreenScraper, SteamGridDB and IGDB connect and come back."],
        ["Readable on the Thor", "A Text size setting (Automatic by default, up to Largest), with bigger labels on the shelf, in Details and on the bottom screen's buttons."],
        ["Phones and tablets", "They turn upright with the screen; the Thor stays landscape."],
        ["Fixed", "EmuScape no longer freezes after you make it your Home app. DS and other cartridge games show the cartridge's own picture, whole, and call it a cartridge."]
      ] },
      { h: "Linux / Steam Deck (work in progress)", items: [
        ["Details, redesigned", "As on Windows."],
        ["Emulators as Flatpaks", "They are found, EmuDeck and RetroDECK included."],
        ["Steam games are watched", "While they run, so EmuScape is back when you quit."],
        ["Leaving a game, explained", "A \"Leaving a game\" card after setup: hold View + Menu to come back. Steam's own Exit game closes EmuScape too, and the tour says so."],
        ["Sized for the Deck", "A Steam Deck starts at Interface size 115% for its 7\" screen (a size you choose later is kept)."],
        ["Power and start-up", "Sleep, Restart and Shut down in the quick menu; Settings → Start EmuScape at login."],
        ["Game Mode", "A controller-friendly file browser, updates that keep your Steam shortcut working, and EmuScape's own artwork in your Steam library."],
        ["Touch on the Deck's screen", "Double-tap a case to pick it up, swipe for Details, tap the manual in an open case to read it."]
      ] }
    ]
  },
  {
    version: '1.82.0-beta.9', android: '1.82.0-beta.9', date: '2026-11-06', title: 'Smoother, better manuals, and covers for every custom game',
    highlights: [
      'Smoother: background work no longer makes the shelf hitch, and the Art Studio opens faster',
      'Manuals: the right manual for the right game, scan collections for 26 consoles, cleaner pages',
      'Connect your accounts during setup, with Paste buttons (right-click Paste works too)',
      'Covers for all your custom games at once: recomps, ports and programs you added',
      'Thor: video previews, ports and custom APKs, six more consoles; Steam Deck: hold Select + Start to close a game'
    ],
    platforms: [
      'Windows: everything above but the Thor parts.',
      'Android (AYN Thor): video previews in Details, ports and custom APKs, six more consoles.',
      'Linux / Steam Deck (experimental): hold Select + Start to close a game; covers for every custom game.'
    ],
    sections: [
      { h: 'New', items: [
        ['Covers for every custom game', 'Settings → Custom games → Covers: go through every recomp, port and program without a cover (SteamGridDB\'s covers for each, A uses one, Skip moves on), or let EmuScape pick the best match for each in one go, with Undo. Needs a free SteamGridDB key.'],
        ['Thor: video previews', 'Videos beside your games (a "videos", "media/videos" or "snap" folder in a console\'s games folder) play behind the case in Details, and YouTube trailers in the Media tab. Off until you switch them on: Settings → Shelf & museum → Video previews.'],
        ['Thor: ports and custom APKs', 'Settings → Games → Ports & custom APKs: switch on the apps that are games (ports, recomps, a custom APK) and they get a Custom shelf of their own, off the Apps shelf.'],
        ['Thor: six more consoles', 'Sega CD, 32X, Atari 2600, Lynx, WonderSwan and DOS, through RetroArch (MD.emu for Sega CD too), with their box art, manuals and achievements.'],
        ['Steam Deck: leave any game', 'Hold Select + Start for a moment during a game and EmuScape closes it, whatever the emulator.'],
        ['Accounts in setup', 'The first-run setup has an optional Accounts page: RetroAchievements, SteamGridDB, ScreenScraper and fanart.tv, each with a link to its free key, a Paste button and a Test. With a controller, an on-screen keyboard. Skip it and nothing changes.'],
        ['Manuals for many more consoles', 'Scan collections for PlayStation, NES, SNES, N64, Game Boy, DS, 3DS, Sega, Atari, TurboGrafx-16 and Neo Geo games, plus Nintendo\'s high-resolution manuals for Wii, GameCube, N64, DS and 3DS.']
      ] },
      { h: 'Better', items: [
        ['Smoother everywhere', 'Box art, manual and library work in the background takes turns with the shelf instead of freezing it, games folders are read once instead of over and over, and coming back from a game no longer sets off a full rescan.'],
        ['The right manual for the right game', 'Stricter matching: no more sequels\' or other consoles\' manuals, no promotional flyers. Manuals picked before that don\'t match are set aside (kept in the backup folder) and looked up again. Games with no manual anywhere say "no manual found online".'],
        ['Cleaner manual pages', 'No more thumbnail "pages", huge scans made a sensible size, and digital manuals and box wraps are no longer cut in half.'],
        ['Fix a manual', 'In the manual reader, Fix manual (Y / W) offers Wrong game (set it aside and get the right one, from the scan collections first) or Repair (the same manual with its cover, pages and sizes put right). Right away, for that game only.'],
        ['Art Studio shows the whole box', 'The case in the Art Studio takes the shape of the game\'s box, so 3DS, PSP, Switch, Blu-ray and cartridge boxes show whole instead of cropped.'],
        ['Wii U manuals open on the box', 'Manuals made from a Wii U game\'s own e-manual open on the box front again, wherever EmuScape runs from.'],
        ['Right-click Paste', 'Text boxes have the usual Cut / Copy / Paste menu.'],
        ['Settings opens the right page', 'Links to a page of its own (from a card or the bottom screen) now land on that page, on every platform.']
      ] }
    ]
  },
  {
    version: '1.82.0-beta.8', android: '1.82.0-beta.8', date: '2026-11-06', title: 'Video previews, a new Details page and easier setup',
    highlights: [
      'Video previews: rest on a game and its trailer plays, on the shelf and in Details, console games too',
      'A new Details page: the game\'s logo, play stats, tabs and one big Play button',
      'Add many games at once: pick several, scan a folder, or import from Playnite (experimental)',
      'Ten more consoles, including Saturn, Neo Geo, Arcade and DOS',
      'Set up for me: one switch sets up RetroArch, Dolphin, DuckStation, PCSX2 and PPSSPP'
    ],
    // (scripts/release-notes.js prints these under the notes: where each part works)
    platforms: [
      'Windows: everything above.',
      'Linux / Steam Deck (experimental): everything except Set up for me, console trailers, scanning a folder of games and the Playnite import. On a Steam Deck, add EmuScape to Steam (it offers to) and play from Game Mode.',
      'Android (AYN Thor): the new Details page and the magazines fix; video previews, Add games and the new consoles come to Android later.'
    ],
    sections: [
      { h: 'New', items: [
        ['Video previews', 'Rest on a game and its preview plays, softly behind the shelf and behind the case in Details: your own videos (ES-DE, EmuDeck, RetroBat, LaunchBox or a folder of your own), Steam\'s own trailers for Steam games, and console trailers from YouTube. Settings → Video previews, which also sets how soon they start (half a second to 15 seconds).'],
        ['Console trailers', 'A console game\'s YouTube trailer is kept as a short clip (about 1 MB) the first time you rest on it, so it plays on the shelf just like a Steam trailer. It needs a free helper (yt-dlp), fetched once with one press: EmuScape asks you on the shelf, or Settings → Video previews.'],
        ['A new Details page', 'The game\'s logo, time played and last played, one Play button with Manual, Inspect and More beside it, and tabs: Overview, Media and Your copy (LB / RB, or Q / E). The game\'s art or its preview fills the background.'],
        ['Add many games at once', 'Settings → Custom games → Add games, or the Add games tile at the end of the Custom shelf: pick several programs at once, or point EmuScape at a folder of games and tick the ones to add.'],
        ['Import from Playnite (experimental)', 'Bring your Playnite library over in one go: games you added by hand, with their covers, and your emulated games\' folders. You see what will be added first, and one press removes it all again. Tell us how it goes.'],
        ['Steam Deck: Game Mode and Add to Steam', 'EmuScape now starts from Steam and in Game Mode by itself. On a Steam Deck in Desktop Mode it offers to add itself to Steam, so your controller works as a gamepad in games (outside Steam, B is the Esc key, which quits most emulators). Any time: Settings → System → Add EmuScape to Steam.'],
        ['Switch: Citron and Ryujinx', 'Found and started as well as Eden, so EmuDeck\'s Switch emulator works without setting anything up.'],
        ['Ten more consoles', 'Saturn, TurboGrafx-16, Neo Geo, Arcade, Sega CD, 32X, Atari 2600, Lynx, WonderSwan and DOS, through RetroArch, each with its own case and colours. Arcade games show their real names.'],
        ['Set up for me', 'Settings → a console → Set up for me: your controller mapped, the Home menu\'s Save and Load keys, one shared BIOS folder and graphics that suit your PC. Your files are backed up first, and Undo puts them back. The first run can do it for you.'],
        ['RetroArch cores and BIOS files', 'A missing RetroArch core downloads by itself the first time you play, and Settings checks the BIOS files each console needs.'],
        ['More PC stores', 'GOG, Ubisoft Connect, EA app and Xbox / Game Pass games join Steam and Epic on the PC shelf.'],
        ['Library tools', 'Filter by decade, genre, players or co-op, and make collections: shelves of your own, from Details → More → Collections.'],
        ['Patch notes in the app', 'A card on the shelf when a new version is out, with its highlights; What\'s new after you update; and every version\'s notes in Settings → System → What\'s new.']
      ] },
      { h: 'Better', items: [
        ['A tidier first run', 'Only the consoles you have games for come ticked; the rest fold away, grouped by maker.'],
        ['Easier to find', 'Video previews has its own place in Settings, and Add games its own page, so the main pages stay short.']
      ] },
      { h: 'Fixed', items: [
        ['Trailers play again', 'YouTube stopped playing trailers opened on their own. They now play in EmuScape\'s own player.'],
        ['Android: magazines and guides always show', 'The reading corner\'s list could stay empty on some devices; it now always loads.'],
        ['Your changes stay put', 'A game you renamed, or a finished "Set up for me", could be undone by changing another setting in the same visit.'],
        ['No accidental holds', 'Holding A on a disc, or holding Restart / Shut down, now stops if you switch away or pull down the notification shade, instead of finishing on its own.'],
        ['Covers and the museum', 'A Wi-Fi sign-in page could be saved as a game\'s cover, and the museum\'s camera jumped when you touched the controls after leaving it idle.'],
        ['Android: taps after a quick swipe', 'After flicking the shelf or the console bar, the first tap on a game or console did nothing. It works first time now.']
      ] }
    ]
  },  {
    version: '1.82.0-beta.6', android: '0.4.0-beta.1', date: '2026-11-05', title: 'Now on Android and Linux, and clean game transitions',
    highlights: [
      'EmuScape on Android (AYN Thor) and Linux / Steam Deck',
      'Starting and quitting a game shows nothing but the game',
      'Twelve retro consoles, from PlayStation to Dreamcast'
    ],
    sections: [
      { h: 'New', items: [
        ['Android and Linux', 'The AYN Thor gets EmuScape with its bottom screen; Linux and the Steam Deck get an AppImage (experimental).'],
        ['Retro consoles', 'PlayStation, NES, SNES, Nintendo 64, Game Boy, Game Boy Color, Game Boy Advance, DS, Mega Drive, Master System, Game Gear and Dreamcast.'],
        ['Rename and change covers', 'Give any game the name you want, and pick its cover from every one found.']
      ] },
      { h: 'Better', items: [
        ['Clean game transitions', 'No taskbar, no desktop and no gaps while a game starts or closes: it feels like a console.']
      ] }
    ]
  }
];
