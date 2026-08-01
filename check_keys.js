const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch_prompts_parsed.json', 'utf8'));

const targets = {
    "Birthdays": ["STARTER", "PREMIUM"],
    "Christmas": ["STARTER", "PREMIUM", "ULTIMATE"],
    "Halloween": ["STARTER", "PREMIUM"],
    "New Year's": ["STARTER", "PREMIUM"],
    "Ramadan": ["STARTER"],
    "Valentine's Day": ["STARTER", "PREMIUM"]
};

// Note: Birthdays might not be in the prompts file? Wait, Birthdays wasn't in the list I saw? The list I saw ended with Engagement Party? Let's check what's in the json.

console.log(Object.keys(data));
