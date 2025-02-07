import frappe
import base64
import requests
import json

JIRA_URL = "https://aaravshetty.atlassian.net/rest/api/3/issue"
JIRA_EMAIL = "aarav.s@utthunga.com"
JIRA_API_TOKEN = "ATATT3xFfGF0-xyATdTqDZ-plh0vVnk3k0sGxLUwBznhxjqbkLLcCz7VhXRPzm-gNTo-I-6CEed7zNLKeLtAjXdfvNiiZOywKSFdQ4t4j3CBJHpAUEGyzYvSIPyVPHs2MR7udv_xaBB_3IAF74EHhIzNDZUp41G2KN6NufN5MBejVKetRLJXYkg=EFEAC2D8"
JIRA_PROJECT_KEY = "ERP"

@frappe.whitelist()
def sync_erpnext_projects_to_jira():
    try:
        # Fetch ERPNext Projects
        projects = frappe.get_all("Project", fields=["name", "project_name", "status", "priority"])

        # Encode authentication
        auth_token = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_API_TOKEN}".encode()).decode()

        headers = {
        "Authorization": f"Basic {auth_token}",
        "Content-Type": "application/json",
        }

        for project in projects:
            payload = {
            "fields": {
                "project": {"key": JIRA_PROJECT_KEY},
                "summary": project["project_name"],
                "description": f"ERPNext Project: {project['name']}\nStatus: {project['status']}\nPriority: {project['priority']}",
                "issuetype": {"name": "Task"},
                }
            }

            response = requests.post(JIRA_URL, headers=headers, data=json.dumps(payload))

            if response.status_code == 201:
                frappe.log_error("Jira Sync Success", f"Project {project['name']} synced to Jira.")
            else:
                frappe.log_error("Jira Sync Failed", response.text)

        return "Sync Completed Successfully"

    except Exception as e:
        frappe.log_error("Jira Sync Error", frappe.get_traceback())
        return "Sync Failed"