; EmuScape — Windows installer (NSIS, Modern UI 2). Built from dist\win-unpacked.
Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "x64.nsh"
!include "WinMessages.nsh"

!define APP      "EmuScape"
!ifndef VERSION
  !define VERSION "2.0.26"
!endif
!define SRC      "..\..\dist\win-unpacked"
!define UNKEY    "Software\Microsoft\Windows\CurrentVersion\Uninstall\EmuScape"

Name "${APP}"
Caption "$(capI)"
UninstallCaption "$(capU)"
BrandingText "${APP} ${VERSION}"
OutFile "EmuScape-Setup-${VERSION}.exe"
SetCompressor /SOLID lzma
SetCompressorDictSize 64
RequestExecutionLevel user
; EmuScape keeps its settings, downloaded emulators and games next to itself, so it goes in a folder
; you can write to without administrator rights (not Program Files).
InstallDir "C:\EmuScape"
InstallDirRegKey HKCU "Software\EmuScape" "InstallDir"
ShowInstDetails show
ShowUninstDetails show

VIProductVersion "1.0.0.0"
VIAddVersionKey /LANG=1033 "ProductName" "${APP}"
VIAddVersionKey /LANG=1033 "FileDescription" "${APP} Setup"
VIAddVersionKey /LANG=1033 "CompanyName" "EmuScape"
VIAddVersionKey /LANG=1033 "LegalCopyright" "EmuScape (based on Boxshelf, GPL-3.0)"
VIAddVersionKey /LANG=1033 "FileVersion" "${VERSION}"
VIAddVersionKey /LANG=1033 "ProductVersion" "${VERSION}"

!define MUI_ICON   "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_ABORTWARNING
; remember the language picked, so the uninstaller speaks it too
!define MUI_LANGDLL_REGISTRY_ROOT "HKCU"
!define MUI_LANGDLL_REGISTRY_KEY "Software\EmuScape"
!define MUI_LANGDLL_REGISTRY_VALUENAME "InstallerLanguage"
!define MUI_LANGDLL_ALWAYSSHOW
!define MUI_LANGDLL_WINDOWTITLE "EmuScape"
!define MUI_LANGDLL_INFO "Choose a language / Elige un idioma"
!define MUI_WELCOMEFINISHPAGE_BITMAP   "welcome.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "welcome.bmp"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_HEADERIMAGE_UNBITMAP "header.bmp"

; (own build) /UPDATE: started by EmuScape's Update now. No questions: only the progress page shows, then the new EmuScape opens
Var IsUpd
Function SkipIfUpdate
  StrCmp $IsUpd "1" 0 +2
    Abort
FunctionEnd

!define MUI_WELCOMEPAGE_TITLE "$(welT)"
!define MUI_WELCOMEPAGE_TEXT "$(welX)"
!define MUI_PAGE_CUSTOMFUNCTION_PRE SkipIfUpdate
!insertmacro MUI_PAGE_WELCOME
!define MUI_DIRECTORYPAGE_TEXT_TOP "$(dirX)"
!define MUI_PAGE_CUSTOMFUNCTION_PRE SkipIfUpdate
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_TITLE "$(finT)"
!define MUI_FINISHPAGE_TEXT "$(finX)"
!define MUI_FINISHPAGE_RUN "$INSTDIR\EmuScape.exe"
!define MUI_FINISHPAGE_RUN_TEXT "$(finRun)"
!define MUI_PAGE_CUSTOMFUNCTION_PRE SkipIfUpdate
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_RESERVEFILE_LANGDLL

