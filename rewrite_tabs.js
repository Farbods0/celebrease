const fs = require('fs');
const path = 'frontend/src/app/(protected)/account/account-client.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove useState for activeTab and add a ref
code = code.replace(/const \[activeTab, setActiveTab\] = useState<ActiveTab>\("overview"\);/, `
    // Completely bypass React state to guarantee 0ms latency on tab clicks.
    const changeTab = (id) => {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        const target = document.getElementById('tab-' + id);
        if (target) target.style.display = 'block';
        
        document.querySelectorAll('.acct-nav-link').forEach(el => el.classList.remove('active'));
        const navTarget = document.getElementById('nav-' + id);
        if (navTarget) navTarget.classList.add('active');
    };
`);

// 2. Modify navItems rendering
code = code.replace(/className=\{`acct-nav-link\$\{activeTab === item\.id \? " active" : ""\}`\}/, `className={\`acct-nav-link\${item.id === "overview" ? " active" : ""}\`} id={\`nav-\${item.id}\`}`);
code = code.replace(/onClick=\{\(\) \=\> setActiveTab\(item\.id\)\}/, `onClick={() => changeTab(item.id)}`);
code = code.replace(/aria-current=\{activeTab === item\.id \? "page" : undefined\}/, `aria-current={item.id === "overview" ? "page" : undefined}`);

// 3. Modify "View all orders" button
code = code.replace(/onClick=\{\(\) \=\> setActiveTab\("orders"\)\}/, `onClick={() => changeTab("orders")}`);

// 4. Modify each tab wrapper to use static display logic instead of React state
const tabs = ['overview', 'subscription', 'slots', 'orders', 'addresses', 'settings'];
tabs.forEach(tab => {
    // Find: className={activeTab === "tab" ? "block" : "hidden"}
    const regex = new RegExp(\`className=\\{activeTab === "\${tab}" \\? "block" : "hidden"\\}\`, 'g');
    code = code.replace(regex, \`className="tab-content" id="tab-\${tab}" style={{ display: "\${tab}" === "overview" ? "block" : "none" }}\`);
});

fs.writeFileSync(path, code);
