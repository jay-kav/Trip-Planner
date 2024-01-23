import os
from django.core.exceptions import ImproperlyConfigured

# Loading environment variables using dotenv https://dev.to/jakewitcher/using-env-files-for-environment-variables-in-python-applications-55a1
def get_env_value(env_variable):
    try:
        return os.getenv(env_variable)
    except KeyError:
        error_msg = 'Set the {} environment variable'.format(env_variable)
        raise ImproperlyConfigured(error_msg)