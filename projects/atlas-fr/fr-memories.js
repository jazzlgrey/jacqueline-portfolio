// ============================================================
// ATLAS-FR — memory data
// ------------------------------------------------------------
// This file is the ONLY file you edit when you add a memory to
// the graph. Omeka (omeka.net) stays the organising/cataloguing
// home; this file is the display layer that feeds the graph.
//
// WORKFLOW
//   1. Catalogue the item in Omeka as usual.
//   2. Copy its public item URL (the "…/items/show/12" link).
//   3. Export/download the image into
//      ../../assets/images/atlas-fr/
//   4. Add one entry to FR_MEMORIES below.
//   5. If you used a brand-new tag, add it to FR_TAGS too —
//      otherwise it renders in the neutral fallback colour.
//
// TWO EXPORTS, both attached to `window` so the p5 sketch and the
// page can read them without a build step:
//   window.FR_TAGS     — tag registry (cluster identity + colour)
//   window.FR_MEMORIES — the items themselves
// ============================================================


// ============================================================
// 1. TAGS  →  one tag = one cluster = one colour
// ------------------------------------------------------------
// `id`     matches the strings used in each memory's `tags` array.
//          Keep them lowercase-hyphenated; they must match exactly.
// `label`  is what a human sees in the legend / on the cluster.
// `color`  is the cluster + node colour, as a hex string.
// `blurb`  optional one-line description, shown in the legend.
//          Leave "" if you don't want one.
//
// A note on colour: these are chosen to sit on the near-black
// graph background. If you swap the background to cream, pick
// darker, more saturated values or the nodes will disappear.
// ============================================================

window.FR_TAGS = [
  {
    id: 'camera',
    label: 'on camera',
    color: '#E0FF17',
    blurb: 'moments captured in a single frame'
  },
  {
    id: 'language',
    label: 'langue',
    color: '#7BD5FF',
    blurb: 'mishearings, new words, the slow arrival of fluency.'
  },
  {
    id: 'conversations',
    label: 'conversations',
    color: '#FF8AB8',
    blurb: 'texts, interviews, conversations at an espresso bar'
  },
  {
    id: 'musings',
    label: 'musings',
    color: '#B49CFF',
    blurb: 'sketches, notes, stream of consciousness'
  },
   {
    id: 'tango',
    label: 'tango',
    color: '#8894fb',
    blurb: 'tango moments'
  }
];


// ============================================================
// 2. MEMORIES  →  one entry = one node
// ------------------------------------------------------------
// FIELD REFERENCE
//
//   id        string, required, unique. Used internally as the key.
//             Convention: "fr-001", "fr-002", …
//
//   title     string, required. Shown on hover and in the lightbox.
//
//   type      string, required. One of:
//               'sketch' | 'text' | 'musing' | 'message'
//               | 'interview' | 'photo'
//             The graph draws a different node SHAPE per type, so a
//             cluster can be read two ways at once: colour = tag,
//             shape = medium. ('text' and 'musing' share the circle.)
//             If you invent a new type it falls back to a circle —
//             give it its own shape in memory-graph.js → drawNodeShape().
//
//   tags      ARRAY of tag ids — square brackets even for a single
//             tag: ['musings'], not 'musings'. Every id must exist in
//             FR_TAGS above, spelled identically.
//             The FIRST tag is the "home" cluster — the one the node
//             physically sits in. Any further tags are secondary:
//             they make the node light up when that tag is
//             highlighted in the legend, but don't move it. This is
//             what keeps clusters legible instead of smearing
//             multi-tag items into the middle of the canvas.
//
//   date      string 'YYYY-MM-DD', optional. Purely descriptive —
//             shown in the lightbox, and available if you later want
//             to sort or animate the graph chronologically.
//
//   place     string, optional. Free text, e.g. 'Paris, 11e'.
//
//   image     string path relative to THIS file, or null.
//             Convention: '../../assets/images/atlas-fr/filename.jpeg'
//             Nodes with an image draw as a ring; text-only nodes
//             (musings, messages) draw solid.
//
//   images    ARRAY of paths — use INSTEAD of `image` when an item
//             has several. The lightbox then builds a carousel
//             (swipe, or the two arrow buttons) in array order.
//             Set one field or the other, not both: if `images` is
//             present, `image` is ignored. See fr-005.
//
//   excerpt   string, optional. A short pull-quote or transcript
//             fragment for the lightbox. Keep it under ~50 words —
//             the lightbox is a preview, not the archive itself.
//             FORMATTING, handled by formatExcerpt() in index.html:
//               \n     line break        \n\n  paragraph break
//               *text*  → italic         **text** → bold
//             Anything else is escaped, so quotes, <, and & in a
//             transcript are always safe to paste in verbatim.
//
//   omekaUrl  string, optional. The canonical Omeka item page. The
//             lightbox's "View in archive →" link points here. Set
//             to null while an item is still a draft; the link
//             hides itself automatically.
//
// The five entries below are PLACEHOLDERS demonstrating each type.
// Delete them as you replace them with real material.
// ============================================================

