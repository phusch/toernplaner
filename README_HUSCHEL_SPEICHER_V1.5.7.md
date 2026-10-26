# Törnplaner / Chillout Pirates – Huschel App Speicher V1.5.7 (SICHERHEITS-TEST)

**Verbindliche Quelle:** Ausschließlich die am 26.10.2026 hochgeladene `toernplaner.zip`.
Die vorhandene Anwendung trägt laut README den Stand V1.5.6 (Wise-/Zahlungsstatus).
V1.5.7 ergänzt **nur** den separat erreichbaren Huschel App Speicher.

## WICHTIG: Laufende echte Daten schützen

Die ZIP enthält **Programmdateien**, nicht zwangsläufig deinen aktuell im Browser gespeicherten Arbeitsstand. Deine realen Törns/Zahlungen liegen im bisherigen Browser-Speicher sowie gegebenenfalls in deinem bisherigen separaten Supabase-Projekt. Die ZIP darf **niemals** als vollständige Sicherung deiner Live-Daten verstanden werden.

**Bevor du Dateien im produktiven GitHub-Repository ersetzt:**
1. Aktuelle produktive App auf dem Gerät öffnen, auf dem die echten Daten liegen.
2. Offene Eingaben über die vorhandene Funktion **Speichern** sichern.
3. Unter **Hilfe & Handbuch → Backup → Backup erstellen** das vorhandene Gesamt-JSON herunterladen.
4. Heruntergeladenes JSON im Finder prüfen und an einem sicheren Ort verwahren.
5. Original-Repositories/ZIP und bisherigen Supabase-Stand nicht löschen oder überschreiben.
6. Erst danach den neuen **Code** in einem sicheren Test-/Wartungszeitpunkt veröffentlichen; nicht während einer laufenden Eingabe.

**Nicht** Safari-Websitedaten/LocalStorage löschen, nicht „zurücksetzen“, nicht die alte Supabase-Datenbank neu aufsetzen. Bei Tests auf einer neuen GitHub-Pages-URL/anderem Ursprung liegen üblicherweise **nicht** deine Live-Browserdaten. Dort können nur Beispieldaten sichtbar sein – **diese niemals auf GitHub über deine echten Daten speichern**.

## Neue Oberfläche

- Gut sichtbarer 💾-Symbolbutton oben rechts (mobil) / links neben der Hilfe (Desktop)
- Separate Seite mit Zurück-Button
- Auffällige Speicherampel und unabhängiger, grüner Status „Angemeldet“
- GitHub Speichern / GitHub Laden (bevorzugt), lokale Sicherheitskopie, JSON Backup
- GitHub-Revision, letzter Speicherzeitpunkt, Konfliktschutz
- Supabase-Login mit persistierter Sitzung – **separat vom alten Törnplaner-Supabase**

Die GitHub-Sicherung umfasst **sämtliche Törns** aus `appState`, inklusive `data.people`, `data.costs`, `participantInfo`, Raten-/Zahlungseinträge, Giftmann-Logikdaten, Wise-Journal, Notizen und Zeiträumen. Sie ist ein **JSON-Schnappschuss**. Die bisherige App-Berechnung wird nicht neu implementiert oder umgestellt.

### GitHub Laden ist absichtlich nicht-destruktiv

- **„GitHub Laden / Vorschau“ verändert keinen einzigen Törn.**
- Die Vorschau zeigt verfügbare Törns und deren Zeitstempel.
- Die Aktion **„Ausgewählte Törns als neue Kopien übernehmen“** ist separat und erfordert: aktuelle JSON-Backup-Bestätigung, ausdrücklich ausgewählte Törns, keine offenen ungespeicherten Eingaben und eine zweite Bestätigung.
- Beim Kopieren erhält jeder Törn eine **neue ID** und einen Namen mit „– Sicherungskopie“. Vorhandene Törns, der aktive Törn, Zahlungen und Supabase-Einträge bleiben erhalten. `cloudMeta` wird in den neuen Kopien bewusst nicht von der früheren Supabase-Revision übernommen.
- Die neue Kopie wird zuerst in den bisherigen lokalen Browser-Speicher geschrieben, dann erst im Arbeitsspeicher ergänzt. Scheitert die lokale Speicherung (z. B. Speicherplatz), wird der laufende App-Zustand nicht umgestellt.
- Das **alte** `importBackup()` und die **alte** Supabase-Synchronisierung werden nicht ersetzt oder verändert. Bitte bei einer laufenden Abrechnung die neue „als Kopie“-Option verwenden, nicht den alten ggf. überschreibenden Cloud-Import.

### GitHub Speichern

- Nur auf ausdrücklichen Klick; es gibt **keinen automatischen GitHub-Schreibzugriff**.
- Bei ungespeicherten Eingaben wird abgebrochen und auf das vorhandene lokale „Speichern“ verwiesen.
- Vor jedem Schreibversuch wird der aktuelle GitHub-Stand frisch abgefragt; bei abweichenden Daten wird ausdrücklich bestätigt.
- Beim Schreiben nutzt die bestehende Supabase Edge Function den aktuellen GitHub-Datei-`sha`, damit keine stille Überschreibung nach Zwischenänderung möglich ist.
- Identische Daten erzeugen keine neue Revision.
- Die bisherige Törnplaner-Supabase-Tabelle `trips` / `trip_states` wird weder geschrieben noch verändert.

