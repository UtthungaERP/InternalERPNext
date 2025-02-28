import requests
import frappe
from frappe.utils import now_datetime

API_URL = "https://v6.exchangerate-api.com/v6/7a32ca2f83b2cc731476182a/latest/INR" # Change USD to your base currency

def update_currency_exchange():
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            data = response.json()
            base_currency = data["base_code"]
            exchange_rates = data["conversion_rates"]

            for target_currency, rate in exchange_rates.items():
            # Check if the exchange rate already exists for today
                existing_exchange = frappe.db.exists(
                    "Currency Exchange",
                    {
                        "from_currency": base_currency,
                        "to_currency": target_currency,
                        "date": now_datetime().date()
                    }
                )
                if not existing_exchange:
                # Create a new Currency Exchange document
                    exchange_doc = frappe.get_doc({
                        "doctype": "Currency Exchange",
                        "from_currency": base_currency,
                        "to_currency": target_currency,
                        "exchange_rate": rate,
                        "date": now_datetime().date()
                    })
                    exchange_doc.insert(ignore_permissions=True)
                    frappe.db.commit()
                    frappe.log_error(f"Exchange rate updated: {base_currency} to {target_currency} - {rate}", "Currency Exchange Update")
            else:
                frappe.log_error(f"Exchange rate already exists for: {base_currency} to {target_currency}", "Currency Exchange Update")
        else:
            frappe.log_error("Failed to fetch exchange rates. Status Code: " + str(response.status_code), "Currency Exchange Update")
    except Exception as e:
        frappe.log_error(f"Error in update_currency_exchange: {str(e)}", "Currency Exchange Update")