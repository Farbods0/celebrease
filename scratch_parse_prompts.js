const fs = require('fs');
const text = fs.readFileSync('C:\\Users\\farbo\\Downloads\\photo-prompts.txt', 'utf8');

const results = {};
let currentHoliday = null;
let currentTier = null;

const lines = text.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for Holiday
    const hMatch = line.match(/^\s*([A-Z\s']+)\s+·\s+Category:/);
    if (hMatch) {
        currentHoliday = hMatch[1].trim();
        if (currentHoliday === "NEW YEAR'S EVE") currentHoliday = "New Year's";
        if (currentHoliday === "VALENTINE'S DAY") currentHoliday = "Valentine's Day";
        // Title case for the rest
        if (currentHoliday === "RAMADAN") currentHoliday = "Ramadan";
        if (currentHoliday === "CHRISTMAS") currentHoliday = "Christmas";
        if (currentHoliday === "HALLOWEEN") currentHoliday = "Halloween";
        if (currentHoliday === "BIRTHDAYS") currentHoliday = "Birthdays";
        
        results[currentHoliday] = {};
        continue;
    }
    
    // Check for Tier
    const tMatch = line.match(/^\s*(STANDARD|PREMIUM|ULTRA)\s+TIER/);
    if (tMatch && currentHoliday) {
        currentTier = tMatch[1];
        if (currentTier === 'ULTRA') currentTier = 'ULTIMATE';
        results[currentHoliday][currentTier] = [];
        continue;
    }
    
    // Check for Photo Prompt
    if (line.match(/^\s*\[Photo \d+/)) {
        let promptText = "";
        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^\s*\[Photo \d+/) && !lines[j].match(/^─+/) && !lines[j].match(/^═+/)) {
            if (lines[j].trim() !== "") {
                promptText += lines[j].trim() + " ";
            }
            j++;
        }
        if (currentHoliday && currentTier && promptText.trim()) {
            results[currentHoliday][currentTier].push(promptText.trim());
        }
        i = j - 1;
    }
}

console.log(JSON.stringify(results, null, 2));
