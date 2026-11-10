!macro NSIS_HOOK_POSTINSTALL
  CreateShortCut "$DESKTOP\ことり Japanese Studio.lnk" "$INSTDIR\kotori-studio.exe"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  Delete "$DESKTOP\ことり Japanese Studio.lnk"
!macroend
