; ContaFlow - Instalador NSIS
; Desenvolvido por: Marcelo Desenvolvedor
; Tel: (21) 98132-5441
; Email: mareclobradrj@gmail.com

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"

!define APP_NAME "ContaFlow"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Marcelo Desenvolvedor"
!define APP_EMAIL "mareclobradrj@gmail.com"
!define APP_PHONE "(21) 98132-5441"
!define APP_EXE "ContaFlow.exe"
!define APP_DESC "Sistema Contabil Inteligente"

Name "${APP_NAME} ${APP_VERSION}"
OutFile "ContaFlow-Setup-1.0.0.exe"
InstallDir "$PROGRAMFILES\${APP_NAME}"
InstallDirRegKey HKLM "Software\${APP_NAME}" "InstallDir"
RequestExecutionLevel admin
SetCompressor /SOLID lzma

!define MUI_ICON "C:\Users\marce\OneDrive\Desktop\SISTEMA CONTABIL\desktop\electron\assets\icon.ico"
!define MUI_UNICON "C:\Users\marce\OneDrive\Desktop\SISTEMA CONTABIL\desktop\electron\assets\icon.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Bem-vindo ao ${APP_NAME}"
!define MUI_WELCOMEPAGE_TEXT "Assistente de instalacao do ${APP_NAME} v${APP_VERSION}$\n$\nSistema Contabil Inteligente com multi-tenant, criptografia e integracao governamental.$\n$\nDesenvolvido por: ${APP_PUBLISHER}$\nTel: ${APP_PHONE}$\nEmail: ${APP_EMAIL}"
!define MUI_FINISHPAGE_RUN "$INSTDIR\${APP_EXE}"
!define MUI_FINISHPAGE_RUN_TEXT "Iniciar ${APP_NAME}"
!define MUI_FINISHPAGE_LINK "Acessar site"
!define MUI_FINISHPAGE_LINK_LOCATION "https://github.com/kdkhost/contaflow"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "C:\Users\marce\OneDrive\Desktop\SISTEMA CONTABIL\desktop\electron\LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "PortugueseBR"
!insertmacro MUI_LANGUAGE "English"

Section "Principal" SecMain
  SetOutPath "$INSTDIR"
  SetOverwrite on

  ; Copia todos os arquivos do app
  File /r "C:\Users\marce\OneDrive\Desktop\SISTEMA CONTABIL\desktop\dist-electron\win-unpacked\*.*"

  ; Cria pastas de dados criptografadas
  CreateDirectory "$INSTDIR\.contaflow-data"
  CreateDirectory "$INSTDIR\.contaflow-data\database"
  CreateDirectory "$INSTDIR\.contaflow-data\logs"
  CreateDirectory "$INSTDIR\.contaflow-data\backups"
  CreateDirectory "$INSTDIR\.contaflow-data\config"
  CreateDirectory "$INSTDIR\.contaflow-data\certificates"
  CreateDirectory "$INSTDIR\.contaflow-data\attachments"

  ; Define atributos de pasta oculta/sistema
  System::Call 'kernel32::SetFileAttributes(t "$INSTDIR\.contaflow-data", i 0x06)i.r0'
  System::Call 'kernel32::SetFileAttributes(t "$INSTDIR\.contaflow-data\database", i 0x06)i.r0'
  System::Call 'kernel32::SetFileAttributes(t "$INSTDIR\.contaflow-data\logs", i 0x06)i.r0'
  System::Call 'kernel32::SetFileAttributes(t "$INSTDIR\.contaflow-data\backups", i 0x06)i.r0'
  System::Call 'kernel32::SetFileAttributes(t "$INSTDIR\.contaflow-data\config", i 0x06)i.r0'

  ; Salva registro de instalacao
  WriteRegStr HKLM "Software\${APP_NAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\${APP_NAME}" "Version" "${APP_VERSION}"
  WriteRegStr HKLM "Software\${APP_NAME}" "Publisher" "${APP_PUBLISHER}"

  ; Cria desinstalador
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Registra no Programs and Features
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" "$INSTDIR\${APP_EXE}"

  ; Calcula tamanho
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "EstimatedSize" "$0"

  ; Atalho na area de trabalho
  CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0

  ; Atalho no Menu Iniciar
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\Desinstalar.lnk" "$INSTDIR\Uninstall.exe"

  ; Registra execucao no first run
  WriteRegStr HKLM "Software\${APP_NAME}" "Installed" "1"
SectionEnd

Section "Uninstall"
  ; Remove atalhos
  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APP_NAME}"

  ; Remove arquivos
  RMDir /r "$INSTDIR"

  ; Remove registros
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
  DeleteRegKey HKLM "Software\${APP_NAME}"
SectionEnd
