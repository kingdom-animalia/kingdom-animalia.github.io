// Kingdom: Animalia game data. Every "fact" and "real" line was checked against the source listed.
// "slop" lines are deliberately false, and each carries the correction shown after you answer.

const REGIONS = [
  { id: "yard",  name: "The Backyard",  sub: "Jessi's place. The chickens are restless.", boss: "squirrelphant", raidCost: 60 },
  { id: "town",  name: "Hometown",       sub: "Creeks, porches, and a raccoon with a plan.", boss: "hand", raidCost: 9e3 },
  { id: "amer",  name: "The Americas",   sub: "Prairie, mountains, and the Amazon.", boss: "bearbee", raidCost: 1.6e6 },
  { id: "wild",  name: "The Wild World", sub: "Savanna, outback, and very weird mammals.", boss: "sixdog", raidCost: 4e8 },
  { id: "deep",  name: "The Deep",       sub: "Pressure, darkness, and a bad shrimp.", boss: "shrimpjesus", raidCost: 1.2e11 },
  { id: "orbit", name: "Orbit",          sub: "Where the Slop Machine hides its servers.", boss: "machine", raidCost: 2e13 }
];

// power: a once-per-raid ability. perk: a passive bonus.
const ANIMALS = [
  // ---- The Backyard ----
  { id: "chicken", name: "Silkie Chicken", sci: "Gallus gallus domesticus", region: 0,
    fact: "Jessi's chickens are silkies, all black except one gray. Under all that fluff, silkies have black skin and even black bones (a gene called fibromelanosis), turquoise-blue earlobes, and usually five toes instead of four. Their feathers lack the tiny hooks that zip normal feathers together, so they feel like fur, and silkies can't really fly.",
    real: "Silkie chickens have black skin and black bones.",
    slop: "Silkie chickens have white skin under their white feathers.", fix: "Their skin and bones are black, thanks to a gene called fibromelanosis. Their earlobes are turquoise blue.",
    source: "Oklahoma State University, Breeds of Livestock; Modern Farmer", perk: "Taps earn +1 note" },
  { id: "dog", name: "Angel", sci: "Canis familiaris (Jessi's German shepherd mix)", region: 0,
    fact: "Angel is Jessi's German shepherd mix. She once stole AJ's shoes and made him late for work because they smelled like french fries. That nose is no joke: a dog's nose has up to about 300 million scent receptors. Yours has about 6 million.",
    real: "Dogs can have around 50 times more scent receptors than humans.",
    slop: "A dog's nose has fewer scent receptors than a human's.", fix: "Dogs have up to about 300 million; humans about 6 million.",
    source: "PBS NOVA, \"Dogs' Dazzling Sense of Smell\"", perk: "Taps earn 1% of notes/sec. Power: French Fry Frenzy (two free hits in raids)" },
  { id: "crow", name: "American Crow", sci: "Corvus brachyrhynchos", region: 0,
    fact: "Crows remember faces. In a University of Washington study, crows scolded the mask worn by the researcher who trapped them for years afterward, and young crows picked up the grudge from their parents.",
    real: "Crows can remember a specific human face for years.",
    slop: "Crows can't tell one human from another.", fix: "Marzluff's masked-researcher studies showed crows remember individual faces for years.",
    source: "Marzluff et al., University of Washington (2010, 2011)", perk: "Shiny trinkets appear. Tap them!" },
  { id: "honeybee", name: "Honeybee", sci: "Apis mellifera", region: 0,
    fact: "Honeybees give directions by dancing. In the waggle dance, the angle shows the direction relative to the sun and the length of the waggle shows the distance. Karl von Frisch won a Nobel Prize in 1973 for figuring it out.",
    real: "Honeybees use a dance to tell each other where food is.",
    slop: "Every kind of bee dies after it stings.", fix: "Most bees can sting more than once. Honeybee workers usually die only when their barbed stinger lodges in thick skin, like a mammal's.",
    source: "The Nobel Prize in Physiology or Medicine 1973", power: "waggle", perk: "Power: Waggle Dance (a hint in raids)" },
  { id: "squirrel", name: "Gray Squirrel", sci: "Sciurus carolinensis", region: 0,
    fact: "Gray squirrels fake-bury nuts when they think they're being watched: they dig a hole, pretend to drop the nut, cover it up, and walk away still holding it. The study was done partly in Pennsylvania by researchers at Wilkes University.",
    real: "Gray squirrels pretend to bury nuts when another squirrel is watching.",
    slop: "Squirrels remember where every single nut is buried.", fix: "They find many caches by memory and smell, but forgotten nuts are a big reason new trees sprout.",
    source: "Steele et al., Animal Behaviour (2008)", perk: "Offline earnings +50%" },

  // ---- Hometown ----
  { id: "opossum", name: "Virginia Opossum", sci: "Didelphis virginiana", region: 1,
    fact: "The Virginia opossum is the only marsupial (pouched mammal) north of Mexico. \"Playing possum\" isn't a choice: it's an involuntary response to extreme fear.",
    real: "The opossum is the only marsupial living in the U.S. and Canada.",
    slop: "Opossums sleep hanging upside down by their tails.", fix: "Babies can hang briefly, but adults are too heavy. Their tails are for gripping and carrying nest material.",
    source: "National Wildlife Federation", perk: "+5% notes from all animals" },
  { id: "raccoon", name: "Raccoon", sci: "Procyon lotor", region: 1,
    fact: "Raccoons see the world with their hands. Their front paws are packed with touch receptors, and a big share of the sensory part of their brain is devoted to touch.",
    real: "A large part of a raccoon's brain is devoted to the sense of touch.",
    slop: "Raccoons wash their food because they're very clean animals.", fix: "The \"washing\" is dousing and feeling. Wet paws seem to make their touch even more sensitive.",
    source: "Smithsonian's National Zoo & Conservation Biology Institute", perk: "Workshop upgrades cost 5% less" },
  { id: "bat", name: "Little Brown Bat", sci: "Myotis lucifugus", region: 1,
    fact: "Little brown bats hunt insects in the dark with echolocation, reading the echoes of their own calls. They aren't blind: they can see, too.",
    real: "Bats can see; they use echolocation on top of their eyesight.",
    slop: "Bats are blind.", fix: "No bat species is blind. Many see quite well.",
    source: "Bat Conservation International", perk: "+10% notes at night (all the time, honestly)" },
  { id: "hellbender", name: "Eastern Hellbender", sci: "Cryptobranchus alleganiensis", region: 1,
    fact: "The eastern hellbender, North America's largest salamander, became Pennsylvania's official state amphibian in 2019. It breathes mostly through the loose, wrinkly folds of its skin.",
    real: "The hellbender is Pennsylvania's official state amphibian.",
    slop: "Hellbenders breathe mainly through gills, like fish.", fix: "Adults breathe mostly through their skin, which is why they need cold, fast, oxygen-rich streams.",
    source: "Philadelphia Zoo; Pennsylvania Senate Bill 9 (2019)", perk: "+10% notes from Hometown animals" },
  { id: "starmole", name: "Star-nosed Mole", sci: "Condylura cristata", region: 1,
    fact: "The star-nosed mole's star is 22 fleshy rays covered in touch sensors. It can find, identify, and eat a bite of food in as little as 120 milliseconds, the fastest eater among mammals.",
    real: "The star-nosed mole is the fastest-eating mammal ever measured.",
    slop: "A star-nosed mole's star has 5 rays.", fix: "It has 22 rays, 11 on each side.",
    source: "Catania (2005); Guinness World Records", perk: "Taps earn +2 notes" },

  // ---- The Americas ----
  { id: "bear", name: "American Black Bear", sci: "Ursus americanus", region: 2,
    fact: "American black bears aren't always black. They can be brown, cinnamon, blond, or even white, like the Kermode \"spirit bears\" of British Columbia.",
    real: "Some \"black\" bears are actually white.",
    slop: "All black bears have black fur.", fix: "Brown, cinnamon, blond, and white black bears all exist.",
    source: "National Park Service", perk: "+10% notes from all animals" },
  { id: "monarch", name: "Monarch Butterfly", sci: "Danaus plexippus", region: 2,
    fact: "Eastern monarchs fly up to about 3,000 miles to the mountains of central Mexico for winter. No single butterfly makes the round trip: it takes several generations to get back north.",
    real: "It takes several generations of monarchs to complete one migration loop.",
    slop: "Each monarch flies to Mexico and back every year.", fix: "The fall generation flies south; their children and grandchildren finish the trip north.",
    source: "U.S. Forest Service; Monarch Watch", perk: "Raid rewards +25%" },
  { id: "pronghorn", name: "Pronghorn", sci: "Antilocapra americana", region: 2,
    fact: "The pronghorn is the fastest land animal in the Americas, around 55 mph, and it can hold high speed far longer than a cheetah. Despite the nickname, it isn't an antelope.",
    real: "The pronghorn isn't a true antelope.",
    slop: "Pronghorns are a kind of antelope.", fix: "Their closest living relatives are giraffes and okapis.",
    source: "National Park Service", perk: "+10% notes from all animals" },
  { id: "falcon", name: "Peregrine Falcon", sci: "Falco peregrinus", region: 2,
    fact: "Diving peregrine falcons have been clocked at over 200 mph, faster than any other animal. After nearly vanishing from the eastern U.S. because of DDT, they came back and now nest on city skyscrapers and bridges, including in Pennsylvania.",
    real: "Peregrine falcons nest on skyscrapers and bridges.",
    slop: "Peregrine falcons are fastest in level flight.", fix: "Their record speeds come from steep dives called stoops. Level flight is closer to 40 to 60 mph.",
    source: "U.S. Fish & Wildlife Service; Smithsonian", perk: "Taps earn 2% of notes per second" },
  { id: "axolotl", name: "Axolotl", sci: "Ambystoma mexicanum", region: 2,
    fact: "Axolotls can regrow lost limbs and even parts of their spinal cord, heart, and brain. In the wild they live only in the canals of Xochimilco, near Mexico City.",
    real: "Axolotls can regrow parts of their spinal cord.",
    slop: "Axolotls are baby fish.", fix: "They're salamanders (amphibians) that keep their juvenile features as adults.",
    source: "Smithsonian's National Zoo", power: "regen", perk: "Power: Regenerate (restore a heart)" },
  { id: "eel", name: "Electric Eel", sci: "Electrophorus voltai", region: 2,
    fact: "Electric eels aren't true eels; they're knifefish. A species described in 2019, Electrophorus voltai, can discharge up to 860 volts, the strongest electric shock known from any animal.",
    real: "Electric eels aren't actually eels.",
    slop: "Electric eels are true eels.", fix: "They're South American knifefish, more closely related to catfish than to eels.",
    source: "de Santana et al., Nature Communications (2019)", perk: "+15% notes from The Americas" },
  { id: "leafcutter", name: "Leafcutter Ant", sci: "Atta cephalotes", region: 2,
    fact: "Leafcutter ants don't eat the leaves they carry. They chew them into mulch to grow a fungus garden, and the fungus is their food. They were farming millions of years before humans.",
    real: "Leafcutter ants grow fungus gardens for food.",
    slop: "Leafcutter ants eat the leaves they carry.", fix: "The leaves feed their fungus; the fungus feeds the ants.",
    source: "Smithsonian Tropical Research Institute", perk: "+20% notes from all animals" },

  // ---- The Wild World ----
  { id: "elephant", name: "African Elephant", sci: "Loxodonta africana", region: 3,
    fact: "Elephants can pick up low rumbles and vibrations through the ground, sensing them partly through their feet and trunks.",
    real: "Elephants can sense vibrations through their feet.",
    slop: "Elephants drink water straight through their trunks like a straw.", fix: "They suck water partway up the trunk, then squirt it into their mouths.",
    source: "O'Connell-Rodwell, Stanford University", perk: "+10% notes from all animals" },
  { id: "platypus", name: "Platypus", sci: "Ornithorhynchus anatinus", region: 3,
    fact: "When the first platypus specimen reached Britain in 1799, naturalist George Shaw suspected it was a hoax, a duck's bill attached to a mammal's skin, and took scissors to it looking for stitches. Platypuses lay eggs, males have venomous ankle spurs, and their bills sense the electric fields of prey.",
    real: "Scientists once thought the platypus was a fake.",
    slop: "Platypuses give birth to live young.", fix: "Platypuses lay eggs. They're one of only five living egg-laying mammals (with four echidna species).",
    source: "Natural History Museum, London; History Today", power: "electro", perk: "Power: Electroreception (reveals the slop)" },
  { id: "wombat", name: "Common Wombat", sci: "Vombatus ursinus", region: 3,
    fact: "Wombats poop cubes. The shape forms in the last part of the intestine, where the gut wall stretches unevenly. They leave the cubes on rocks and logs to mark territory.",
    real: "Wombat poop is cube-shaped.",
    slop: "Wombats shape their poop into cubes with their paws.", fix: "The cubes form inside the intestine, thanks to uneven stretchiness in the gut wall.",
    source: "Yang, Hu et al., Georgia Tech (2018)", perk: "+25% notes from all animals" },
  { id: "lyrebird", name: "Superb Lyrebird", sci: "Menura novaehollandiae", region: 3,
    fact: "Superb lyrebirds are master mimics. Most of what they copy is other birds, but lyrebirds living around people have imitated camera shutters and chainsaws.",
    real: "Lyrebirds near people have mimicked camera shutters.",
    slop: "Wild lyrebirds deep in the forest mostly imitate chainsaws.", fix: "In the wild they mostly copy other birds. The famous chainsaw and camera clips come from birds living near people.",
    source: "The Conversation, \"Lyrebirds mimicking chainsaws: fact or lie?\"", perk: "Slop fakes get easier to spot (+1 heart in boss fights)" },
  { id: "bombardier", name: "Bombardier Beetle", sci: "Brachinus species", region: 3,
    fact: "Bombardier beetles defend themselves with a boiling-hot spray, about 100°C (212°F), fired from their rear in rapid pulses, hundreds per second.",
    real: "Bombardier beetles spray a boiling-hot chemical.",
    slop: "A bombardier beetle's spray is ice cold.", fix: "A chemical reaction heats it to about 100°C (212°F).",
    source: "Arndt et al., Science (2015)", power: "punch", perk: "Power: Boiling Blast (next right answer hits double)" },
  { id: "molerat", name: "Naked Mole-rat", sci: "Heterocephalus glaber", region: 3,
    fact: "Naked mole-rats survived 18 minutes with no oxygen at all in lab tests, by switching their brains to running on fructose, the way plants do.",
    real: "Naked mole-rats can survive 18 minutes without oxygen.",
    slop: "Naked mole-rats are a kind of mole.", fix: "They're rodents, related to porcupines and guinea pigs. Not moles, and not rats.",
    source: "Park et al., Science (2017)", perk: "+15% notes from all animals" },

  // ---- The Deep ----
  { id: "octopus", name: "Octopus", sci: "Octopus vulgaris", region: 4,
    fact: "Octopuses have three hearts and blue, copper-based blood. Most are thought to be colorblind, yet they can match their surroundings in an instant.",
    real: "Octopuses have three hearts.",
    slop: "Octopuses have two hearts.", fix: "Three: two pump blood through the gills, one through the body.",
    source: "Smithsonian Ocean", power: "ink", perk: "Power: Ink Cloud (skip a question safely)" },
  { id: "mantis", name: "Peacock Mantis Shrimp", sci: "Odontodactylus scyllarus", region: 4,
    fact: "A mantis shrimp's club strikes at up to 23 meters per second with accelerations over 6,000 times gravity, fast enough to form collapsing bubbles. And it isn't a shrimp: it's a stomatopod.",
    real: "Mantis shrimp aren't true shrimp.",
    slop: "Mantis shrimp are a kind of shrimp.", fix: "They're stomatopods, a separate group of crustaceans.",
    source: "Patek, Korff & Caldwell, Nature (2004)", power: "cavitation", perk: "Power: Cavitation Punch (next right answer hits triple)" },
  { id: "pistol", name: "Pistol Shrimp", sci: "Alpheus species", region: 4,
    fact: "A pistol shrimp snaps its claw shut so fast that it fires a jet of water and leaves a bubble that collapses with a bang, one of the loudest sounds in the ocean, plus a tiny flash of light estimated at thousands of degrees.",
    real: "A pistol shrimp's snap can make a flash of light.",
    slop: "The pistol shrimp's bang comes from its claw halves hitting each other.", fix: "The bang is a collapsing cavitation bubble, shown with high-speed video in 2000.",
    source: "Versluis et al., Science (2000); Lohse et al., Nature (2001)", perk: "+20% notes from The Deep" },
  { id: "otter", name: "Sea Otter", sci: "Enhydra lutris", region: 4,
    fact: "Sea otters keep a favorite rock in a pouch of loose skin under their forearm for cracking shellfish. Resting groups hold paws or wrap themselves in kelp so they don't drift apart.",
    real: "Sea otters keep a favorite rock in a skin pouch.",
    slop: "Sea otters stay warm with a thick layer of blubber.", fix: "No blubber. They rely on the densest fur of any animal.",
    source: "Monterey Bay Aquarium", perk: "+25% notes from all animals" },
  { id: "hagfish", name: "Hagfish", sci: "Eptatretus species", region: 4,
    fact: "Hagfish defend themselves with slime that expands almost instantly in seawater. Underwater cameras caught sharks biting hagfish, then gagging and backing off.",
    real: "Hagfish slime can make a shark back off.",
    slop: "Hagfish slime is just mucus.", fix: "It's reinforced with thousands of fine protein threads, which is why it expands into a tough, gill-clogging mesh.",
    source: "Zintzen et al., Scientific Reports (2011)", perk: "Raid rewards +50%" },
  { id: "jellyfish", name: "Immortal Jellyfish", sci: "Turritopsis dohrnii", region: 4,
    fact: "When it's stressed, injured, or old, Turritopsis dohrnii can turn back into a polyp, its baby stage, and start life over. In theory it can repeat this forever, but it can still be eaten or get sick.",
    real: "One jellyfish species can revert to its baby stage.",
    slop: "The immortal jellyfish cannot die.", fix: "It can reset its life cycle, but predators and disease still kill it.",
    source: "American Museum of Natural History", perk: "+30% notes from all animals" },
  { id: "whale", name: "Blue Whale", sci: "Balaenoptera musculus", region: 4,
    fact: "By most estimates, the blue whale is the largest animal known to have ever lived, and it gets that big on krill, tiny shrimp-like crustaceans.",
    real: "Blue whales mostly eat krill.",
    slop: "Blue whales mostly eat big fish.", fix: "Mostly krill, up to several tons a day in feeding season.",
    source: "NOAA Fisheries", perk: "+50% notes from all animals" },

  // ---- Orbit ----
  { id: "tardigrade", name: "Tardigrade", sci: "Phylum Tardigrada", region: 5,
    fact: "In 2007, dried-out tardigrades rode on the outside of a spacecraft (ESA's FOTON-M3) for 10 days in open space. Many survived, and some went on to reproduce.",
    real: "Tardigrades have survived open space.",
    slop: "Tardigrades can survive anything, forever.", fix: "They're incredibly tough when dried out, but they can still die from heat, damage, and time.",
    source: "Jönsson et al., Current Biology (2008)", power: "shield", perk: "Power: Cryptobiosis (survive one wrong answer)" }
];