## Supabase / GitHub – nur ein Eintrag

Bestehendes Huschel-Speicherprojekt: `huschel-speicher-pilot`  
URL: `https://qijordwpbwwbizfcslrv.supabase.co`  
Edge Function: `github-app-storage`  
Privates Repository: `phusch/huschel-app-data`  
Neuer Dateipfad: `toernplaner/data.json`

**Prüfe** im bestehenden Servercode der Edge Function, ob im Objekt `APPS` schon der Eintrag vorhanden ist. Wenn nicht, **nur** diese eine Zeile zum existierenden Objekt hinzufügen:

```ts
"toernplaner": "toernplaner/data.json",
```

**Alle anderen App-IDs, Serverfunktionen, Token-Secrets, Benutzer-UIDs, JWT-Einstellungen erhalten.** Änderungen an der Edge Function können andere Apps betreffen; den Code vorher sichern und den eingefügten Eintrag genau prüfen. GitHub-Token `GITHUB_TOKEN` bleibt ausschließlich als Supabase-Secret; **niemals** im Browser. Im HTML wird ausschließlich der Publishable Key des Huschel-Projekts eingegeben. Keine Zugangsdaten in die ZIP schreiben.

Die alte Törnplaner-Supabase-Cloud benötigt weiterhin ihre **eigenen** bisherigen Zugangsdaten. Diese nicht durch die des neuen Huschel-Projekts ersetzen.

## Geänderte / neue Dateien

- `index.html`: nur drei additive Bestandteile (CSS-Einbindung, 💾-Button mit separater Speicherseite, kleine Datenbrücke am Ende des bestehenden Skripts sowie Einbindung des neuen Moduls). **Keine bestehende Berechnungs- oder Fachfunktion verändert.**
- `huschel-toern-speicher.js`: neues, separates Speichermodul.
- `huschel-toern-speicher.css`: gekapselte Darstellung ohne Styling-Änderungen an bestehenden Seiten.
- `sw.js`: ausschließlich neues Cache-Kennzeichen sowie Vorladen der beiden neuen Speicherdateien statt eines in der Original-ZIP nicht vorhandenen `app.js`. Keine Änderung des Fetch-/Offline-Verhaltens.
- `README_HUSCHEL_SPEICHER_V1.5.7.md`: diese Anleitung.

Alle übrigen mitgelieferten Originaldateien sind bytegleich geblieben. Die vorhandenen Historien-Patches sind nur als Referenzdateien enthalten; nicht ausführen. Das Git-Verzeichnis und macOS-Metadatendateien gehören nicht zum Runtime-Paket und wurden nicht übernommen.

## Kontrollierter Test (nach Original-Backup)

1. Vor der neuen Version ein **echtes** JSON-Backup des produktiven Stands sichern.
2. Neue Dateien im GitHub-Repository veröffentlichen, im Browser neu laden **ohne Browserdaten zu löschen**.
3. Kontrollieren, dass bestehende Törns, Wise-Buchungen und Teilnehmerzahlungen unverändert erscheinen.
4. 💾 öffnen: bisherige Supabase-Cloud bleibt im Reiter **Törns**, neue Huschel-Seite ist davon getrennt.
5. Bei der ersten Anmeldung den Publishable Key von `huschel-speicher-pilot`, die bereits genutzte E-Mail und das Passwort verwenden.
6. **Zuerst JSON-Backup erstellen**, dann „GitHub Laden / Vorschau“ (falls Speicherordner leer, klare Meldung).
7. „GitHub Speichern“ nur auf dem **Originalgerät mit aktuellem Live-Datenstand** ausführen; nicht aus einer Test-URL mit Beispieldaten. Den gespeicherten Stand danach über „GitHub Laden / Vorschau“ überprüfen; nichts importieren müssen.
8. App schließen und wieder öffnen: Supabase-Anmeldung sollte automatisch erhalten bleiben.
9. Optional auf einem anderen Gerät einen gesicherten Törn als **Kopie** übernehmen – bestehende Törns bleiben erhalten.

## Grenzen / Sicherheit

- GitHub ist hier ein zusätzliches **manuell ausgelöstes Backup**, keine automatische Zwei-Wege-Synchronisierung.
- GitHub-Revisionsschutz schützt Cloud-Schreibkonflikte. Die neue Importfunktion überschreibt niemals bestehende Törns.
- Der ursprüngliche Törnplaner und dessen bestehende Supabase-Cloud können bisher wie gewohnt weiterhin schreibende Aktionen ausführen; deren eigene bestehende Importfunktionen werden absichtlich nicht verändert.
- Bei Verlust der Browserdaten ohne vorherige Sicherung können nicht auf GitHub/Lokal/JSON gesicherte neue Änderungen verloren gehen.
- Das private Repository enthält nach einer Speicherung **sensible Teilnehmer- und Zahlungsinformationen**. GitHub-Kontozugriff mit 2FA schützen und Repository privat lassen.
- Wenn du nicht auf einem Live-Gerät testest, enthält die hochgeladene Code-ZIP möglicherweise nur Demo-/Ursprungsdaten. Kein GitHub-Speichern damit durchführen!

**Status:** Sicherheits-Testversion, nicht produktiv freigegeben; echter GitHub-Test steht aus. Die originale `toernplaner.zip` bleibt unberührt.
