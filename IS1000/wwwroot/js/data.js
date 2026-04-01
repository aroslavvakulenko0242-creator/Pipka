// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ДАННЫЕ (заглушки)
// ============================================================

// Список героев (для datalist)
const heroesList = [
    "Abaddon", "Alchemist", "Ancient Apparition", "Anti Mage", "Arc Warden", "Axe", "Bane", "Batrider", "Beastmaster",
    "Bloodseeker", "Bounty Hunter", "Brewmaster", "Bristleback", "Broodmother", "Centaur Warrunner", "Chaos Knight",
    "Chen", "Clinkz", "Clockwerk", "Crystal Maiden", "Dark Seer", "Dark Willow", "Dawnbreaker", "Dazzle", "Death Prophet",
    "Disruptor", "Doom", "Dragon Knight", "Drow Ranger", "Earth Spirit", "Earthshaker", "Elder Titan", "Ember Spirit",
    "Enchantress", "Enigma", "Faceless Void", "Grimstroke", "Gyrocopter", "Hoodwink", "Huskar", "Invoker", "Io",
    "Jakiro", "Juggernaut", "Keeper of the Light", "Kez", "Kunkka", "Legion Commander", "Leshrac", "Lich", "Lifestealer",
    "Lina", "Lion", "Lone Druid", "Luna", "Lycan", "Magnus", "Marci", "Mars", "Medusa", "Meepo", "Mirana", "Monkey King",
    "Morphling", "Muerta", "Naga Siren", "Nature s Prophet", "Necrophos", "Night Stalker", "Nyx Assassin", "Ogre Magi",
    "Omniknight", "Oracle", "Outworld Destroyer", "Pangolier", "Phantom Assassin", "Phantom Lancer", "Phoenix", "Primal Beast",
    "Puck", "Pudge", "Pugna", "Queen of Pain", "Razor", "Riki", "Ringmaster", "Rubick", "Sand King", "Shadow Demon",
    "Shadow Fiend", "Shadow Shaman", "Silencer", "Skywrath Mage", "Slardar", "Slark", "Snapfire", "Sniper", "Spectre",
    "Spirit Breaker", "Storm Spirit", "Sven", "Techies", "Templar Assassin", "Terrorblade", "Tidehunter", "Timbersaw",
    "Сын Шлюхи", "Tiny", "Treant Protector", "Troll Warlord", "Tusk", "Underlord", "Undying", "Ursa", "Vengeful Spirit",
    "Venomancer", "Viper", "Visage", "Void Spirit", "Warlock", "Weaver", "Windranger", "Winter Wyvern", "Witch Doctor",
    "Wraith King", "Zeus", "Largo"
];

