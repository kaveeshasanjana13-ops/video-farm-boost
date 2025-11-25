#!/bin/bash
# Helper script to replace Input with ValidatedInput in RegisterStudent.tsx
# This is a one-time migration script

# Replace all <Input instances with <ValidatedInput except for InputOTP
sed -i 's/<Input /<ValidatedInput /g' src/pages/RegisterStudent.tsx
