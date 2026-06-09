!macro customInit
  ; Verifica permissao de administrador
  UserInfo::GetAccountType
  Pop $0
  ${If} $0 != "admin"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Este instalador requer permissoes de administrador.$\n$\nClique com o botao direito e selecione 'Executar como administrador'."
    Quit
  ${EndIf}

  ; Cria pasta de dados oculta
  CreateDirectory "$LOCALAPPDATA\ContaFlow"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data\database"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data\logs"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data\backups"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data\config"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data\certificates"
  CreateDirectory "$LOCALAPPDATA\ContaFlow\.contaflow-data\attachments"

  ; Define atributos de pasta oculta (HIDDEN + SYSTEM)
  System::Call 'kernel32::SetFileAttributes(t "$LOCALAPPDATA\ContaFlow\.contaflow-data", i 0x06)i.r0'
  System::Call 'kernel32::SetFileAttributes(t "$LOCALAPPDATA\ContaFlow\.contaflow-data\database", i 0x06)i.r0'
  System::Call 'kernel32::SetFileAttributes(t "$LOCALAPPDATA\ContaFlow\.contaflow-data\logs", i 0x06)i.r0'
!macroend

!macro customInstallMode
  ; Forca modo todas as usuarios (admin)
  StrCpy $isForceCurrentUsers "0"
!macroend

!macro customHeader
  !system "echo # Custom NSIS Header >> $TEMP\contaflow_header.nsh"
!macroend
