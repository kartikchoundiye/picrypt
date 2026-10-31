#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'web_picrypt.settings')

    # When running 'runserver', show the deployed backend URL at the very bottom
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        try:
            from django.core.management.commands.runserver import Command as RunserverCommand
            orig_inner_run = RunserverCommand.inner_run

            def patched_inner_run(self, *args, **options):
                orig_write = self.stdout.write

                def custom_write(msg="", style_func=None, ending=None):
                    orig_write(msg, style_func=style_func, ending=ending)
                    if "Quit the server with" in str(msg):
                        orig_write("\n  -> Deployed Backend (Render): https://picrypt.onrender.com/\n")

                self.stdout.write = custom_write
                return orig_inner_run(self, *args, **options)

            RunserverCommand.inner_run = patched_inner_run
        except Exception:
            pass

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