LangString capI ${LANG_ENGLISH} "${APP} Setup"
LangString capI ${LANG_SPANISH} "Instalar ${APP}"
LangString capU ${LANG_ENGLISH} "Uninstall ${APP}"
LangString capU ${LANG_SPANISH} "Desinstalar ${APP}"
LangString welT ${LANG_ENGLISH} "Welcome to ${APP}"
LangString welT ${LANG_SPANISH} "Bienvenido a ${APP}"
LangString welX ${LANG_ENGLISH} "This will install ${APP} ${VERSION} on your computer.$\r$\n$\r$\n${APP} is your console-style game library: your emulators, your games and Steam in one place, made for a controller.$\r$\n$\r$\nIf you already have ${APP}, it gets updated and your settings, covers, emulators and games are kept.$\r$\n$\r$\nClick Next to continue."
LangString welX ${LANG_SPANISH} "Este asistente instalará ${APP} ${VERSION} en tu computadora.$\r$\n$\r$\n${APP} es tu biblioteca de juegos estilo consola: tus emuladores, tus juegos y Steam en un solo lugar, para usar con control.$\r$\n$\r$\nSi ya tienes ${APP}, se actualiza y se conservan tus ajustes, portadas, emuladores y juegos.$\r$\n$\r$\nPulsa Siguiente para continuar."
LangString dirX ${LANG_ENGLISH} "${APP} will be installed in this folder. It also keeps its settings and the emulators you download here, so a folder of its own like C:\EmuScape is best (not Program Files)."
LangString dirX ${LANG_SPANISH} "${APP} se instalará en esta carpeta. Aquí también guardará sus ajustes y los emuladores que descargues, así que es mejor una carpeta propia como C:\EmuScape (no Archivos de programa)."
LangString finT ${LANG_ENGLISH} "${APP} is ready!"
LangString finT ${LANG_SPANISH} "¡${APP} está listo!"
LangString finX ${LANG_ENGLISH} "${APP} was installed. You'll find it on your Desktop and in the Start menu."
LangString finX ${LANG_SPANISH} "${APP} se instaló correctamente. Tienes un acceso directo en el Escritorio y en el menú Inicio."
LangString finRun ${LANG_ENGLISH} "Open ${APP} now"
LangString finRun ${LANG_SPANISH} "Abrir ${APP} ahora"
LangString need64 ${LANG_ENGLISH} "${APP} needs 64-bit Windows."
LangString need64 ${LANG_SPANISH} "${APP} necesita Windows de 64 bits."
LangString isOpen ${LANG_ENGLISH} "${APP} is open. Click OK to close it and continue."
LangString isOpen ${LANG_SPANISH} "${APP} está abierto. Pulsa Aceptar para cerrarlo y continuar."
LangString stillOpen ${LANG_ENGLISH} "${APP} is still open. Close it (or end a game that's running) and click Retry."
LangString stillOpen ${LANG_SPANISH} "${APP} sigue abierto. Ciérralo (o termina el juego que está corriendo) y pulsa Reintentar."
LangString inUse ${LANG_ENGLISH} "${APP} is still running in the background, so its files can't be replaced.$\r$\n$\r$\nOpen Task Manager (Ctrl+Shift+Esc), select EmuScape and click End task, then click Retry.$\r$\n$\r$\nIf it isn't there, your antivirus may be holding the files: allow EmuScape (or the C:\EmuScape folder) in it and click Retry."
LangString inUse ${LANG_SPANISH} "${APP} sigue abierto en segundo plano, así que sus archivos no se pueden reemplazar.$\r$\n$\r$\nAbre el Administrador de tareas (Ctrl+Shift+Esc), selecciona EmuScape y pulsa Finalizar tarea; luego pulsa Reintentar.$\r$\n$\r$\nSi no aparece ahí, tu antivirus puede estar bloqueando los archivos: permite EmuScape (o la carpeta C:\EmuScape) en él y pulsa Reintentar."
LangString lnkWin ${LANG_ENGLISH} "EmuScape (window)"
LangString lnkWin ${LANG_SPANISH} "EmuScape (ventana)"
LangString lnkUn ${LANG_ENGLISH} "Uninstall EmuScape"
LangString lnkUn ${LANG_SPANISH} "Desinstalar EmuScape"
LangString unDone ${LANG_ENGLISH} "${APP} was uninstalled. Your settings, emulators and games were left in $INSTDIR in case you install it again (you can delete that folder if you don't want them)."
LangString unDone ${LANG_SPANISH} "${APP} se desinstaló. Tus ajustes, emuladores y juegos se quedaron en $INSTDIR por si lo vuelves a instalar (puedes borrar esa carpeta si ya no los quieres)."

