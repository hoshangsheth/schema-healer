# class instance on Invalid and Empty File types
class InvalidFileTypeError(Exception):
    """Raised when the uploaded file is not CSV."""
    pass

class EmptyFileError(Exception):
    """Raised when the uploaded CSV contains no header row."""
    pass