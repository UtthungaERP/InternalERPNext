'''
import frappe

@frappe.whitelist(allow_guest=True)
def test_jira_webhook():
    try:
        data = frappe.request.data
        frappe.log_error("Webhook Triggered!",data)
    except Exception as e:
        frappe.log_error("Webhook Failed!",frappe.get_traceback())

import frappe

@frappe.whitelist(allow_guest=True)
def test_jira_webhook():
    try:
        data = frappe.request.data
        frappe.log_error("Webhook Triggered!", data)
        return {"status": "success", "message": "Webhook received!", "data": data}
    except Exception as e:
        frappe.log_error("Webhook Failed!", frappe.get_traceback())
        return {"status": "error", "message": "Webhook processing failed"}

'''
import frappe
import json

@frappe.whitelist(allow_guest=True)
def jira_webhook():
    try:
        # Get data from Jira webhook request
        data = json.loads(frappe.request.data)

        # Extract relevant fields from Jira issue
        issue_key = data.get("issue", {}).get("key", "No Key")
        issue_summary = data.get("issue", {}).get("fields", {}).get("summary", "No Summary")
        issue_description = data.get("issue", {}).get("fields", {}).get("description", "No Description")

        # Create a new Task in ERPNext
        task = frappe.get_doc({ 
            "doctype": "Task",
            "subject": f"Jira Issue: {issue_key} - {issue_summary}",
            "description": issue_description,
            "status": "Open"
            })
        task.insert(ignore_permissions=True)

        # Commit to database
        frappe.db.commit()

        return {"status": "success", "message": "Task created in ERPNext", "task_name": task.name}
    
    except Exception as e:
        frappe.log_error("Jira Webhook Error", frappe.get_traceback())
        return {"status": "error", "message": "Failed to process Jira webhook"}