Function .onInit
  ${IfNot} ${RunningX64}
    MessageBox MB_ICONSTOP "$(need64)" /SD IDOK
    Abort
  ${EndIf}
  ; English first; Spanish is the second choice (the list remembers what was picked last time)
  StrCpy $LANGUAGE ${LANG_ENGLISH}
  StrCpy $IsUpd "0"
  ${GetParameters} $R0
  ClearErrors
  ${GetOptions} $R0 "/UPDATE" $R1
  ${IfNot} ${Errors}
    StrCpy $IsUpd "1"
    SetAutoClose true
    ReadRegStr $R2 HKCU "Software\EmuScape" "InstallerLanguage"
    StrCmp $R2 "" +2 0
      StrCpy $LANGUAGE $R2
  ${EndIf}
  ${If} $IsUpd != "1"
  ${AndIfNot} ${Silent}
    !insertmacro MUI_LANGDLL_DISPLAY
  ${EndIf}
FunctionEnd

; an update from inside EmuScape runs this installer silently (/S): open the new EmuScape when it is done
Function .onInstSuccess
  ${If} ${Silent}
  ${OrIf} $IsUpd == "1"
    Exec '"$INSTDIR\EmuScape.exe"'
  ${EndIf}
FunctionEnd

Function un.onInit
  !insertmacro MUI_UNGETLANGUAGE
FunctionEnd

!macro WaitUnlocked FILE
  !define WU_ID ${__LINE__}
  IfFileExists "${FILE}" 0 wu_done_${WU_ID}
  StrCpy $3 0
  wu_try_${WU_ID}:
    ClearErrors
    FileOpen $2 "${FILE}" a
    IfErrors 0 wu_ok_${WU_ID}
    IntOp $3 $3 + 1
    Sleep 1000
    IntCmp $3 12 0 wu_try_${WU_ID} 0
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "$(inUse)" /SD IDCANCEL IDRETRY wu_retry_${WU_ID}
    Abort
  wu_retry_${WU_ID}:
    StrCpy $3 0
    Goto wu_try_${WU_ID}
  wu_ok_${WU_ID}:
    FileClose $2
  wu_done_${WU_ID}:
  !undef WU_ID
!macroend

!macro CloseEmuScape
  ; (no system commands: an open EmuScape is found by its window and asked to close, like clicking its X)
  StrCpy $1 0
  ${Do}
    FindWindow $0 "Chrome_WidgetWin_1" "EmuScape"
    ${If} $0 == 0
      ${Break}
    ${EndIf}
    ${If} $1 == 0
    ${AndIf} $IsUpd != "1"
      MessageBox MB_OKCANCEL|MB_ICONINFORMATION "$(isOpen)" /SD IDOK IDOK +2
      Abort
    ${EndIf}
    SendMessage $0 ${WM_CLOSE} 0 0 /TIMEOUT=2000
    Sleep 700
    IntOp $1 $1 + 1
    ${If} $1 > 20
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "$(stillOpen)" /SD IDCANCEL IDRETRY +2
      Abort
      StrCpy $1 1
    ${EndIf}
  ${Loop}
  Sleep 800
  ; an EmuScape with no window (started with Windows, or left running): EmuScape watches for this file and closes itself
  IfFileExists "$INSTDIR\data\*.*" 0 +4
    FileOpen $2 "$INSTDIR\data\quit-request" w
    FileClose $2
    Sleep 2500
  ; an EmuScape still running in the background (no window) keeps its files locked: check they can be written to
  !insertmacro WaitUnlocked "$INSTDIR\EmuScape.exe"
  !insertmacro WaitUnlocked "$INSTDIR\resources\app.asar"
!macroend