window.FR_MEMORIES = [
  {
    id: 'fr-001',
    title: 'un entrée de journal, 13 juin 2025',
    type: 'text',
    tags: ['musings'],
    date: '2025-06-13',
    place: "ma chambre à l'éstudine, paris, 20e",
    image: '../../assets/images/atlas-fr/0613_journal.jpeg',
    excerpt:
      "je suis ici pour le programme, cela n'est que la raison ostensible... " +
      "mais je suis aussi ici pour trouver qui je suis dans un autre pays, " +
      'dans un autre contexte.',
    omekaUrl: 'https://perlgrayfr.omeka.net/items/show/3'
  },
  {
    id: 'fr-002',
    title: 'mal du pays',
    type: 'musing',
    tags: ['musings', 'language'],
    date: '2025-06-18',
    place: null,
    image: null,
    excerpt:
      "je me sens un mal du pays mais l'origine du sentiment est ambiguë. " +
      "l'habitude et le comfort de Berkeley me manquent, mais je ne veux " +
      'pas vraiment y retourner.',
    omekaUrl: null
  },
  {
    id: 'fr-003',
    title: 'martin chez coffee avec des livres et des pattisseries',
    type: 'photo',
    tags: ['camera'],
    date: '2025-06-20',
    place: 'paris, 6e',
    image: '../../assets/images/atlas-fr/chez_cafe.jpeg',
    excerpt:
      'matcha latte, banana bread, and "on the appearance of the world" by Mark Foster Gage',
    omekaUrl: null
  },
  {
    id: 'fr-004',
    title: 'tango interview with lisa — manuscript',
    type: 'interview',
    tags: ['tango', 'conversations'],
    date: '2025-06-19',
    place: 'sensation dance school, paris, 13e',
    image: '../../assets/images/atlas-fr/interview_paris_tango.jpeg',
    excerpt:
      'photo of the manuscript of my interview with my friend, lisa, at a tango milonga in paris. later, i transcribed the'+ 
      'conversation and featured it in my paris tango project, which you can find in the "tango" cluster.',
    omekaUrl: null
  },
  {
    id: 'fr-005',
    title: 'just tango on - tango project, summer 2025',
    type: 'photo',
    tags: ['tango'],
    date: '2025-06-19',
    place: null,
    // MULTIPLE IMAGES → use `images` (plural, an array) instead of
    // `image`. The lightbox builds a swipeable carousel from it, in
    // exactly this order. One image? Either field works.
    images: [
      '../../assets/images/atlas-fr/tango_proj_cover.png',
      '../../assets/images/atlas-fr/interview_tango_proj.jpeg',
      '../../assets/images/atlas-fr/tango_proj_process.jpeg',
      '../../assets/images/atlas-fr/tango_proj.jpeg',
      '../../assets/images/atlas-fr/tango_proj_end.png'
    ],
    excerpt:
      'on this page, you\'ll find some excerpts from the paris-based project i did' +
      'for a class. for the topic, i chose tango in paris because i wanted to get to know ' +
      'this city and its people through a language that\'s not spoken but felt. ' +
      'my project outcome was a slide show with journal excerpts, reflections, interviews, and illustrations i created on procreate.'+
      ' (click on the buttons to navigate through the carousel and see the different images i created for this project.)',
    omekaUrl: null
  },
  {
    id: 'fr-006',
    title:'memory is a funny thing',
    type:'musing',
    tags:['musings'],
    date:'2025-06-15',
    place:'paris, 11e',
    images:['../../assets/images/atlas-fr/memory-bastille.png',
        '../../assets/images/atlas-fr/cafe_bastille.jpeg'
    ],
    excerpt:'some thoughts on memory that i jotted down in a shared notion page with my partner. the second image shows the café where i wrote these reflections.\n\n *"There is a line from Norwegian Wood that, upon rereading, resonated with me even more. It goes like this: "Memory is a funny thing. When I was in the scene, I barely paid it any mind. I never stopped to think of it as something that would make a lasting impression, certainly never imagined that 18 years later I\'d recall it in such detail... Now though, that meadow scene is the first thing that comes back to me."\
\n\n Memory is indeed a funny thing. When I think of Matt and I, the months of April and May we spent together, the first thing that enters my mind is his room. More precisely, where the door is to his bathroom from his bedroom. I\'m leaving the bathroom and looking at the bed, his dark blue bedsheet with my pink velvet bedspread on top, his blue stained glass lamp from his mother, pots of plants, and the window looking out to a lone tree on the Emerald Hills. The room baths in warm yellow afternoon sunlight ricocheted by the bay. The air wears a soft fragrance of sandalwood and eucalyptus incense, intensifying momentarily by an early summer breeze. It is quiet, only the melodious yet almost inaudible tinkling of the wind bell and the cooing of the cicadas. There is no one in the room. No Matt, no Ramses, I\'m not there either. As if we have left the house for the afternoon. \
\n\n Why is this scene so anchored into my mind? Why is this the scene I keep going back to when I\'ve come to Paris when I think of us? It is not a solitary scene, I know it isn\'t. It is not a particular moment but made of many moments elapsed."*',
    omekaUrl: null
  },
  {
    id: 'fr-007',
    title: 'new tango heels i got!',
    type: 'photo',
    tags: ['tango'],
    date: '2025-06-18',
    place: 'lalatango showroom, paris, 17e',
    image: '../../assets/images/atlas-fr/tangoheels_paris.jpeg',
    excerpt:
      'photo of the new pair of tango heels i got from lalatango, a tango shoe store in paris. they are burgendy red and have a 7cm heel.',
    omekaUrl: null
  },
  {
    id: 'fr-008',
    title: 'un après-midi au marché de la poésie',
    type: 'photo',
    tags: ['camera'],
    date: '2025-06-18',
    place: 'place saint-sulpice, paris, 6e',
    images: ['../../assets/images/atlas-fr/marchepoesie1.jpeg',
        '../../assets/images/atlas-fr/marchepoesie2.jpeg'
    ],
    excerpt:
      'an afternoon at the poetry market. i got two collections, one on music and one on silence.',
    omekaUrl: null
  },
  {
    id: 'fr-009',
    title: 'un après-midi au jardin',
    type: 'photo',
    tags: ['camera'],
    date: '2025-06-20',
    place: 'jardin du luxembourg, paris, 6e',
    image: '../../assets/images/atlas-fr/sketch_jardin.jpeg',
    excerpt: 
      'the luxembourg garden is my favorite place in paris - i love taking long walks there and sitting on the green-steel chair to read, write, and sketch - or just breathe and enjoy life.',
    omekaUrl: null
  },
  {
    id: 'fr-010',
    title: 'what am i painting when i paint?',
    type: 'sketch',
    tags: ['camera','musings'],
    date: '2025-06-27',
    place: 'falaise d\'amont, étretat, normandie, france',
    image: '../../assets/images/atlas-fr/musings_etretat.jpeg',
    excerpt: 
      'quick sketch and reflection on what it means to paint something as i see it, from a bench on the cliff of etretat. \
      tracing monet and my own journey. \
      \n\n p.s. a little kid was playing in his dad\'s arms next to me and watching me sketch - so adorable :)',
    omekaUrl: null
  },
  {
    id: 'fr-011',
    title: 'i don\'t want to go back',
    type: 'sketch',
    tags: ['camera','musings'],
    date: '2025-06-28',
    place: 'la plage d\'étretat, étretat, normandie, france',
    image: '../../assets/images/atlas-fr/musings2_etretat.jpeg',
    excerpt: 
      '*"what\'s on my mind?\
      \n\n je ne veux pas retourner à paris. je veux rester ici, dans les montagnes, sur les falaises. et tremper mes pieds dans les galets froids. \
      il me fait penser à l\'irlande, ici, le ciel sombre, et la falaise malheureuse.\
      \n\n sans surveillance, sans règles, le vent et le sel et la mer, la terre libre.*"',
    omekaUrl: null
  },
  {
    id: 'fr-012',
    title: 'je t\'attendais, je t\'attendrai.',
    type: 'musing',
    tags: ['musings'],
    date: '2025-06-26',
    place: 'lobby at *les tilleuls*, étretat, normandie, france',
    image: '../../assets/images/atlas-fr/mapoeme_etretat.jpeg',
    excerpt: 
      'a poem that i wrote while i was staying at the hotel in étretat. a few days before that, i was trapped in a thunderstorm in paris\
      and i was feeling a bit blue and lonely.\
      \n\n *\
      hier soir \n il y avait une tempête quand \n j\'attendais un taxi \n\n des orage, \n et des goutes immenses tembaient \n du ciel gris \n et malheureux -\
      \n\n comme le ciel derrière la fênetre de ta chambre \n ouvert sur un océan infini. \
      \n\n j\'attendais un taxi qui \n m\'emportait \n vers mon appartement - \
      \n\n sans toi, sans amour. \
      \n\n oui, j\'attendais un taxi \n dans la tempête \
      \n\n je t\'attendais. \n je t\'attendrai.*',
    omekaUrl: null
  },
  {
    id: 'fr-013',
    title: 'parisian tangueros!',
    type: 'message',
    tags: ['conversations'],
    date: '2025-06-14',
    place: 'online',
    image: '../../assets/images/atlas-fr/IMG_7326.jpg',
    excerpt: 
      'a text message i sent to my partner after going to my first tango milonga in paris.',
    omekaUrl: null
  },
  {
    id: 'fr-014',
    title: 'wait, where are we?',
    type: 'message',
    tags: ['conversations'],
    date: '2025-06-26',
    place: 'location not found',
    images: ['../../assets/images/atlas-fr/train_text.jpg', '../../assets/images/atlas-fr/beautiful_distress.jpeg'],
    excerpt: 
      'a screenshot of text messages that i sent to my partner after almost missing the train to étretat. \
      paris traffic + the labyrinthine gare saint-lazare + my friend who couldn\'t walk very fast because of her oversized shoes = \
      us catching the train in the last ten seconds. special thank-you to chatgpt, whom i consulted \
      while i was on the uber to the train station, for helping me pre-navigate through the station and find the right platform. \
      \n\n the second image shows the sequel to this episode: a photo of me in the middle of nowhere, because we got off the train at the wrong stop... \
      empty fields, no one around, only a few desolate houses. luckily, after half an hour of attempting to find an uber, \
      we finally found one and made it to étretat!',
    omekaUrl: null
  },
  {
    id: 'fr-015',
    title: 'scandalous - quelle horruer!',
    type: 'musing',
    tags: ['musings'],
    date: '2025-06-21',
    place: 'musée d\'orsay, paris, 7e',
    images: ['../../assets/images/atlas-fr/origine_journal.jpeg', '../../assets/images/atlas-fr/origine.jpeg'],
    excerpt: 
      'in one of the galleries at the musée d\'orsay, i found much to my surprise the once scandalous painting by gustave courbet,\
      "l\'origine du monde". it depicts the female genitalia in full in a hyper realistic way, as opposed to the traditional \
      censored depictions. it caused quite an outrage when it was first unveiled in 1866, and it was hidden away for many years. \
      i was curious to see the modern visitors\' reactions to the painting in 2025 - would they be shocked, disgusted, or intrigued? \
      so i sat down in a chair in the corner of the gallery and observed the visitors, jotting down what i saw in my notebook.',
    omekaUrl: null
  },
  {
    id: 'fr-016',
    title: 'can you hear the music?',
    type: 'photo',
    tags: ['camera'],
    date: '2025-06-27',
    place: 'les tilleuls, étretat, normandie, france',
    images: ['../../assets/images/atlas-fr/piano_etretat.jpeg','../../assets/images/atlas-fr/playingpiano_etretat.jpg'],
    excerpt: 
      'lovely piano i found in the lobby of the hotel i stayed at in étretat. i sat down and played some bach & debussy.',
    omekaUrl: null
  },
  {
    id: 'fr-017',
    title: 'roonie the cyclops',
    type: 'photo',
    tags: ['camera'],
    date: '2025-06-26',
    place: 'les tilleuls, étretat, normandie, france',
    image: '../../assets/images/atlas-fr/roonie.jpeg',
    excerpt: 
      'the dignified yet oh-so-cute cyclops cat that lives at the hotel i stayed at in étretat <3',
    omekaUrl: null
  }
];
