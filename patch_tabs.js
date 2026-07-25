const fs = require('fs');
const path = 'frontend/src/app/(protected)/account/account-client.tsx';
let code = fs.readFileSync(path, 'utf8');

// We will change the tab logic to use vanilla JS
// First, modify the onClick
code = code.replace(/onClick=\{\(\) \=\> setActiveTab\(item\.id\)\}/g, `onClick={() => {
                                        setActiveTab(item.id);
                                        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
                                        document.getElementById('tab-' + item.id).style.display = 'block';
                                        
                                        document.querySelectorAll('.acct-nav-link').forEach(el => el.classList.remove('active'));
                                        document.getElementById('nav-' + item.id).classList.add('active');
                                    }} id={'nav-' + item.id}`);
                                    
// We will replace className={activeTab === "..." ? "block" : "hidden"} with static display none/block
const tabs = ['overview', 'subscription', 'slots', 'orders', 'addresses', 'settings'];
tabs.forEach(tab => {
    code = code.replace(
        new RegExp(\`className=\\{activeTab === "\${tab}" \\? "block" : "hidden"\\}\`, 'g'),
        \`className="tab-content" id="tab-\${tab}" style={{ display: activeTab === "\${tab}" ? "block" : "none" }}\`
    );
});

// Since activeTab state is still there, it still triggers a React re-render. To completely avoid the React re-render, we MUST NOT update state!
// Wait! If we don't update state, does anything else depend on activeTab?
// No! Only the tabs themselves!
