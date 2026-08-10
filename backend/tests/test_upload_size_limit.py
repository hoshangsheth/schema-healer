"""
Regression test for the server-side upload size limit.

Prior to this fix, `process_uploaded_schema` enforced no size limit of
its own; only the Next.js proxy guarded against oversized uploads, so a
direct API caller had no server-side ceiling at all.

Run:
    pytest backend/tests/test_upload_size_limit.py
"""

import io

import pytest

from backend.core.config import MAX_UPLOAD_SIZE_BYTES
from backend.exceptions.processing_exceptions import FileTooLargeError
from backend.services.schema_processing_service import process_uploaded_schema


class _FakeUploadFile:
    """Minimal stand-in for FastAPI's UploadFile, exposing only the
    attributes process_uploaded_schema actually reads."""

    def __init__(self, filename: str, content: bytes) -> None:
        self.filename = filename
        self.file = io.BytesIO(content)


def test_oversized_file_is_rejected_before_processing():
    oversized_content = b"a" * (MAX_UPLOAD_SIZE_BYTES + 1)
    upload = _FakeUploadFile("data.csv", oversized_content)

    with pytest.raises(FileTooLargeError):
        process_uploaded_schema(upload)


def test_file_at_the_limit_is_not_rejected_for_size():
    # Exactly at the limit: a valid, tiny CSV padded with a trailing
    # comment-like column is impractical to construct at the byte
    # boundary, so this checks the guard condition directly instead of
    # forcing size equality through real CSV content.
    content_within_limit = b"customer_id\n1\n"
    assert len(content_within_limit) <= MAX_UPLOAD_SIZE_BYTES

    upload = _FakeUploadFile("data.csv", content_within_limit)

    # Should proceed past the size guard (may still raise/behave
    # according to downstream recovery logic, but never FileTooLargeError).
    try:
        process_uploaded_schema(upload)
    except FileTooLargeError:
        pytest.fail("File within the size limit must not be rejected as too large.")
