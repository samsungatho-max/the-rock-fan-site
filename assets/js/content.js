/*
 * SITE CONTENT — the only file you need to edit to administer the site.
 *
 * IMAGES — two ways to fill any image slot:
 *   photo: "key"                       → a picture from the licensed photo library below (SITE.photos)
 *   image: "assets/img/my-file.jpg"    → your own file; it REPLACES the library photo for that slot
 *                                        (add  credit: "Photographer / Agency"  when the licence requires it)
 * Optional on any slot:  focus: "50% 20%"  = which point of the picture stays visible when it is cropped.
 * Recommended formats and ratios are listed in README.md.
 */
window.SITE = {
  // Set to true ONLY if the site is formally authorised by Dwayne Johnson or his representatives.
  // When false, the independent-fan-site disclaimer is shown in the footer.
  affiliated: false,
  year: 2026,

  contact: {
    email: "", // e.g. "hello@your-domain.com" — shown in the footer when set
  },

  // Official, verified accounts only.
  social: [
    { name: "Instagram", handle: "@therock", url: "https://www.instagram.com/therock/" },
    { name: "Facebook", handle: "Dwayne The Rock Johnson", url: "https://www.facebook.com/DwayneJohnson" },
    { name: "X", handle: "@TheRock", url: "https://x.com/TheRock" },
    { name: "YouTube", handle: "The Rock", url: "https://www.youtube.com/@therock" },
  ],

  /*
   * PHOTO LIBRARY — freely licensed or public-domain pictures hosted by Wikimedia Commons.
   * path    = location of the file on upload.wikimedia.org (source page: commons.wikimedia.org/wiki/File:<file name>)
   * author / license = attribution, printed in the "Photo credits" panel and under enlarged pictures
   * caption = what the picture actually shows
   * To add one: copy the part of the "Original file" address after ".../commons/", plus author and licence.
   */
  photos: {
    venice_wide:     { path: "0/0e/Dwayne_Johnson-1764.jpg", author: "Harald Krichel", license: "CC BY-SA 4.0", caption: "Venice Film Festival, 2025" },
    venice_carpet:   { path: "8/84/Dwayne_Johnson-1832.jpg", author: "Harald Krichel", license: "CC BY-SA 4.0", caption: "Venice Film Festival, 2025" },
    venice_full:     { path: "c/cb/Dwayne_Johnson-1690.jpg", author: "Harald Krichel", license: "CC BY-SA 4.0", caption: "Venice Film Festival, 2025" },
    venice_square:   { path: "9/93/Dwayne_Johnson-1809.jpg", author: "Harald Krichel", license: "CC BY-SA 4.0", caption: "Venice Film Festival, 2025" },
    venice_portrait: { path: "7/7e/Dwayne_Johnson-1764_%284x5_cropped_with_moderate_headroom%29.jpg", author: "Harald Krichel", license: "CC BY-SA 4.0", caption: "Venice Film Festival, 2025" },
    pentagon:        { path: "1/11/Dwayne_%22The_Rock%22_Johnson_Visits_the_Pentagon_%2841%29_%28cropped%29.jpg", author: "Henry Villarama / U.S. Department of Defense", license: "Public domain", caption: "At the Pentagon, 2023" },
    daytona_stage:   { path: "c/c4/Dwayne_Johnson_2024_Daytona_500_8246706.jpg", author: "Spc. Casey Brumbach / U.S. Army", license: "Public domain", caption: "Daytona 500, 2024" },
    daytona_mic:     { path: "1/13/Dwayne_Johnson_Daytona_500_2024_8246701.jpg", author: "Spc. Casey Brumbach / U.S. Army", license: "Public domain", caption: "Opening the Daytona 500, 2024" },
    daytona_salute:  { path: "0/01/Dwayne_Johnson_Daytona_500_8246702.jpg", author: "Spc. Casey Brumbach / U.S. Army", license: "Public domain", caption: "Daytona 500, 2024" },
    pendleton_meet:  { path: "1/12/Dwayne_%22The_Rock%22_Johnson_visits_Pendleton_140724-M-DN141-007.jpg", author: "Sgt. Valerie C. Eppler / U.S. Marine Corps", license: "Public domain", caption: "Visiting Camp Pendleton, 2014" },
    pendleton_fans:  { path: "8/86/Dwayne_%22The_Rock%22_Johnson_visits_Pendleton_140724-M-DN141-013.jpg", author: "Sgt. Valerie C. Eppler / U.S. Marine Corps", license: "Public domain", caption: "Meeting fans at Camp Pendleton, 2014" },
    jumanji_set:     { path: "8/8b/Dwayne_Johnson_and_Kevin_Hart%2C_Jumanji_-_Welcome_to_the_Jungle%2C_Koaloa_Ranch_in_Hawaii.jpg", author: "THX0477", license: "CC BY 2.0", caption: "On location for Jumanji: Welcome to the Jungle, Hawaii, 2016" },
    red_one:         { path: "9/94/The_rock_read_one.jpg", author: "Amy Martin Photography", license: "CC BY-SA 4.0", caption: "Red One premiere, London, 2024" },
    hercules_full:   { path: "e/ef/Dwayne_Johnson_Hercules_2014.jpg", author: "Eva Rinaldi", license: "CC BY-SA 2.0", caption: "Hercules premiere, Sydney, 2014" },
    hercules_portrait: { path: "5/5e/Dwayne_Johnson_2014.jpg", author: "Eva Rinaldi", license: "CC BY-SA 2.0", caption: "Hercules premiere, Sydney, 2014" },
    hercules_flynn:  { path: "a/ab/Beau_Flynn%2C_Dwayne_Johnson_%2814271358387%29.jpg", author: "Eva Rinaldi", license: "CC BY-SA 2.0", caption: "With producer Beau Flynn, Sydney, 2014" },
    wm28_cena:       { path: "0/0f/The_Rock_vs_John_Cena.jpg", author: "Simon Q", license: "CC BY 2.0", caption: "The Rock vs John Cena, WrestleMania XXVIII, 2012" },
    wm28_rockbottom: { path: "a/a7/WWE_Wrestlemania_28_-_The_Rock%27s_Rock_Bottom.jpg", author: "Simon Q", license: "CC BY 2.0", caption: "WrestleMania XXVIII, 2012" },
    wm28_entrance:   { path: "4/45/The_Rock_at_Wrestlemania_XXVIII_%287206106072%29.jpg", author: "Ed Webster", license: "CC BY 2.0", caption: "WrestleMania XXVIII, 2012" },
    raw_2012:        { path: "3/38/The_Rock_at_Raw%2C_Miami%2C_2_April_2012_%287236459564%29.jpg", author: "Ed Webster", license: "CC BY 2.0", caption: "Raw, Miami, 2012" },
    champion_2013:   { path: "b/bd/WWE_Champion_The_Rock_2013.jpg", author: "Matt Brink", license: "CC BY-SA 2.0", caption: "With the WWE Championship, 2013", max: 960 },
    title_2013:      { path: "3/30/Rock_won_the_title.jpg", author: "Megan Elice Meadows", license: "CC BY-SA 2.0", caption: "WWE Championship match, February 2013" },
    wm31_rousey:     { path: "a/ad/Rock_Rousey_WM31.jpg", author: "Bill", license: "CC BY 2.0", caption: "With Ronda Rousey, WrestleMania 31, 2015" },
    wm32:            { path: "0/0e/WrestleMania_32_2016-04-03_21-47-34_ILCE-6000_0689_DxO_%2827998740745%29.jpg", author: "Miguel Discart", license: "CC BY-SA 2.0", caption: "WrestleMania 32, 2016" },
    tribeca_portrait: { path: "7/7e/Dwayne_The_Rock_Johnson_2009_portrait.jpg", author: "David Shankbone", license: "CC BY 3.0", caption: "Tribeca Film Festival, 2009" },
    tribeca_trees:   { path: "c/cc/Dwayne_The_Rock_Johnson_trees_portrait_2009.jpg", author: "David Shankbone", license: "CC BY 3.0", caption: "New York, 2009" },
    tribeca_street:  { path: "8/8e/Dwayne_Johnson_at_the_2009_Tribeca_Film_Festival_2.jpg", author: "David Shankbone", license: "CC BY 3.0", caption: "Tribeca Film Festival, 2009" },
    tribeca_garcia:  { path: "6/66/Dany_Garcia_and_Dwayne_The_Rock_Johnson_2009_Tribeca.jpg", author: "David Shankbone", license: "CC BY 3.0", caption: "With Dany Garcia, Tribeca Film Festival, 2009" },
    star:            { path: "4/45/Dwayne_Johnson_star_%28Hollywood_Walk_of_Fame_stars%29.jpg", author: "Benoît Prieur", license: "CC0", caption: "Star on the Hollywood Walk of Fame" },
    china_2018:      { path: "0/01/Dwayne_Johnson_in_China_20180702.jpg", author: "Dian Li", license: "CC BY-SA 4.0", caption: "Skyscraper premiere, China, 2018" },
    fast_five:       { path: "3/3f/Fast_Five_Cast.jpg", author: "Jack Zalium", license: "CC BY 2.0", caption: "With the Fast Five cast, 2011" },
    xfl_celebration: { path: "7/73/2023_XFL_Championship_post-game_celebration.jpg", author: "Maj. Xeriqua Garfinkel / U.S. Army Reserve", license: "Public domain", caption: "XFL Championship celebration, 2023" },
    xfl_meet:        { path: "8/89/230513-A-WN705-015_%2853005947152%29.jpg", author: "U.S. Army Reserve", license: "Public domain", caption: "At the XFL Championship, 2023" },
    xfl_selfie:      { path: "7/70/230513-A-WN705-059_%2853006701184%29.jpg", author: "U.S. Army Reserve", license: "Public domain", caption: "With service members at the XFL Championship, 2023" },
    scorpion_2002:   { path: "0/06/DwyaneJohnson.jpg", author: "UncdSeowD", license: "CC BY-SA 3.0", caption: "The Scorpion King press conference, Singapore, 2002", max: 960 },
    hall_of_fame:    { path: "4/42/Dwayne_Johnson_Junior_Ah_You_Harry_Field_Polynesian_Football_Hall_of_Fame_displays.jpg", author: "ZappaOMatic", license: "CC0", caption: "Polynesian Football Hall of Fame display" },
  },

  // photoMobile = portrait-format picture used on phones (optional)
  hero: { photo: "venice_wide", photoMobile: "venice_portrait", focus: "66% 22%", alt: "Dwayne Johnson at the 2025 Venice Film Festival" },

  about: {
    photo: "pentagon",
    focus: "50% 20%",
    alt: "Portrait of Dwayne Johnson",
    paragraphs: [
      "Born in Hayward, California, into a wrestling family — the son of Rocky Johnson and grandson of Peter Maivia — Dwayne Johnson first made his name on the football field with the University of Miami before stepping into the ring in 1996.",
      "As “The Rock”, he became one of the most recognisable figures in professional wrestling. Hollywood followed: a screen debut in The Mummy Returns, then two decades of leading roles across action, comedy, animation and drama.",
      "Behind the camera he co-founded Seven Bucks Productions, and beyond entertainment he has built consumer brands, invested in sport and supported community causes around the world.",
    ],
    stats: [
      { value: 30, suffix: "+", label: "Years in Entertainment" },
      { value: 50, suffix: "+", label: "Major Film & TV Projects" },
      { text: "Global", label: "Entertainment & Business" },
    ],
  },

  // Film posters and stills are copyrighted by the studios, so each card uses a licensed photograph of
  // Dwayne Johnson instead (its real caption is shown in the details panel). To use an official visual
  // you have cleared, add  image: "assets/img/poster-xxx.jpg"  to the film.
  films: [
    { title: "Jumanji: Welcome to the Jungle", year: 2017, role: "Dr. Smolder Bravestone", photo: "jumanji_set", focus: "50% 50%",
      details: "Four teenagers are pulled into a video game and become its avatars. Johnson plays the fearless explorer Dr. Smolder Bravestone, a role he reprised in Jumanji: The Next Level (2019)." },
    { title: "Fast Five", year: 2011, role: "Luke Hobbs", photo: "fast_five", focus: "18% 30%",
      details: "Johnson joins the Fast & Furious saga as federal agent Luke Hobbs, a character who returned across the franchise and led the spin-off Hobbs & Shaw (2019)." },
    { title: "Black Adam", year: 2022, role: "Teth-Adam / Black Adam", photo: "venice_portrait",
      details: "A long-developed passion project: Johnson stars as the DC antihero Black Adam and also serves as a producer through Seven Bucks Productions." },
    { title: "Moana", year: 2016, role: "Maui (voice)", photo: "venice_square",
      details: "Disney's animated ocean adventure. Johnson voices the demigod Maui and performs the song “You're Welcome”. He returned to the role in Moana 2 (2024)." },
    { title: "Jungle Cruise", year: 2021, role: "Frank Wolff", photo: "tribeca_portrait",
      details: "Inspired by the Disney theme-park attraction. Johnson plays riverboat skipper Frank Wolff opposite Emily Blunt, and produces." },
    { title: "San Andreas", year: 2015, role: "Ray Gaines", photo: "hercules_portrait",
      details: "A disaster epic set along the San Andreas Fault. Johnson plays rescue helicopter pilot Ray Gaines, searching for his family after a catastrophic earthquake." },
    { title: "Red Notice", year: 2021, role: "John Hartley", photo: "red_one",
      details: "A globe-trotting heist caper for Netflix, with Johnson as FBI profiler John Hartley alongside Ryan Reynolds and Gal Gadot." },
    { title: "The Smashing Machine", year: 2025, role: "Mark Kerr", photo: "venice_full",
      details: "Benny Safdie's drama for A24 about mixed-martial-arts pioneer Mark Kerr — a dramatic turn that premiered at the Venice Film Festival." },
  ],

  // "photo" / "image" are optional on each step.
  timeline: [
    { year: "1991", phase: "Roots", title: "A Champion Before the Spotlight", photo: "hall_of_fame", focus: "20% 40%",
      text: "A defensive lineman at the University of Miami, Johnson is part of the Hurricanes' national championship team." },
    { year: "1996", phase: "Wrestling", title: "The Debut", photo: "wm28_entrance",
      text: "A third-generation wrestler, he debuts in the WWF at Survivor Series under the name Rocky Maivia." },
    { year: "1998", phase: "Wrestling", title: "The People's Champion", photo: "champion_2013",
      text: "Now simply “The Rock”, he wins his first WWF Championship and becomes a defining star of the Attitude Era." },
    { year: "2001", phase: "Hollywood", title: "From the Ring to the Screen", photo: "scorpion_2002",
      text: "A film debut in The Mummy Returns leads directly to his first leading role in The Scorpion King the following year." },
    { year: "2011", phase: "Hollywood", title: "A Global Leading Man", photo: "hercules_full",
      text: "Fast Five introduces Luke Hobbs and opens a run of worldwide hits including San Andreas, Moana and Jumanji." },
    { year: "2012", phase: "Production", title: "Seven Bucks Productions", photo: "tribeca_garcia",
      text: "Co-founded with Dany Garcia and named after the seven dollars he had in his pocket after being cut from the Canadian Football League in 1995." },
    { year: "2016 – 2021", phase: "Entrepreneurship", title: "Building Brands", photo: "china_2018",
      text: "Project Rock launches with Under Armour, followed by Teremana Tequila in 2020 and ZOA Energy in 2021." },
    { year: "2024", phase: "Entrepreneurship", title: "The Boardroom", photo: "daytona_mic",
      text: "Johnson joins the board of TKO Group Holdings, parent of WWE and UFC, as the United Football League plays its first season." },
    { year: "Today", phase: "Philanthropy", title: "Purpose", photo: "pendleton_meet",
      text: "Alongside the work, a long-standing commitment to children, families and communities continues." },
  ],

  businessBanner: { photo: "xfl_meet", focus: "50% 30%" },
  business: [
    { icon: "entertainment", title: "Entertainment",
      text: "A career spanning the ring, the big screen, television and animation, with audiences on every continent." },
    { icon: "production", title: "Production",
      text: "Seven Bucks Productions, co-founded with Dany Garcia in 2012, develops film, television and digital projects." },
    { icon: "brands", title: "Consumer Brands",
      text: "Founder and co-founder of brands including Teremana Tequila, ZOA Energy and the grooming line Papatui." },
    { icon: "fitness", title: "Sports & Fitness",
      text: "Project Rock, the training line created with Under Armour, and co-ownership of the United Football League." },
    { icon: "ventures", title: "Business Ventures",
      text: "A seat on the board of TKO Group Holdings, the parent company of WWE and UFC, since 2024." },
  ],

  philanthropy: {
    photo: "pendleton_fans",
    focus: "25% 30%",
    alt: "",
    lead: "Success means more when it is shared.",
    text: "Throughout his career, Dwayne Johnson has given time and support to children, families and communities — from visiting young people facing serious illness to standing with those rebuilding after hardship.",
    url: "", // optional link for the button; leave empty to open the text below in a panel
    more: [
      "Giving back has been a constant alongside the films, the brands and the ring: time spent with children and families, support for community causes, and encouragement for people facing difficult moments.",
      "This page deliberately avoids figures and named partnerships that have not been confirmed by a reliable source. Replace this text in content.js with sourced information as you verify it.",
    ],
  },

  // category must be one of: Movies, Wrestling, Fitness, Business, Philanthropy, Lifestyle
  // ratio = shape of the tile in the grid (the enlarged view always shows the whole picture)
  gallery: [
    { title: "Hercules Premiere", category: "Movies", ratio: "3/4", photo: "hercules_full" },
    { title: "WrestleMania XXVIII", category: "Wrestling", ratio: "4/3", photo: "wm28_cena" },
    { title: "Daytona 500", category: "Fitness", ratio: "4/3", photo: "daytona_salute", focus: "15% 30%" },
    { title: "With Dany Garcia", category: "Business", ratio: "4/3", photo: "tribeca_garcia" },
    { title: "Camp Pendleton", category: "Philanthropy", ratio: "4/3", photo: "pendleton_meet" },
    { title: "New York", category: "Lifestyle", ratio: "3/4", photo: "tribeca_trees" },
    { title: "Venice Film Festival", category: "Movies", ratio: "4/3", photo: "venice_carpet" },
    { title: "WWE Champion", category: "Wrestling", ratio: "3/4", photo: "champion_2013" },
    { title: "With Service Members", category: "Philanthropy", ratio: "3/4", photo: "xfl_selfie" },
    { title: "Walk of Fame", category: "Lifestyle", ratio: "1/1", photo: "star", focus: "50% 50%" },
    { title: "Title Night", category: "Wrestling", ratio: "4/3", photo: "title_2013", focus: "50% 40%" },
    { title: "Skyscraper Premiere", category: "Movies", ratio: "1/1", photo: "china_2018" },
    { title: "XFL Championship", category: "Business", ratio: "16/9", photo: "xfl_celebration", focus: "50% 50%" },
    { title: "With the Troops", category: "Philanthropy", ratio: "4/3", photo: "daytona_stage", focus: "50% 50%" },
    { title: "WrestleMania 32", category: "Wrestling", ratio: "16/9", photo: "wm32", focus: "50% 50%" },
    { title: "With Beau Flynn", category: "Movies", ratio: "4/3", photo: "hercules_flynn" },
    { title: "Tribeca", category: "Lifestyle", ratio: "3/4", photo: "tribeca_street" },
    { title: "Raw, Miami", category: "Wrestling", ratio: "16/9", photo: "raw_2012", focus: "50% 40%" },
  ],

  // 3 to 6 articles. date is YYYY-MM-DD. Set "url" to link out, or leave empty to open "body" in a panel.
  news: [
    { category: "Film", date: "2026-07-10", title: "Maui Returns in Live Action", photo: "venice_square", url: "",
      summary: "Disney's live-action Moana, with Johnson reprising the demigod Maui, was dated for a July 2026 release.",
      body: ["Ten years after the animated original, Disney's live-action retelling of Moana brings Johnson back to the role of Maui, this time on screen as well as in voice. He also serves as a producer."] },
    { category: "Film", date: "2025-10-03", title: "The Smashing Machine: A Dramatic Turn", photo: "venice_carpet", url: "",
      summary: "Johnson plays MMA pioneer Mark Kerr in Benny Safdie's A24 drama, first shown at the Venice Film Festival.",
      body: ["Written and directed by Benny Safdie, The Smashing Machine follows mixed-martial-arts fighter Mark Kerr at the height of his career. The film premiered at the Venice Film Festival before its theatrical release, and marks a clear change of register for its star."] },
    { category: "Film", date: "2024-11-27", title: "Moana 2 Sets Sail", photo: "red_one", url: "",
      summary: "Eight years on, Johnson is back as the voice of Maui in Disney's animated sequel.",
      body: ["Moana 2 reunites Johnson with Auliʻi Cravalho for a new voyage across the ocean, returning him to one of his best-loved roles."] },
    { category: "Wrestling", date: "2024-04-06", title: "Return to WrestleMania", photo: "wm28_rockbottom", focus: "50% 50%", url: "",
      summary: "The Rock steps back into the ring for the main event of WrestleMania XL's first night in Philadelphia.",
      body: ["Teaming with Roman Reigns against Cody Rhodes and Seth Rollins, The Rock returned to in-ring competition on wrestling's biggest stage."] },
    { category: "Sports", date: "2024-03-30", title: "The UFL Kicks Off", photo: "xfl_celebration", focus: "50% 50%", url: "",
      summary: "The United Football League, formed from the merger of the XFL and USFL, plays its first game.",
      body: ["Johnson, Dany Garcia and RedBird Capital acquired the XFL in 2020. Its merger with the USFL created the United Football League, which opened its inaugural season in spring 2024."] },
    { category: "Business", date: "2024-01-23", title: "A Seat at the TKO Table", photo: "wm31_rousey", url: "",
      summary: "Johnson joins the board of directors of TKO Group Holdings, the parent company of WWE and UFC.",
      body: ["The appointment brings Johnson into the boardroom of the company that owns the promotion where his career began."] },
  ],
};
