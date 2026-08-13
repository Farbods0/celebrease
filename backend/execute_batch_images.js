const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const fs = require('fs');
const path = require('path');

const targetFrontendDir = path.join(__dirname, '../frontend/public/uploads/holidays');
const targetBackendDir = path.join(__dirname, '../uploads/holidays');

if (!fs.existsSync(targetFrontendDir)) fs.mkdirSync(targetFrontendDir, { recursive: true });
if (!fs.existsSync(targetBackendDir)) fs.mkdirSync(targetBackendDir, { recursive: true });

const promptMatrix = {
    "thanksgiving": [
        "Architectural digest photo of a luxury Thanksgiving living room and fireplace mantel, rich autumn eucalyptus garlands, warm 2700K LED candle illumination, velvet pumpkins, dark moody oak backdrop, 35mm lens, photorealistic.",
        "Close-up interior photography of a Thanksgiving dining table centerpiece, linen table runner, polished brass taper candleholders, mini white pumpkins, autumn leaves, shallow depth of field.",
        "Macro photograph of plush orange velvet pumpkin stem resting on golden woven linen, soft flickering candle glow reflection, f/2.8 aperture, 85mm portrait macro.",
        "Professional overhead flat-lay product display of a Thanksgiving rental kit: velvet pumpkins, brass candleholders, eucalyptus garland strands, and linen runners on a dark slate surface, studio lighting."
    ],
    "fourth-of-july": [
        "Editorial outdoor patio photography of a Fourth of July celebration, navy blue and crimson linen table styling, vintage brass lanterns, starry string lights, twilight ambient lighting.",
        "Fourth of July al fresco dining table setup, navy blue runner, star-patterned glass lanterns, white hydrangeas, polished tableware, sunset glow.",
        "Macro detail of a vintage brass lantern housing glowing starry fairy lights, resting on textured indigo linen fabric, shallow depth of field.",
        "Overhead flat-lay studio photo of Fourth of July party decor kit: vintage brass lanterns, navy linen runner, star light strands, and patriotic napkins on white oak."
    ],
    "lunar-new-year": [
        "Architectural interior photo of a luxury Lunar New Year home setting, deep red and gold silk lanterns hanging high, cherry blossom branches in ceramic vase, brass ingot bowls, warm ambient lighting.",
        "Lunar New Year dining table centerpiece, gold embroidered crimson silk tablecloth, fine porcelain tea set, blooming plum blossoms, soft morning light.",
        "Macro detail of an intricate gold foil embroidered red silk envelope resting beside a polished brass tea bowl and cherry blossom petal, f/2.8.",
        "Overhead flat-lay display of Lunar New Year decor kit: red silk lanterns, gold tassel hangings, brass ingot bowls, and cherry blossom sprays on a dark wooden table."
    ],
    "dia-de-los-muertos": [
        "Editorial interior photo of a Day of the Dead altar and fireplace mantel, cascading marigold flower garlands, handcrafted ceramic sugar skulls, purple papel picado, glowing votive candles.",
        "Dia de los Muertos ofrenda table arrangement, vibrant marigold petals, terracotta candleholders, hand-painted sugar skulls, warm candle glow.",
        "Macro photograph of a hand-painted floral ceramic sugar skull surrounded by fresh marigold petals, warm flickering votive candlelight, soft bokeh.",
        "Overhead flat-lay studio display of Dia de los Muertos decor kit: laser-cut purple papel picado banner, marigold garlands, sugar skulls, and terracotta candles."
    ],
    "st-patricks-day": [
        "Luxury St Patricks Day dining room decor, deep emerald green linen table runner, shamrock eucalyptus garlands, polished brass candleholders, warm ambient lighting.",
        "St Patricks Day dining table centerpiece, clover leaf garland, gold coins in a polished brass dish, emerald linen napkins, fine crystal glassware.",
        "Macro detail of polished gold coins resting in a brass bowl beside fresh clover leaves on green linen, f/2.8 shallow depth of field.",
        "Overhead flat-lay photo of St Patricks Day kit: emerald linen runner, shamrock garland, brass candleholders, and gold coins arranged on dark hardwood."
    ],
    "passover": [
        "High-end Passover Seder room setting, silver and navy blue tablecloth, ornate silver Kiddush cups, silver Seder plate, Matzah cover, warm candlelight.",
        "Passover Seder table detail, embossed silver Seder plate with Hebrew lettering, Matzah velvet pouch, polished silver goblet, navy linen.",
        "Macro photograph of silver Kiddush cup reflecting warm candle flames beside velvet embroidered Matzah cover, shallow depth of field.",
        "Overhead flat-lay of Passover Seder kit: silver Seder plate, Kiddush cup, Matzah velvet cover, navy runner, and silver taper candles."
    ],
    "holi": [
        "Editorial interior photo of a Holi festival celebration room, vibrant silk hanging banners, handcrafted brass bowls filled with pink and yellow gulal powder, marigold garlands.",
        "Holi table centerpiece, brass bowls of colorful gulal powder, marigold flower petals, brass diyas, bright festive sunlight.",
        "Macro detail of vibrant magenta gulal powder texture in a handcrafted brass bowl with marigold petals, high resolution, f/2.8.",
        "Overhead flat-lay studio photo of Holi kit: brass powder bowls, colorful silk banners, marigold garlands, and vibrant table runners on light marble."
    ],
    "cinco-de-mayo": [
        "Festive Cinco de Mayo interior styling, authentic woven Serape table runner, terracotta pottery centerpieces, colorful papel picado banners, marigolds.",
        "Cinco de Mayo dining table detail, Serape runner, potted succulents in terracotta, marigold floral centerpieces, warm ambient lighting.",
        "Macro detail of woven Serape fabric texture and terracotta votive candleholder with marigold flower, soft bokeh.",
        "Overhead flat-lay photo of Cinco de Mayo kit: Serape runner, papel picado banner, terracotta pots, marigold garlands on rustic wood."
    ],
    "graduations": [
        "Luxury graduation party venue, sleek black and gold photo backdrop, diploma tassel garlands, warm fairy lights, marquee year numbers.",
        "Graduation celebration table setup, black and gold runner, diploma ribbon tied napkins, marquee numbers, fairy lights.",
        "Macro shot of golden year marquee numbers with soft bokeh fairy lights on black linen background, 85mm lens.",
        "Overhead flat-lay display of Graduation kit: marquee numbers, diploma tassel garland, black gold runner, and fairy light strands."
    ],
    "weddings-rehearsal-dinners": [
        "Romantic wedding rehearsal dinner venue, flowing white chiffon table runner, polished brass taper candleholders, fresh eucalyptus greenery, crystal stemware.",
        "Wedding head table centerpiece detail, white chiffon, brass taper holders, white roses, eucalyptus, glowing candlelight.",
        "Macro photograph of a polished brass taper candleholder with warm dripping wax and white rose petals, f/2.8 aperture.",
        "Overhead flat-lay studio photo of Wedding kit: white chiffon runner, brass taper holders, eucalyptus garlands, and votive cups on white marble."
    ],
    "gender-reveals": [
        "Charming gender reveal party backdrop, soft blush pink and baby blue balloon arch, white linen dessert table, golden mystery accents.",
        "Gender reveal table centerpiece, pink and blue floral arrangement, golden mystery boxes, white linen table runner.",
        "Close-up of golden mystery box with satin pink and blue ribbon under soft celebratory lighting.",
        "Overhead flat-lay display of Gender Reveal kit: balloon arch kit, pink blue runners, mystery boxes, and golden banners."
    ]
};

console.log(`Prework Manifest loaded! Total Holidays: ${Object.keys(promptMatrix).length}, Total Prompts: ${Object.keys(promptMatrix).length * 4}`);
