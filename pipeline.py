import os
import sys
from datetime import datetime, timezone
import pandas as pd
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

STORAGE_ACCOUNT_URL = os.environ.get("STORAGE_ACCOUNT_URL")
CONTAINER_NAME = os.environ.get("CONTAINER_NAME", "production-reports")

def run():
    print("[INFO] Pipeline started. Checking configuration...")
    if not STORAGE_ACCOUNT_URL:
        print("[ERROR] STORAGE_ACCOUNT_URL environment variable is missing.", file=sys.stderr)
        sys.exit(1)

    raw_records = [
        {"facility": "East", "status": "Shipped", "cost": 142.50, "units": 1200},
        {"facility": "West", "status": "Pending", "cost": 89.20, "units": 650},
        {"facility": "East", "status": "Shipped", "cost": 210.00, "units": 1800},
        {"facility": "Central", "status": "Delivered", "cost": 315.40, "units": 2400},
        {"facility": "West", "status": "Shipped", "cost": 115.00, "units": 910},
    ]
    df = pd.DataFrame(raw_records)

    print("[INFO] Transforming KPIs...")
    summary = df.groupby("facility").agg(
        total_orders=("status", "count"),
        total_cost=("cost", "sum"),
        total_units=("units", "sum")
    ).reset_index()

    csv_payload = summary.to_csv(index=False)

    print(f"[INFO] Connecting to {STORAGE_ACCOUNT_URL} via Managed Identity...")
    credential = DefaultAzureCredential()
    blob_service = BlobServiceClient(account_url=STORAGE_ACCOUNT_URL, credential=credential)
    container_client = blob_service.get_container_client(CONTAINER_NAME)

    try:
        container_client.create_container()
    except Exception:
        pass

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    blob_filename = f"daily_metrics_{timestamp}.csv"

    print(f"[INFO] Uploading {blob_filename} to {CONTAINER_NAME}...")
    container_client.upload_blob(name=blob_filename, data=csv_payload, overwrite=True)
    print(f"[SUCCESS] Pipeline executed successfully at {datetime.now(timezone.utc).isoformat()}.")

if __name__ == "__main__":
    run()
