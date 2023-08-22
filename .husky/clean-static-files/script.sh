#!/usr/bin/env sh
if [ `git diff --cached resume | wc -l` = "0" ]
then
  echo 'resume not updated... continuing'
else
  echo 'resume updated... deleting file from static folder for CI build'
  git rm static/resume.pdf
fi

exit 0
