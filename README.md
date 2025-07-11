The Appliflow Lead Discovery System is a backend project built with Node.js and Express that helps discover decision-makers from submitted company data using Hunter.io or mock data via n8n workflows. 
Users can log in using hardcoded credentials (admin / admin123), submit companies via a simple HTML form, and automatically enrich company domains with contact data such as name, title, email, and LinkedIn profile.
All company entries are saved in companies.json, and all discovered contacts are stored in contacts.json. 
The app provides routes like /company.html to submit companies, /api/companies to fetch them for enrichment, /api/webhooks/n8n-leads to receive leads from n8n, and /contacts to view saved leads in a table. 
It’s designed for demo purposes using local file storage instead of a database. Deployment can be done easily via Render by pushing the project to GitHub and setting up a Node Web Service with port 3000. 
This project was created by Raghav Chauhan as part of the Appliflow Backend Intern Assignment and demonstrates essential backend, API integration, and workflow automation skills.