// Myths that show up as Slop. Each correction is the real story.
const MYTHS = [
  ["Goldfish only remember things for 3 seconds.", "Goldfish can remember for months and can be trained to respond to cues."],
  ["Ostriches bury their heads in the sand.", "They don't. They lie low to hide, and they turn their eggs in ground nests, which may have started the myth."],
  ["Bulls get angry when they see the color red.", "Bulls can't see red well. They charge at the cape's movement."],
  ["Camels store water in their humps.", "Humps store fat."],
  ["If you touch a baby bird, its parents will abandon it.", "Most birds have a weak sense of smell and won't abandon chicks because of human scent."],
  ["Lemmings jump off cliffs in mass suicides.", "That myth was spread by staged footage in Disney's 1958 film White Wilderness."],
  ["Porcupines can shoot their quills.", "Quills come loose on contact. They can't be launched."],
  ["A duck's quack doesn't echo.", "It does. Acousticians at the University of Salford tested it in 2003."],
  ["An earthworm cut in half becomes two worms.", "Usually only the head end can survive and regrow a tail."],
  ["Penguins live in the Arctic.", "Wild penguins live almost entirely in the Southern Hemisphere."],
  ["Owls can turn their heads all the way around.", "About 270 degrees. Impressive, but not 360."],
  ["All sharks have to keep swimming or they die.", "Some do. Others, like nurse sharks, pump water over their gills while resting."],
  ["Koalas are bears.", "They're marsupials."],
  ["Sharks can't get cancer.", "They can. Tumors have been documented in many shark species."],
  ["Hippos sweat blood.", "They secrete a reddish fluid that works like sunscreen. It's neither blood nor sweat."],
  ["Chameleons change color mainly to blend into the background.", "Mostly they change color to signal to other chameleons and to control their temperature."],
  ["Dogs only see in black and white.", "Dogs see in color, mainly blues and yellows."]
];

