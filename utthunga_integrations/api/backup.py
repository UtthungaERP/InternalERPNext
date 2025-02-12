import frappe
from frappe.utils.backups import scheduled_backup
from frappe import _

@frappe.whitelist()
def trigger_backup():
    """Trigger a manual backup via API"""
    try:
        scheduled_backup(ignore_files=False)
        return {"status": "success", "message": _("Backup triggered successfully.")}
    except Exception as e:
        frappe.log_error(f"Backup Error: {str(e)}", "Backup API")
        return {"status": "error", "message": str(e)}