Section "EmuScape" SecMain
  SectionIn RO
  !insertmacro CloseEmuScape
  SetOutPath "$INSTDIR"
  ; program files only — your data, emulators, games, bios and themes folders are not touched
  RMDir /r "$INSTDIR\resources"
  RMDir /r "$INSTDIR\locales"
  RMDir /r "$INSTDIR\code" ; code-only updates: a full install has the newest code built in
  File /r "${SRC}\*.*"
  File "/oname=EmuScape.ico" "icon.ico"
  WriteUninstaller "$INSTDIR\Uninstall EmuScape.exe"

  ; shortcuts (replace the old ones that started "Start EmuScape.bat" or Boxshelf)
  Delete "$DESKTOP\Boxshelf.lnk"
  Delete "$SMPROGRAMS\Boxshelf.lnk"
  CreateShortcut "$DESKTOP\EmuScape.lnk" "$INSTDIR\EmuScape.exe" "" "$INSTDIR\EmuScape.exe" 0
  CreateDirectory "$SMPROGRAMS\EmuScape"
  CreateShortcut "$SMPROGRAMS\EmuScape\EmuScape.lnk" "$INSTDIR\EmuScape.exe" "" "$INSTDIR\EmuScape.exe" 0
  CreateShortcut "$SMPROGRAMS\EmuScape\$(lnkWin).lnk" "$INSTDIR\EmuScape.exe" "--windowed" "$INSTDIR\EmuScape.exe" 0
  CreateShortcut "$SMPROGRAMS\EmuScape\$(lnkUn).lnk" "$INSTDIR\Uninstall EmuScape.exe"

  ; Settings → Apps (Add or remove programs)
  Delete "$INSTDIR\Desinstalar EmuScape.exe"
  WriteRegStr HKCU "Software\EmuScape" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "${UNKEY}" "DisplayName" "${APP}"
  WriteRegStr HKCU "${UNKEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNKEY}" "Publisher" "EmuScape"
  WriteRegStr HKCU "${UNKEY}" "DisplayIcon" "$INSTDIR\EmuScape.exe,0"
  WriteRegStr HKCU "${UNKEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNKEY}" "UninstallString" '"$INSTDIR\Uninstall EmuScape.exe"'
  WriteRegStr HKCU "${UNKEY}" "URLInfoAbout" "https://github.com/Faker-SD/EmuScape"
  WriteRegDWORD HKCU "${UNKEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNKEY}" "NoRepair" 1
  ${GetSize} "$INSTDIR" "/M=EmuScape.exe /S=0K /G=0" $0 $1 $2
  IntOp $0 $0 + 330000
  WriteRegDWORD HKCU "${UNKEY}" "EstimatedSize" $0
SectionEnd

Section "Uninstall"
  !insertmacro CloseEmuScape
  ; removes the program only. Your "data" folder (settings, covers), downloaded emulators, games, BIOS and themes stay.
  Delete "$INSTDIR\EmuScape.exe"
  Delete "$INSTDIR\EmuScape.ico"
  Delete "$INSTDIR\*.dll"
  Delete "$INSTDIR\*.pak"
  Delete "$INSTDIR\*.bin"
  Delete "$INSTDIR\icudtl.dat"
  Delete "$INSTDIR\vk_swiftshader_icd.json"
  Delete "$INSTDIR\LICENSE.electron.txt"
  Delete "$INSTDIR\LICENSES.chromium.html"
  Delete "$INSTDIR\version"
  RMDir /r "$INSTDIR\locales"
  RMDir /r "$INSTDIR\resources"
  RMDir /r "$INSTDIR\code"
  Delete "$INSTDIR\Uninstall EmuScape.exe"
  Delete "$INSTDIR\Desinstalar EmuScape.exe"
  Delete "$INSTDIR\data\quit-request"
  RMDir "$INSTDIR"
  Delete "$DESKTOP\EmuScape.lnk"
  RMDir /r "$SMPROGRAMS\EmuScape"
  DeleteRegKey HKCU "${UNKEY}"
  DeleteRegKey HKCU "Software\EmuScape"
  MessageBox MB_ICONINFORMATION "$(unDone)" /SD IDOK
SectionEnd