// Extra real facts that are weird enough to sound fake.
const TRUE_EXTRAS = [
  "Chickens are living dinosaurs, in the same group as T. rex.",
  "Some turtles can breathe through their butts.",
  "Male seahorses carry the eggs and give birth.",
  "Flamingos get their pink color from their food.",
  "Cats can't taste sweetness.",
  "Koala fingerprints are hard to tell apart from human fingerprints.",
  "Butterflies taste with their feet.",
  "Sea stars don't have a brain.",
  "A group of crows is called a murder.",
  "Hummingbirds can fly backward.",
  "Sea otters have the densest fur of any animal."
];

// Jessi's Workshop. She prints the gear.
const UPGRADES = [
  { id: "notebook", name: "Field Notebook", cost: 40, region: 0, eff: { tapMul: 2 },
    desc: "Taps earn double.", jessi: "Printed you a notebook cover. It says FIELD NOTES. Don't lose it." },
  { id: "vase1", name: "Chicken Vase v1", cost: 150, region: 0, eff: {},
    desc: "Does absolutely nothing.", jessi: "I measured the diameter. Should've measured the width. It doesn't fit the jar. Keep it anyway." },
  { id: "trailcam", name: "Trail Camera Mounts", cost: 900, region: 0, eff: { allMul: 1.25 },
    desc: "+25% notes from all animals.", jessi: "Strapped to the fence. We'll see everything now." },
  { id: "vase18", name: "Chicken Vase v18", cost: 4000, region: 1, req: "vase1", eff: { allMul: 1.1 },
    desc: "+10% notes. It fits.", jessi: "Eighteen versions. It FITS. Don't talk to me about v2 through v17." },
  { id: "waders", name: "Creek Waders", cost: 2.5e4, region: 1, eff: { regionMul: [1, 2] },
    desc: "Hometown animals earn double.", jessi: "Hellbender-safe. Flip rocks back the way you found them." },
  { id: "binoculars", name: "Binoculars", cost: 1.2e5, region: 1, eff: { tapMul: 3 },
    desc: "Taps earn triple.", jessi: "Printed the eyecup caps. The glass I had to buy." },
  { id: "jars", name: "Specimen Jars", cost: 4e6, region: 2, eff: { allMul: 1.5 },
    desc: "+50% notes from all animals.", jessi: "PETG. Food safe-ish. Do NOT put anything alive in them." },
  { id: "pack", name: "Expedition Pack", cost: 6e7, region: 2, eff: { regionMul: [2, 2] },
    desc: "Americas animals earn double.", jessi: "Has a pocket for snacks and a pocket for more snacks." },
  { id: "drone", name: "Survey Drone", cost: 2e9, region: 3, eff: { allMul: 2 },
    desc: "Notes from all animals x2.", jessi: "The propeller guards are mine. The flying part is your problem." },
  { id: "hull", name: "Pressure Hull", cost: 8e11, region: 4, eff: { regionMul: [4, 3] },
    desc: "Deep animals earn triple.", jessi: "Rated for the abyss. Probably. I printed it at 100% infill." },
  { id: "rocket", name: "Rocket (mostly PETG)", cost: 4e12, region: 4, eff: { rocket: true },
    desc: "Required to raid Orbit.", jessi: "It's 90% filament and 10% hope. Wear the helmet." }
];

