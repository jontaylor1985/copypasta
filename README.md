# CopyPasta

## By JT

Simple app connects to a redis database and stores messages for a short amount of time (1 minute, 1 hour or 1 day)

No logging of message is done, and redis transactions ensure messages written to the DB are given an expiration time. This ensures that all messages will be deleted at most 1 day after they are created.
