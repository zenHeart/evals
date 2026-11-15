#!/usr/bin/env bash
# apiKeyHelper for GLM slots: prints the glm-self token (CC_GLM_SELF_TOKEN only; value never stored in files)
if [ -z "${CC_GLM_SELF_TOKEN:-}" ]; then source "$HOME/code/github/workflow/config/env/secrets.zsh" >/dev/null 2>&1 || true; fi
printf '%s' "${CC_GLM_SELF_TOKEN:?CC_GLM_SELF_TOKEN missing}"