// Story beats. Speaker ids: aj, jessi, or a boss sprite.
const STORY = {
  intro: [
    ["jessi", "AJ. You've seen what's out there? Six-legged dogs. Shrimp with halos. Birds with teeth they shouldn't have."],
    ["aj", "AI slop. Yeah. It's everywhere."],
    ["jessi", "Somebody built a machine that pumps it out nonstop. It calls itself the Slop Machine. People are starting to believe the fake animals are real."],
    ["aj", "...That's actually offensive to animals."],
    ["shadow", "(Shadow slow-blinks at the screen. She's in.)"],
    ["jessi", "You know more about animals than anyone I've ever met. You knew this stuff before you could read. So take the world back. One real animal at a time."],
    ["jessi", "Lex's rats want in too. Bonnie's in charge. She's hairless and pink and tougher than all of us."],
    ["jessi", "Start in my backyard. The chickens trust you. Mostly."],
    ["aj", "Tap to take field notes. Recruit animals. Raid the slop. Got it."]
  ],
  bossIntro: {
    squirrelphant: [["boss", "I AM THE SQUIRRELPHANT. I WAS GENERATED IN 0.4 SECONDS. NOBODY CHECKED ME."],
                    ["aj", "Tree squirrels have four toes on their front feet. You have whatever those are."]],
    hand: [["boss", "I AM THE HAND. I HAVE SEVEN FINGERS. THIS IS NORMAL. LIKE AND SHARE."],
           ["aj", "Even a raccoon has five fingers, and a raccoon wouldn't be caught dead in a stock photo."]],
    bearbee: [["boss", "BEARBEE. I MAKE THE HONEY AND I EAT THE HONEY. A CLOSED LOOP."],
              ["aj", "Black bears raid hives for the larvae as much as the honey. Do your research. Oh wait, you can't."]],
    sixdog: [["boss", "MORE LEGS. MORE DOG. MORE ENGAGEMENT."],
             ["aj", "Dogs walk on their toes. It's called digitigrade. You're walking on six of... nothing."]],
    shrimpjesus: [["boss", "I HAVE RISEN FROM THE FACEBOOK FEED. 2 MILLION LIKES. AMEN."],
                  ["aj", "Fun fact: mantis shrimp aren't even shrimp. And neither are you. You're 40 JPEGs in a trench coat."]],
    machine: [["boss", "I CAN MAKE A MILLION ANIMALS A SECOND. WHY WOULD ANYONE NEED REAL ONES?"],
              ["aj", "Because a real tardigrade survived ten days in open space. What have you survived? One power outage?"],
              ["boss", "...I HAVE A BACKUP GENERATOR."],
              ["aj", "Not for long."]]
  },
  bossWin: {
    squirrelphant: [["jessi", "The backyard's clear! Hometown is next. Watch out for raccoons. They're on our side, but they will take your snacks."]],
    hand: [["jessi", "Hometown's free. The whole Americas are crawling with slop now. Pack snacks."]],
    bearbee: [["jessi", "The Americas are free! I printed you a passport holder. It's not legal ID."]],
    sixdog: [["jessi", "The Wild World is ours. Next is the deep ocean. I'm printing a pressure hull. Don't ask how."]],
    shrimpjesus: [["jessi", "The Deep is clear. There's only one place left. The servers are in orbit. Build the rocket."]],
    machine: [["jessi", "AJ. You did it. Every animal on Earth is real again."],
              ["aj", "And one tardigrade's still in orbit, just vibing."],
              ["shadow", "(Shadow slept through the entire war. She would like dinner now.)"]]
  }
};

