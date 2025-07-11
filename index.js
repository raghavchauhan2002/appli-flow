const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse form data and JSON body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const companiesFile = path.join(__dirname, 'data', 'companies.json');
const contactsFile = path.join(__dirname, 'data', 'contacts.json');

// ====================================
// 🔐 LOGIN
// ====================================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 🔍 Debugging
    console.log('Username received:', username);
    console.log('Password received:', password);

    if (username === 'admin' && password === 'admin123') {
        res.redirect('/dashboard');
    } else {
        res.send('❌ Invalid credentials. Please try again.');
    }
});


// ====================================
// 📊 DASHBOARD
// ====================================
app.get('/dashboard', (req, res) => {
    res.send(`
        <h2>✅ Welcome to Appliflow Dashboard!</h2>
        <a href="/company.html">➕ Add Company</a> |
        <a href="/contacts">📋 View Contacts</a>
    `);
});

// ====================================
// 🏢 ADD COMPANY
// ====================================
app.post('/submit-company', (req, res) => {
    const { name, website, funding_stage } = req.body;

    const newCompany = {
        id: Date.now(),
        name,
        website,
        funding_stage,
        created_at: new Date().toISOString()
    };

    let companies = [];
    if (fs.existsSync(companiesFile)) {
        const fileData = fs.readFileSync(companiesFile);
        companies = JSON.parse(fileData || '[]');
    }

    companies.push(newCompany);

    fs.writeFileSync(companiesFile, JSON.stringify(companies, null, 2));

    res.send(`
        <h3>✅ Saved company: ${name}</h3>
        <p><strong>Website:</strong> ${website}</p>
        <p><strong>Funding Stage:</strong> ${funding_stage}</p>
        <a href="/company.html">🔙 Add Another Company</a>
    `);
});

// ====================================
// 🌐 API: List All Companies (used in n8n)
app.get('/api/companies', (req, res) => {
    if (fs.existsSync(companiesFile)) {
        const data = fs.readFileSync(companiesFile, 'utf8');
        res.json(JSON.parse(data || '[]'));
    } else {
        res.json([]);
    }
});

// ====================================
// 📬 API: Webhook from n8n to save contacts
app.post('/api/webhooks/n8n-leads', (req, res) => {
    const newContact = req.body;

    let contacts = [];
    if (fs.existsSync(contactsFile)) {
        const data = fs.readFileSync(contactsFile, 'utf8');
        contacts = JSON.parse(data || '[]');
    }

    contacts.push(newContact);

    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

    console.log('✅ Contact saved:', newContact);
    res.status(200).json({ message: 'Contact saved successfully' });
});

// ====================================
// 📋 Show all saved contacts in table
app.get('/contacts', (req, res) => {
    let contacts = [];
    if (fs.existsSync(contactsFile)) {
        const fileData = fs.readFileSync(contactsFile, 'utf8');
        contacts = JSON.parse(fileData || '[]');
    }

    let html = `
        <h2>📋 Discovered Contacts</h2>
        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Company</th>
                <th>Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>LinkedIn</th>
            </tr>
    `;

    for (const contact of contacts) {
        html += `
            <tr>
                <td>${contact.domain}</td>
                <td>${contact.name}</td>
                <td>${contact.title}</td>
                <td>${contact.email}</td>
                <td><a href="${contact.linkedin_url}" target="_blank">View</a></td>
            </tr>
        `;
    }

    html += '</table>';
    res.send(html);
});

// ====================================
// 🌐 Default: Show login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ====================================
// 🚀 Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Appliflow server running at http://localhost:${PORT}`);
});
