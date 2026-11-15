#!/usr/bin/env bash
# apiKeyHelper for MiniMax-self slots: prints CC_MINIMAX_SELF_TOKEN only; value never stored in files
if [ -z "${CC_MINIMAX_SELF_TOKEN:-}" ]; then source "$HOME/code/github/workflow/config/env/secrets.zsh" >/dev/null 2>&1 || true; fi
printf '%s' "${CC_MINIMAX_SELF_TOKEN:?CC_MINIMAX_SELF_TOKEN missing}"
