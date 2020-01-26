cd %~dp0
if not exist playground mkdir playground
if not exist playground/index.ts type nul >playground/index.ts
concurrently \"npm:playground:tsc\" \"npm:playground:nodemon\" -k --kill-others-on-fail -p \"{name}|\" -n \"TSC ,NODE\" -c \"cyan,green\"