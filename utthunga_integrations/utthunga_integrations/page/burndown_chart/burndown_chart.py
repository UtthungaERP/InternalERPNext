import frappe

@frappe.whitelist()
def get_timesheet_data():
    return frappe.db.get_list(
        "Timesheet Detail",
        fields=["expected_hours", "hours"],
        order_by="creation asc",
        ignore_permissions=True
    )

def get_context(context):
    context.no_cache = 1