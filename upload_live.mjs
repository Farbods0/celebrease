import fs from 'fs';
import path from 'path';

const url = "https://celebrease-backend-production-4778.up.railway.app/api/v1/upload/image?folder=holidays";
const images = [
    'bday-starter-2026.jpg',
    'bday-premium-2026.jpg',
    'hal-starter-2026.jpg',
    'hal-premium-2026.jpg',
    'ny-starter-2026.jpg',
    'ny-premium-2026.jpg',
    'ram-starter-2026.jpg',
    'val-starter-2026.jpg',
    'val-premium-2026.jpg',
    'xmas-starter-2026.jpg',
    'xmas-premium-2026.jpg',
    'xmas-ultimate-2026.jpg'
];

async function upload() {
    for (const file of images) {
        const filePath = path.join(process.cwd(), 'backend', 'uploads', 'holidays', file);
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            continue;
        }
        const buffer = fs.readFileSync(filePath);
        
        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('file', blob, file);
        
        console.log(`Uploading ${file}...`);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer super_agent_token_xyz123',
                    'Cookie': 'better-auth.session_token=super_agent_token_xyz123'
                },
                body: formData
            });
            const text = await res.text();
            console.log(`Result for ${file}: ${res.status}`, text);
        } catch (e) {
            console.error(`Error uploading ${file}:`, e);
        }
    }
}
upload();
