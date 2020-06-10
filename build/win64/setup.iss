
#define MyAppName "NanoCell"
#define MyAppPublisher "NanoCell"
#define MyAppURL "http://nanocell-csv.com"
#define MyAppExeName "NanoCell.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{173988E7-88B0-40E7-8E1C-1C14F40076BD}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
; Uncomment the following line to run in non administrative install mode (install for current user only.)
;PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
OutputBaseFilename=NanoCell_v{#MyAppVersion}_Win64_setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
;Source: "C:\Users\cbonj\CedricBonjour.github.io\NanoCell\build\tmp\win64\NanoCell.exe"; DestDir: "{app}"; Flags: ignoreversion
;Source: "C:\Users\cbonj\CedricBonjour.github.io\NanoCell\build\tmp\win64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs 

Source: "..\tmp\win64\NanoCell.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\tmp\win64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs



; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

