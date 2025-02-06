import frappe

frappe.whitelist(allow_guest=True)
def test_fun():
    return "In!"