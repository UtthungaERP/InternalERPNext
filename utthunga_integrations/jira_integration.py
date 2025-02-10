import frappe

@frappe.whitelist(allow_guest=True)
def test_jira_webhook():
    try:
        data = frappe.request.data
        frappe.log_error("Webhook Triggered!",data)
    except Exception as e:
        frappe.log_error("Webhook Failed!",frappe.get_traceback())