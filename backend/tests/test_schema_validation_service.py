# To create in-memory file
from io import BytesIO

# Imported module
from backend.services.schema_validation_service import validate_uploaded_schema
import pandas as pd

# Creating an instance of class for mockup file upload build
class MockUploadFile:
    def __init__(
            self,
            filename,
            content
    ):
        
        self.filename = filename
        
        self.file = BytesIO(
            content.encode("utf-8")
        )


# ==== Test - 1 : Valid CSV ====
valid_csv = (
    "transaction_id,"
    "customer_email,"
    "purchase_amount,"
    "purchase_date\n"
    "1,test@gmail.com,100,2025-01-01"
)

file = MockUploadFile(
    "transactions.csv",
    valid_csv
)

valid_result = process_csv_file(file)
print(valid_result)

# ==== Test - 2 : Invalid Extension ====
file = MockUploadFile(
    "invoice.pdf",
    "dummy content"
)

invalid_result = process_csv_file(file)
print(invalid_result)

# ==== Test - 3 : Missing Columns ====
missing_csv = (
    "customer_email,"
    "purchase_amount\n"
    "test@gmail.com,100"
)

file = MockUploadFile(
    "missing_columns.csv",
    missing_csv
)

missing_result = process_csv_file(file)
print(missing_result)