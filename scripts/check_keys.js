const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch_prompts_parsed.json', 'utf8'));

const targets = {
    "Birthdays": ["Silver", "Gold"],
    "Christmas": ["Silver", "Gold", "Platinum"],
    "Halloween": ["Silver", "Gold"],
    "New Year's": ["Silver", "Gold"],
    "Ramadan": ["Silver"],
    "Valentine's Day": ["Silver", "Gold"]
};

// Note: Birthdays might not be in the prompts file? Wait, Birthdays wasn't in the list I saw? The list I saw ended with Engagement Party? Let's check what's in the json.

console.log(Object.keys(data));
