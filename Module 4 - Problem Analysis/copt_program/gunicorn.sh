#!/bin/sh
gunicorn app:app -c gunicorn_config.py