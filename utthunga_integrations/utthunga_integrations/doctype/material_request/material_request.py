import frappe
from frappe.model.document import Document
from frappe.desk.form.assign_to import add

class MaterialRequest(Document):
    def validate(self):
        if ((self.custom_project_manager) and (not self.custom_project_manager_id)):
            self.custom_project_manager_id = frappe.db.get_value("Employee",{'name': self.custom_project_manager}, 'user_id')
        if ((self.custom_bu_head) and (not self.custom_bu_head_id)):
            self.custom_bu_head_id = frappe.db.get_value("Employee", {'name': self.custom_bu_head}, 'user_id')
        if ((self.custom_purchase_manager) and (not self.custom_purchase_manager_id)):
            self.custom_purchase_manager_id = frappe.db.get_value("Employee", {'name': self.custom_purchase_manager}, 'user_id')

    @frappe.whitelist()
    def get_user_id(self, employee):
        return frappe.db.get_value("Employee", {"name": employee}, 'user_id')

    def on_change(self):
        field = ""
        if self.workflow_state == "Pending Approval by Project Manager":
            field = "custom_project_manager_id"
        if self.workflow_state == "Pending Approval By BU Head":
            field = "custom_bu_head_id"
        if self.workflow_state == "Pending Approval By Purchase Manager":
            field = "custom_purchase_manager_id"
        if field:
            self.initialize_assignment(field)

    def initialize_assignment(self, user_id):
        data = self.validate_assignment(validate_field=user_id)
        if not data.get("assignment") and not data.get("docshare"):
            self.assign_user(validate_field=user_id)

    def validate_assignment(self, validate_field=None):
        field = getattr(self, validate_field)
        if field:
            assignment = frappe.db.exists("ToDo", 
            {
                "reference_type": self.doctype,
                "reference_name": self.name,
                "allocated_to": field,
                "status": "Open"
            })
            docshare = frappe.db.exists("DocShare", 
            {
                "user": field,
                "share_doctype": self.doctype,
                "share_name": self.name
            })
            return {
                "assignment": assignment if assignment else None,
                "docshare": docshare if docshare else None
            }

    def assign_user(self, validate_field):
        field_value = getattr(self, validate_field)
        for_user_name = frappe.db.get_value("User", {"email": frappe.session.user}, "full_name")
        todo = frappe.get_doc({
            "doctype": "ToDo",
            "allocated_to": field_value,
            "description": f"Assignment for Material Request {self.name}",
            "reference_type": self.doctype,
            "reference_name": self.name,
            "assigned_by": frappe.session.user,
            "assigned_by_full_name": frappe.db.get_value("Employee", {'user_id': frappe.session.user}, 'employee_name')
        })
        docshare = frappe.get_doc({
            "doctype": "DocShare",
            "user": field_value,
            "share_doctype": self.doctype,
            "share_name": self.name,
            "read": 1,
            "write": 1,
            "share": 1,
            "notify_by_email": 1
        })
        notification = frappe.get_doc({
            "doctype": "Notification Log",
            "document_type": self.doctype,
            "document_name": self.name,
            "for_user": field_value,
            "from_user": frappe.session.user,
            "subject": f"<b>{for_user_name}</b> assigned a new task <b>{self.doctype}</b> {self.name} to you",
            "type": "Assignment"
        })
        todo.save(ignore_permissions=True)
        docshare.save(ignore_permissions=True)
        notification.insert(ignore_permissions=True)
        frappe.db.commit()

@frappe.whitelist()
def get_filtered_employees(doctype, txt, searchfield, start, page_len, filters):
    employees = frappe.get_all("Employee",
        filters={"user_id": ["in", get_users_with_role(filters.get("role"))],
                "employee_name": ["like", f"%{txt}%"]},
        fields=["name", "employee_name"]
    )
    return [(emp["name"], emp["employee_name"]) for emp in employees]

def get_users_with_role(role):
    
    return frappe.get_all("Has Role", 
        filters={"role": role},
        fields=["parent"],
        pluck="parent"
        )
