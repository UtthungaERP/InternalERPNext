frappe.ui.form.on("Material Request", {
    refresh(frm) {
        let is_read_only = frappe.workflow.is_read_only(frm.doc.doctype, frm.doc.name);
        if (!frm.doc.__islocal) {
            if (!frm.doc.project_manager && frm.doc.workflow_state == "Draft") {
                assignment_btn(frm, "Project Manager", "Project Manager ID");
            }
            if (!frm.doc.custom_bu_head && frm.doc.workflow_state == "Pending Approval By Project Manager") {
                assignment_btn(frm, "BU Head", "BU Head ID");
            }
            if (!frm.doc.purchase_manager && frm.doc.workflow_state == "Pending Approval By BU Head") {
                assignment_btn(frm, "Purchase Manager", "Purchase Manager ID");
            }
        }   
            
    },
});
    
function scrub(str) {
    let field_map = {
        "Project Manager": "custom_project_manager",
        "BU Head": "custom_bu_head",
        "Purchase Manager": "custom_purchase_manager"
    };
    return field_map[str] || str.toLowerCase().replace(/\s+/g,"_");
    
}
    
function assignment_btn(frm, assignment_type, user_field) {
    frm.add_custom_button(`Assign ${assignment_type}`, function () {
        let emp = `${assignment_type}`
        let user = `${user_field}`
    
        let d = new frappe.ui.Dialog({
            title: `Assign ${assignment_type}`,
            fields: [
                {
                    label: `${emp}`,
                    fieldname: scrub(emp),
                    fieldtype: "Link",
                    options: "Employee",
                    ignore_user_permissions: 1,
                    get_query: function () {
                        var role_map = {
                            "Project Manager": "Project Manager",
                            "BU Head": "BU Head",
                            "Purchase Manager": "Purchase Manager"
                        };
                        return {
                            query: "utthunga_integrations.utthunga_integrations.doctype.material_request.material_request.get_filtered_employees",
                            filters: { role: role_map[assignment_type] }
                        };
                    },
                    onchange: function () {
                        let employee_value = d.get_value(scrub(emp));
                        if (employee_value) {
                            frappe.call({
                                doc: frm.doc,
                                method: 'get_user_id',
                                args: { employee: employee_value },
                                callback: function (response) {
                                    d.set_value(`${scrub(user)}`, response.message);
                                }
                            });
                        } else {
                            d.set_value(`${scrub(user)}`, "");
                        }
                    }
                },
                {
                    label: `${emp}`,
                    fieldname: scrub(emp),
                    fieldtype: "Link",
                    options: "User",
                    read_only: 1,
                    reqd: 1
                }
            ],
            primary_action_label: "Assign",
            primary_action(values) {
                let fieldname = scrub(emp);
                if (frm.fields_dict[fieldname]) {
                    frm.set_value(fieldname, values[fieldname]);
                    frm.save();
                } else {
                    frappe.msgprint(`Field "${fieldname}" not found. Check the database field names.`);
                }
                d.hide();
            }
        });
        d.show();
    });
}

