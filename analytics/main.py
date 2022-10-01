from cdm_analytics.main import app, ensure_initial_user_exists, load_cors_domains

assert app

__all__ = ["app"]

ensure_initial_user_exists()
load_cors_domains()
