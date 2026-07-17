# Building a Local MP3 Player from a React Codespaces Template

**Repo:** [aryali06/codespaces-react](https://github.com/aryali06/codespaces-react/tree/main)

## Overview

This project started as GitHub's default `codespaces-react` template — a bare-bones
Create React App scaffold meant to demonstrate spinning up a dev environment inside
a Codespace. I took that starting point and built it out into a fully functional,
browser-based MP3 player that runs entirely client-side: no backend, no uploads,
no accounts. Everything happens locally in the browser.

## Why This Template

Codespaces gave me a zero-setup dev environment (no local Node/npm install
headaches, no dependency drift between machines), and the React template was a
clean, unopinionated base — just enough boilerplate to get `npm start` running
without any pre-baked UI to rip out first.

## Features Built On Top

- **Local file/folder import** — users can select individual audio files or an
  entire folder, and the app builds a playlist from whatever it finds
- **Playback controls** — play, pause, forward (skip to next track), and
  backward (skip to previous track)
- **Now-playing visual** — a dancing cat GIF (or custom cover image) displayed
  alongside the current track, giving the player some personality instead of a
  blank UI
- **Playlist state management** — React state/hooks track the current track
  index, playback status, and the imported file list

## Rough Architecture

- **React** for component structure and UI state (player controls, track list,
  now-playing display)
- **Browser file input** (folder-aware selection) to let users pick local audio
  without any server-side storage
- **HTML5 audio playback** underneath the custom UI, wired up to the
  play/pause/skip controls
- **Static assets** (the dancing cat GIF / cover art) rendered conditionally
  based on playback state

## Security & Privacy Notes

Since everything runs client-side, imported audio files never leave the
browser — there's no upload step, no server storing file contents, and no
network request tied to the files themselves. That was a deliberate design
choice: keeping the trust boundary entirely local avoids the usual risks that
come with handling user-uploaded media (server-side storage of arbitrary
files, unvalidated file type handling on a backend, etc.). The main things
worth being careful about in a project like this:

- Validating/whitelisting file types before attempting playback, so the app
  doesn't choke on (or try to render) unexpected file formats
- Being mindful of how object URLs created from local files are revoked once
  a track is no longer in use, to avoid memory leaks
- Not assuming folder-import APIs behave identically across browsers — feature
  support and permission prompts vary

## What I'd Add Next

- Shuffle/repeat modes
- Drag-and-drop file import
- Persisting the last playlist across sessions
- A proper waveform or progress scrubber instead of a static play state

## Try It!!!

Clone the repo, run `npm install` then `npm start`, and drop in a folder of
MP3s to test it out.
