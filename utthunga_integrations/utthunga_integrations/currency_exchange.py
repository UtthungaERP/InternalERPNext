import requests
import frappe

API_KEY = "7a32ca2f83b2cc731476182a" # Replace with your API key
API_URL = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD"

def update_currency_exchange():

# Fetch data from API
    response = requests.get(API_URL)

    if response.status_code == 200:
        data = response.json()
        rates = data.get("conversion_rates", {})

        if not rates:
            print("⚠️ No exchange rates found.")
            return

        for currency, rate in rates.items():
            # Check if record already exists for today's date
            existing_doc = frappe.get_all(
                "Currency Exchange",
                filters={"date": frappe.utils.today(), "from_currency": "USD", "to_currency": currency},
                fields=["name"]
            )

            if existing_doc:
                # Update existing record
                frappe.db.set_value("Currency Exchange", existing_doc[0].name, "exchange_rate", rate)
                print(f"🔄 Updated {currency}: {rate}")
            else:
                # Insert new record
                doc = frappe.get_doc({
                    "doctype": "Currency Exchange",
                    "date": frappe.utils.today(),  # Mandatory
                    "from_currency": "USD",        # Base currency
                    "to_currency": currency,       # Target currency
                    "exchange_rate": rate,         # Fetched rate
                    "for_buying": 0,               # Optional
                    "for_selling": 0               # Optional
                })
                doc.insert(ignore_permissions=True)
                print(f"✅ Added {currency}: {rate}")

        # Commit the database changes
        frappe.db.commit()
        print("🎯 Currency Exchange rates updated successfully!")

    else:
        print(f"❌ Failed to fetch exchange rates. Status Code: {response.status_code}")