import frappe
import requests
import base64
import json

JIRA_URL = "https://aaravshetty.atlassian.net/rest/api/3/issue"
JIRA_EMAIL = "aarav.s@utthunga.com"
JIRA_API_TOKEN = "ATATT3xFfGF0-xyATdTqDZ-plh0vVnk3k0sGxLUwBznhxjqbkLLcCz7VhXRPzm-gNTo-I-6CEed7zNLKeLtAjXdfvNiiZOywKSFdQ4t4j3CBJHpAUEGyzYvSIPyVPHs2MR7udv_xaBB_3IAF74EHhIzNDZUp41G2KN6NufN5MBejVKetRLJXYkg=EFEAC2D8"
JIRA_PROJECT_KEY = "ERP"

@frappe.whitelist()
def sync_project_to_jira(project_name):
# Fetch project details from ERPNext
project = frappe.get_doc("Project", project_name)

# Encode authentication
auth_token = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_API_TOKEN}".encode()).decode()

headers = {
    "Authorization": f"Basic {auth_token}",
    "Content-Type": "application/json",
}

payload = {
    "fields": {
        "project": {"key": JIRA_PROJECT_KEY},
        "summary": project.project_name,
        "description": f"ERPNext Project: {project.name}\nStatus: {project.status}\nPriority: {project.priority}",
        "issuetype": {"name": "Task"},
    }
}

response = requests.post(JIRA_URL, headers=headers, json=payload)

if response.status_code == 201:
    frappe.msgprint(f"✅ Successfully synced '{project.project_name}' to Jira!")
else:
    frappe.msgprint(f"❌ Jira Sync Failed: {response.text}")