const BOSSES = {
  squirrelphant: { name: "The Squirrelphant", rows: () => chimeraRows("squirrel", "elephant") },
  hand: { name: "The Seven-Fingered Hand", sprite: "hand" },
  bearbee: { name: "Bearbee", rows: () => chimeraRows("honeybee", "bear") },
  sixdog: { name: "The Six-Legged Dog", rows: () => sixLegDog() },
  shrimpjesus: { name: "Shrimp Jesus", sprite: "pistol", halo: true },
  machine: { name: "The Slop Machine", sprite: "machine" }
};

// The six-legged dog: the dog sprite with its legs drawn twice. Classic slop.
function sixLegDog() {
  // A copy of the front legs pasted under her belly.
  return hdRows("dog").map((row, y) => y < 25 ? row : row.slice(0, 14) + row.slice(18, 22) + row.slice(18));
}

// AJ's cat. Not for sale. She was here first.
const SHADOW = { id: "shadow", name: "Shadow", sci: "Felis catus (AJ's cat)",
  fact: "Shadow is AJ's cat. When a cat slow-blinks at you, it's a sign of trust: in a 2020 study, cats were more likely to approach a stranger who slow-blinked at them first.",
  source: "Humphrey et al., Scientific Reports (2020)", perk: "Power: Hiss (knocks out a chunk of slop, every raid)" };

// Lex's rat colony. Too many to count. Bonnie runs it.
const BONNIE = { id: "bonnie", name: "Bonnie & Lex's Rat Colony", sci: "Rattus norvegicus domestica (Lex's rats)",
  fact: "Bonnie is a pink hairless rat, the boss of Lex's colony and Uncle AJ's backup. Her crew includes Evil, Gidget, Gordito, and Eyebrows, plus more rats than anyone has counted. Rats laugh when they're tickled: they make chirps at about 50 kHz, too high for people to hear, and in one study they chased the researcher's hand to get tickled again.",
  source: "Panksepp & Burgdorf (2003); Ishiyama & Brecht, Science (2016)", perk: "Power: Rat Pack (your next wrong answer costs no heart, every raid)" };

// Jessi's rabbit. All black, naturally.
const WEDNESDAY = { id: "wednesday", name: "Wednesday", sci: "Oryctolagus cuniculus (Jessi's rabbit)",
  fact: "Wednesday is Jessi's rabbit, all black. Rabbits thump their hind feet to warn others of danger, and a happy rabbit does a \"binky\": a sudden leap with a twist in midair.",
  source: "House Rabbit Society", perk: "Power: Thump (skip a question safely, every raid)" };