// Список предметов (для datalist) – сокращённый для примера, можно расширить
const itemsList = [
    // === РАСХОДНИКИ ===
    "Clarity", "Tango", "Healing Salve", "Smoke of Deceit", "Town Portal Scroll", "Dust of Appearance",
    "Observer Ward", "Sentry Ward", "Bottle", "Infused Raindrops", "Blood Grenade",

    // === ОСНОВНЫЕ КОМПОНЕНТЫ ===
    "Iron Branch", "Gauntlets of Strength", "Slippers of Agility", "Mantle of Intelligence", "Circlet",
    "Belt of Strength", "Band of Elvenskin", "Robe of the Magi", "Chainmail", "Ring of Protection",
    "Quelling Blade", "Blades of Attack", "Gloves of Haste", "Boots of Speed", "Ring of Regen",
    "Sage's Mask", "Magic Stick", "Ring of Health", "Void Stone", "Energy Booster", "Vitality Booster",
    "Point Booster", "Staff of Wizardry", "Ogre Axe", "Blade of Alacrity", "Helm of Iron Will",
    "Mithril Hammer", "Javelin", "Broadsword", "Claymore", "Platemail", "Talisman of Evasion",
    "Cloak", "Shadow Amulet", "Ghost Scepter", "Morbid Mask", "Blitz Knuckles", "Fluffy Hat",
    "Wind Lace", "Crown", "Diadem", "Cornucopia", "Voodoo Mask", "Tiara of Selemene", "Ring of Tarrasque",

    // === ОБУВЬ ===
    "Power Treads", "Phase Boots", "Arcane Boots", "Tranquil Boots", "Boots of Travel",
    "Boots of Bearing", "Guardian Greaves",

    // === БАЗОВЫЕ СОБИРАЕМЫЕ ПРЕДМЕТЫ ===
    "Magic Wand", "Soul Ring", "Null Talisman", "Wraith Band", "Bracer", "Orb of Venom", "Blight Stone",
    "Ring of Basilius", "Headdress", "Buckler", "Medallion of Courage", "Pavise", "Solar Crest",
    "Drum of Endurance", "Vladmir's Offering", "Holy Locket", "Spirit Vessel", "Urn of Shadows",
    "Veil of Discord", "Glimmer Cape", "Force Staff", "Hurricane Pike", "Rod of Atos", "Aether Lens",
    "Eul's Scepter of Divinity", "Oblivion Staff", "Perseverance", "Hand of Midas", "Falcon Blade",
    "Orb of Corrosion", "Echo Sabre", "Mage Slayer", "Phylactery", "Khanda",

    // === МАГИЧЕСКИЕ ПРЕДМЕТЫ ===
    "Dagon", "Scythe of Vyse", "Orchid Malevolence", "Bloodthorn", "Refresher Orb", "Octarine Core",
    "Aghanim's Scepter", "Aghanim's Blessing", "Aghanim's Shard", "Black King Bar", "Linken's Sphere",
    "Lotus Orb", "Wind Waker",

    // === ОРУЖИЕ ===
    "Crystalys", "Daedalus", "Monkey King Bar", "Divine Rapier", "Battle Fury", "Radiance", "Desolator",
    "Nullifier", "Silver Edge", "Shadow Blade", "Armlet of Mordiggian", "Skull Basher", "Abyssal Blade",
    "Ethereal Blade", "Revenant's Brooch", "Bloodstone",

    // === БРОНЯ ===
    "Vanguard", "Crimson Guard", "Blade Mail", "Shiva's Guard", "Assault Cuirass", "Heart of Tarrasque",
    "Satanic", "Soul Booster", "Aeon Disk", "Eternal Shroud", "Pipe of Insight", "Hood of Defiance",

    // === ARTIFACTS (ЛЕГЕНДАРНЫЕ ПРЕДМЕТЫ) ===
    "Sange", "Yasha", "Kaya", "Sange and Yasha", "Kaya and Sange", "Yasha and Kaya", "Heaven's Halberd",
    "Manta Style", "Butterfly", "Eye of Skadi", "Mjollnir", "Maelstrom", "Gleipnir", "Diffusal Blade",
    "Harpoon", "Meteor Hammer", "Disperser",

    // === NEUTRAL ITEMS (НЕЙТРАЛЬНЫЕ ПРЕДМЕТЫ) ===
    // Tier 1
    "Arcane Ring", "Broom Handle", "Faded Broach", "Ironwood Tree", "Mango Tree", "Occult Bracelet",
    "Pig Pole", "Royal Jelly", "Seeds of Serenity", "Trusty Shovel", "Vambrace",
    // Tier 2
    "Bullwhip", "Cloak of Flames", "Dragon Scale", "Essence Ring", "Grove Bow", "Nether Shawl",
    "Philosopher's Stone", "Ring of Aquila", "Specialist's Array", "Vampire Fangs",
    // Tier 3
    "Ceremonial Robe", "Craggy Coat", "Enchanted Quiver", "Paladin Sword", "Psychic Headband",
    "Quickening Charm", "Repair Kit", "Spider Legs", "Telescope", "Titan Sliver",
    // Tier 4
    "Flicker", "Giant's Ring", "Illusionist's Cape", "Magic Lamp", "Minotaur Horn", "Ninja Gear",
    "Spell Prism", "Stormcrafter", "Timeless Relic", "Witchbane",
    // Tier 5
    "Apex", "Ballista", "Book of the Dead", "Ex Machina", "Fallen Sky", "Force Boots", "Fusion Rune",
    "Mirror Shield", "Pirate Hat", "Seer Stone", "Stygian Desolator", "Trident", "Woodland Striders",

    // === НОВЫЕ ПРЕДМЕТЫ PATCH 7.41 [citation:1][citation:7] ===
    // Basic items
    "Chasm Stone", "Shawl", "Splintmail", "Wizard Hat",
    // New items
    "Consecrated Wraps", "Crella's Crozier", "Essence Distiller", "Hydra's Breath",
    // New neutral items
    "Forager's Kit", "Stonefeather Satchel", "Partisan's Brand", "Spellslinger", "Conjurer's Catalyst",
    "Prophet's Pendulum", "Harmonizer", "Dagger of Ristul", "Possessed Mask", "Enchanter's Bauble",
    "Dandelion Amulet"
];



// В data.js замените заглушки на:
async function addMatch(matchData) {
    const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            heroName: matchData.HeroName,
            position: matchData.Position,
            loseWin: matchData.Lose_win,
            items: matchData.Items
        })
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return { success: true, message: "Match data added successfully!" };
}

async function getTopHeroes(position) {
    const response = await fetch(`/api/meta/heroes?position=${encodeURIComponent(position)}`);
    if (!response.ok) throw new Error('Failed to fetch top heroes');
    const data = await response.json();
    // data = [{ name: "Slark", winrate: 60.5 }, ...]
    return data;
}

async function getHeroGames(heroName) {
    const response = await fetch(`/api/hero/${encodeURIComponent(heroName)}/recent`);
    if (!response.ok) throw new Error('Failed to fetch hero games');
    const games = await response.json();
    // games = [{ result: "Win", items: [...] }, ...]
    return games;
}